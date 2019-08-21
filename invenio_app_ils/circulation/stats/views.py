# -*- coding: utf-8 -*-
#
# Copyright (C) 2019 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""Invenio App ILS circulation stats views."""

from __future__ import absolute_import, print_function

from datetime import datetime

from flask import Blueprint, request
from invenio_pidstore import current_pidstore
from invenio_records_rest.utils import obj_or_import_string
from invenio_rest import ContentNegotiatedMethodView

from invenio_app_ils.circulation.stats.api import fetch_most_loaned_documents
from invenio_app_ils.circulation.views import need_permissions
from invenio_app_ils.errors import InvalidParameterError
from invenio_app_ils.pidstore.pids import DOCUMENT_PID_FETCHER, \
    DOCUMENT_PID_TYPE


def create_most_loaned_documents_view(blueprint, app):
    """Add url rule for most loaned documents."""
    endpoints = app.config.get("RECORDS_REST_ENDPOINTS", [])
    document_endpoint = endpoints.get(DOCUMENT_PID_TYPE, {})

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
            serializers=serializers
        ),
        methods=["GET"]
    )


def create_stats_blueprint(app):
    """Add statistics views to the blueprint."""
    blueprint = Blueprint("invenio_app_ils_stats", __name__, url_prefix="")

    create_most_loaned_documents_view(blueprint, app)

    return blueprint


class MostLoanedDocumentsResource(ContentNegotiatedMethodView):
    """Statistics view for the documents with the most loans."""

    view_name = "most-loaned"
    bucket_size = 30

    def _validate_bucket_size(self):
        """Validate bucket size parameter."""
        size_param = request.args.get("size", self.bucket_size)
        try:
            return int(size_param)
        except ValueError:
            msg = "Parameter 'size' is invalid: {}".format(size_param)
            raise InvalidParameterError(description=msg)

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
            from_date_obj = validate_date('from_date', from_date)
        if to_date:
            to_date_obj = validate_date('to_date', to_date)

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
            from_date,
            to_date,
            size
        )
        return self.make_response(
            pid_fetcher=current_pidstore.fetchers[DOCUMENT_PID_FETCHER],
            search_result=most_loaned_documents
        )
