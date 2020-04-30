# -*- coding: utf-8 -*-
#
# Copyright (C) 2019-2020 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""Configuration for Invenio ILS acquisition module."""

from invenio_indexer.api import RecordIndexer
from invenio_records_rest.facets import terms_filter

from invenio_app_ils.permissions import backoffice_permission, deny_all

from .api import ORDER_PID_FETCHER, ORDER_PID_MINTER, ORDER_PID_TYPE, \
    VENDOR_PID_FETCHER, VENDOR_PID_MINTER, VENDOR_PID_TYPE, Order, Vendor
from .indexer import OrderIndexer
from .search import OrderSearch, VendorSearch

_ORDER_CONVERTER = (
    'pid(acqoid, record_class="invenio_app_ils.acquisition.api:Order")'
)
_VENDOR_CONVERTER = (
    'pid(acqvid, record_class="invenio_app_ils.acquisition.api:Vendor")'
)

RECORDS_REST_ENDPOINTS = dict(
    acqoid=dict(
        pid_type=ORDER_PID_TYPE,
        pid_minter=ORDER_PID_MINTER,
        pid_fetcher=ORDER_PID_FETCHER,
        search_class=OrderSearch,
        record_class=Order,
        indexer_class=OrderIndexer,
        record_loaders={
            "application/json": (
                "invenio_app_ils.acquisition.loaders:order_loader"
            )
        },
        record_serializers={
            "application/json": (
                "invenio_app_ils.records.serializers:json_v1_response"
            )
        },
        search_serializers={
            "application/json": (
                "invenio_app_ils.records.serializers:json_v1_search"
            ),
            "text/csv": ("invenio_app_ils.records.serializers:csv_v1_search"),
        },
        list_route="/acquisition/orders/",
        item_route="/acquisition/orders/<{0}:pid_value>".format(
            _ORDER_CONVERTER
        ),
        default_media_type="application/json",
        max_result_window=10000,
        error_handlers=dict(),
        read_permission_factory_imp=backoffice_permission,
        list_permission_factory_imp=backoffice_permission,
        create_permission_factory_imp=backoffice_permission,
        update_permission_factory_imp=backoffice_permission,
        delete_permission_factory_imp=deny_all,
    ),
    acqvid=dict(
        pid_type=VENDOR_PID_TYPE,
        pid_minter=VENDOR_PID_MINTER,
        pid_fetcher=VENDOR_PID_FETCHER,
        search_class=VendorSearch,
        indexer_class=RecordIndexer,
        record_class=Vendor,
        record_loaders={
            "application/json": (
                "invenio_app_ils.acquisition.loaders:vendor_loader"
            )
        },
        record_serializers={
            "application/json": (
                "invenio_app_ils.records.serializers:json_v1_response"
            )
        },
        search_serializers={
            "application/json": (
                "invenio_app_ils.records.serializers:json_v1_search"
            )
        },
        list_route="/acquisition/vendors/",
        item_route="/acquisition/vendors/<{0}:pid_value>".format(
            _VENDOR_CONVERTER
        ),
        default_media_type="application/json",
        max_result_window=10000,
        error_handlers=dict(),
        read_permission_factory_imp=backoffice_permission,
        list_permission_factory_imp=backoffice_permission,
        create_permission_factory_imp=backoffice_permission,
        update_permission_factory_imp=backoffice_permission,
        delete_permission_factory_imp=backoffice_permission,
    ),
)

RECORDS_REST_SORT_OPTIONS = dict(
    acq_orders=dict(  # OrderSearch.Meta.index
        mostrecent=dict(
            fields=["_updated"], title="Newest", default_order="desc", order=1
        ),
        order_date=dict(
            fields=["order_date"],
            title="Order date",
            default_order="desc",
            order=2,
        ),
        grand_total=dict(
            fields=["grand_total_main_currency.value"],
            title="Total",
            default_order="desc",
            order=3,
        ),
        received_date=dict(
            fields=["received_date"],
            title="Received date",
            default_order="desc",
            order=4,
        ),
        expected_delivery_date=dict(
            fields=["expected_delivery_date"],
            title="Expected delivery date",
            default_order="desc",
            order=5,
        ),
        bestmatch=dict(
            fields=["-_score"],
            title="Best match",
            default_order="asc",
            order=6,
        ),
    ),
    acq_vendors=dict(  # VendorSearch.Meta.index
        name=dict(
            fields=["name"], title="Name", default_order="desc", order=1
        ),
        bestmatch=dict(
            fields=["-_score"],
            title="Best match",
            default_order="asc",
            order=2,
        ),
    ),
)

FACET_VENDOR_LIMIT = 5

RECORDS_REST_FACETS = dict(
    acq_orders=dict(  # OrderSearch.Meta.index
        aggs=dict(
            status=dict(terms=dict(field="status")),
            vendor=dict(
                terms=dict(
                    field="vendor.name.keyword", size=FACET_VENDOR_LIMIT
                )
            ),
            payment_mode=dict(terms=dict(field="order_lines.payment_mode")),
            medium=dict(terms=dict(field="order_lines.medium")),
        ),
        post_filters=dict(
            status=terms_filter("status"),
            vendor=terms_filter("vendor.name.keyword"),
            payment_mode=terms_filter("order_lines.payment_mode"),
            medium=terms_filter("order_lines.medium"),
        ),
    )
)
