# -*- coding: utf-8 -*-
#
# Copyright (C) 2019 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""Configuration for Invenio ILS acquisition module."""

from invenio_indexer.api import RecordIndexer

from invenio_app_ils.permissions import backoffice_permission, deny_all

from .api import Order, Vendor
from .indexer import OrderIndexer
from .pidstore.pids import ORDER_PID_FETCHER, ORDER_PID_MINTER, \
    ORDER_PID_TYPE, VENDOR_PID_FETCHER, VENDOR_PID_MINTER, VENDOR_PID_TYPE
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
            )
        },
        list_route='/acquisition/orders/',
        item_route='/acquisition/orders/<{0}:pid_value>'.format(
            _ORDER_CONVERTER
        ),
        default_media_type='application/json',
        max_result_window=10000,
        error_handlers=dict(),
        read_permission_factory_imp=backoffice_permission,
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
        list_route='/acquisition/vendors/',
        item_route='/acquisition/vendors/<{0}:pid_value>'.format(
            _VENDOR_CONVERTER
        ),
        default_media_type='application/json',
        max_result_window=10000,
        error_handlers=dict(),
        read_permission_factory_imp=backoffice_permission,
        create_permission_factory_imp=backoffice_permission,
        update_permission_factory_imp=backoffice_permission,
        delete_permission_factory_imp=backoffice_permission,
    ),
)
