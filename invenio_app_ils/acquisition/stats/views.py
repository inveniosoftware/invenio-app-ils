# -*- coding: utf-8 -*-
#
# Copyright (C) 2025 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""Invenio App ILS acquisition stats views."""

from flask import Blueprint, request
from invenio_records_rest.query import default_search_factory
from invenio_rest import ContentNegotiatedMethodView
from marshmallow.exceptions import ValidationError

from invenio_app_ils.acquisition.api import ORDER_PID_TYPE
from invenio_app_ils.acquisition.proxies import current_ils_acq
from invenio_app_ils.errors import InvalidParameterError
from invenio_app_ils.permissions import need_permissions
from invenio_app_ils.stats.histogram import (
    HistogramParamsSchema,
    create_histogram_view,
    get_record_statistics,
)


def create_acquisition_stats_blueprint(app):
    """Add statistics views to the blueprint."""
    blueprint = Blueprint("invenio_app_ils_acquisition_stats", __name__, url_prefix="")

    create_histogram_view(
        blueprint, app, ORDER_PID_TYPE, OrderHistogramResource, "/acquisition"
    )

    return blueprint


class OrderHistogramResource(ContentNegotiatedMethodView):
    """Order stats resource."""

    view_name = "order_histogram"

    def __init__(self, serializers, ctx, *args, **kwargs):
        """Constructor."""
        super().__init__(serializers, *args, **kwargs)
        for key, value in ctx.items():
            setattr(self, key, value)

    @need_permissions("stats-orders")
    def get(self, **kwargs):
        """Get order statistics."""

        order_date_fields = [
            "order_date",
            "expected_delivery_date",
            "received_date",
            "_created",
            "_updated",
        ]

        schema = HistogramParamsSchema(order_date_fields)
        try:
            parsed_args = schema.load(request.args.to_dict())
        except ValidationError as e:
            raise InvalidParameterError(description=e.messages) from e

        # Construct search to allow for filtering with the q parameter
        search_cls = current_ils_acq.order_search_cls
        search = search_cls()
        search, _ = default_search_factory(self, search)

        aggregation_buckets = get_record_statistics(
            order_date_fields,
            search,
            parsed_args["group_by"],
            parsed_args["metrics"],
        )

        response = {
            "buckets": aggregation_buckets,
        }

        return self.make_response(response, 200)
