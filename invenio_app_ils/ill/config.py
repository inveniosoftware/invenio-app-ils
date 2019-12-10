# -*- coding: utf-8 -*-
#
# Copyright (C) 2019 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""Configuration for Invenio ILS ILL module."""

from invenio_indexer.api import RecordIndexer

from invenio_app_ils.permissions import backoffice_permission

from .api import BorrowingRequest, Library
from .indexer import LibraryIndexer
from .pidstore.pids import BORROWING_REQUEST_PID_FETCHER, \
    BORROWING_REQUEST_PID_MINTER, BORROWING_REQUEST_PID_TYPE, \
    LIBRARY_PID_FETCHER, LIBRARY_PID_MINTER, LIBRARY_PID_TYPE
from .search import BorrowingRequestsSearch, LibrarySearch

_BORROWING_REQUEST_CONVERTER = (
    'pid(illbid, record_class="invenio_app_ils.ill.api:BorrowingRequest")'
)
_LIBRARY_CONVERTER = (
    'pid(illlid, record_class="invenio_app_ils.ill.api:Library")'
)

RECORDS_REST_ENDPOINTS = dict(
    illbid=dict(
        pid_type=BORROWING_REQUEST_PID_TYPE,
        pid_minter=BORROWING_REQUEST_PID_MINTER,
        pid_fetcher=BORROWING_REQUEST_PID_FETCHER,
        search_class=BorrowingRequestsSearch,
        indexer_class=RecordIndexer,
        record_class=BorrowingRequest,
        record_loaders={
            "application/json": (
                "invenio_app_ils.ill.loaders:borrowing_request_loader"
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
        list_route="/ill/borrowing-requests/",
        item_route="/ill/borrowing-requests/<{0}:pid_value>".format(
            _BORROWING_REQUEST_CONVERTER
        ),
        default_media_type="application/json",
        max_result_window=10000,
        error_handlers=dict(),
        read_permission_factory_imp=backoffice_permission,
        create_permission_factory_imp=backoffice_permission,
        update_permission_factory_imp=backoffice_permission,
        delete_permission_factory_imp=backoffice_permission,
    ),
    illlid=dict(
        pid_type=LIBRARY_PID_TYPE,
        pid_minter=LIBRARY_PID_MINTER,
        pid_fetcher=LIBRARY_PID_FETCHER,
        search_class=LibrarySearch,
        indexer_class=LibraryIndexer,
        record_class=Library,
        record_loaders={
            "application/json": (
                "invenio_app_ils.ill.loaders:library_loader"
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
        list_route="/ill/libraries/",
        item_route="/ill/libraries/<{0}:pid_value>".format(
            _LIBRARY_CONVERTER
        ),
        default_media_type="application/json",
        max_result_window=10000,
        error_handlers=dict(),
        read_permission_factory_imp=backoffice_permission,
        create_permission_factory_imp=backoffice_permission,
        update_permission_factory_imp=backoffice_permission,
        delete_permission_factory_imp=backoffice_permission,
    ),
)
