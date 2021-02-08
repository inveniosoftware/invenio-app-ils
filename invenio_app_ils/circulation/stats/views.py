# -*- coding: utf-8 -*-
#
# Copyright (C) 2019 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""Invenio App ILS circulation stats views."""

from datetime import datetime

from flask import Blueprint, current_app, request
from invenio_pidstore import current_pidstore
from invenio_records_rest.utils import obj_or_import_string
from invenio_rest import ContentNegotiatedMethodView

from invenio_app_ils.circulation.stats.api import fetch_most_loaned_documents
from invenio_app_ils.config import RECORDS_REST_MAX_RESULT_WINDOW
from invenio_app_ils.documents.api import (
    DOCUMENT_PID_FETCHER,
    DOCUMENT_PID_TYPE,
)
from invenio_app_ils.errors import InvalidParameterError
from invenio_app_ils.permissions import need_permissions


def create_most_loaned_documents_view(blueprint, app):
    """Add url rule for most loaned documents."""
    endpoints = app.config.get("RECORDS_REST_ENDPOINTS", [])
    document_endpoint = endpoints.get(DOCUMENT_PID_TYPE, {})
    default_media_type = document_endpoint.get("default_media_type", "")
    search_serializers_aliases = document_endpoint.get(
        "search_serializers_aliases", ""
    )
    search_serializers = document_endpoint.get("search_serializers")
    serializers = {
        mime: obj_or_import_string(func)
        for mime, func in search_serializers.items()
    }

    view_class = MostLoanedDocumentsResource

    blueprint.add_url_rule(
        "/circulation/stats/most-loaned",
        view_func=view_class.as_view(
            view_class.view_name,
            serializers=serializers,
            serializers_query_aliases=search_serializers_aliases,
            default_media_type=default_media_type,
        ),
        methods=["GET"],
    )


def create_circulation_stats_blueprint(app):
    """Add statistics views to the blueprint."""
    blueprint = Blueprint(
        "invenio_app_ils_circulation_stats", __name__, url_prefix=""
    )

    create_most_loaned_documents_view(blueprint, app)

    return blueprint


class MostLoanedDocumentsResource(ContentNegotiatedMethodView):
    """Statistics view for the documents with the most loans."""

    view_name = "most-loaned"
    default_bucket_size = 30

    def __init__(self, *args, **kwargs):
        """Constructor."""
        super().__init__(*args, **kwargs)
        endpoints = current_app.config.get("RECORDS_REST_ENDPOINTS", [])
        document_endpoint = endpoints.get(DOCUMENT_PID_TYPE, {})
        self.max_result_window = document_endpoint.get(
            "max_result_window", RECORDS_REST_MAX_RESULT_WINDOW
        )

    def _validate_bucket_size(self):
        """Validate bucket size parameter."""
        size_param = request.args.get("size", self.default_bucket_size)
        try:
            value = int(size_param)
        except ValueError:
            msg = "Parameter `size` is not a number: {}".format(size_param)
            raise InvalidParameterError(description=msg)

        if value > self.max_result_window:
            msg = "Parameter `size` should be lower than {}".format(
                self.max_result_window
            )
            raise InvalidParameterError(description=msg)
        return value

    def _validate_start_date_range(self):
        """Validate start date range parameters."""

        def validate_date(param, date):
            """Validate a date."""
            try:
                return datetime.strptime(date, "%Y-%m-%d")
            except ValueError:
                msg = "Parameter '{}' is invalid: {}".format(param, date)
                raise InvalidParameterError(description=msg)

        from_date = request.args.get("from_date", None)
        from_date_obj = None
        to_date = request.args.get("to_date", None)
        to_date_obj = None

        if from_date:
            from_date_obj = validate_date("from_date", from_date)
        if to_date:
            to_date_obj = validate_date("to_date", to_date)

        if from_date_obj and to_date_obj and to_date_obj < from_date_obj:
            msg = "Parameter 'to_date' cannot be before 'from_date'."
            raise InvalidParameterError(description=msg)

        return from_date, to_date

    @need_permissions("stats-most-loaned")
    def get(self, *args, **kwargs):
        """Get the most loaned documents and include the extension count.

        Params:
            {
                from_date: start date,
                to_date: end date,
                [size: maximum number of documents to return (buckets)]
            }
        """
        size = self._validate_bucket_size()
        from_date, to_date = self._validate_start_date_range()
        most_loaned_documents = fetch_most_loaned_documents(
            from_date, to_date, size
        )
        return self.make_response(
            pid_fetcher=current_pidstore.fetchers[DOCUMENT_PID_FETCHER],
            search_result=most_loaned_documents,
        )
