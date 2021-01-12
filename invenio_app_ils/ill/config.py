# -*- coding: utf-8 -*-
#
# Copyright (C) 2019-2020 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""Configuration for Invenio ILS ILL module."""
from invenio_indexer.api import RecordIndexer
from invenio_records_rest.facets import terms_filter

from invenio_app_ils.permissions import (PatronOwnerPermission,
                                         authenticated_user_permission,
                                         backoffice_permission,
                                         superuser_permission)

from .api import (BORROWING_REQUEST_PID_FETCHER, BORROWING_REQUEST_PID_MINTER,
                  BORROWING_REQUEST_PID_TYPE, LIBRARY_PID_FETCHER,
                  LIBRARY_PID_MINTER, LIBRARY_PID_TYPE, BorrowingRequest,
                  Library)
from .indexer import LibraryIndexer
from .search import BorrowingRequestsSearch, LibrarySearch

###############################################################################
# ILS ILL
###############################################################################
#: ILL message creator class
ILS_ILL_MAIL_MSG_CREATOR = (
    "invenio_app_ils.ill.mail.factory:default_ill_message_creator"
)
#: ILL email templates
ILS_ILL_MAIL_TEMPLATES = {}

###############################################################################
# RECORDS REST
###############################################################################

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
        search_factory_imp="invenio_app_ils.search_permissions"
        ":search_factory_filter_by_patron",
        indexer_class=RecordIndexer,
        record_class=BorrowingRequest,
        record_loaders={
            "application/json": (
                "invenio_app_ils.ill.loaders:borrowing_request_loader"
            )
        },
        record_serializers={
            "application/json": (
                "invenio_app_ils.ill.serializers:json_v1_response"
            )
        },
        search_serializers={
            "application/json": (
                "invenio_app_ils.ill.serializers:json_v1_search"
            ),
            "text/csv": ("invenio_app_ils.ill.serializers:csv_v1_search"),
        },
        list_route="/ill/borrowing-requests/",
        item_route="/ill/borrowing-requests/<{0}:pid_value>".format(
            _BORROWING_REQUEST_CONVERTER
        ),
        default_media_type="application/json",
        max_result_window=10000,
        error_handlers=dict(),
        read_permission_factory_imp=PatronOwnerPermission,
        list_permission_factory_imp=authenticated_user_permission,  # auth via search_factory
        create_permission_factory_imp=backoffice_permission,
        update_permission_factory_imp=backoffice_permission,
        delete_permission_factory_imp=superuser_permission,
    ),
    illlid=dict(
        pid_type=LIBRARY_PID_TYPE,
        pid_minter=LIBRARY_PID_MINTER,
        pid_fetcher=LIBRARY_PID_FETCHER,
        search_class=LibrarySearch,
        indexer_class=LibraryIndexer,
        record_class=Library,
        record_loaders={
            "application/json": ("invenio_app_ils.ill.loaders:library_loader")
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
        item_route="/ill/libraries/<{0}:pid_value>".format(_LIBRARY_CONVERTER),
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
    ill_borrowing_requests=dict(  # BorrowingRequestsSearch.Meta.index
        created=dict(fields=["_created"], title="Recently added", order=1),
        bestmatch=dict(
            fields=["-_score"],
            title="Best match",
            order=2,
        ),
        request_date=dict(
            fields=["request_date"],
            title="Request date",
            order=3,
        ),
        expected_delivery_date=dict(
            fields=["expected_delivery_date"],
            title="Expected delivery date",
            order=4,
        ),
        due_date=dict(
            fields=["due_date"],
            title="Due date",
            order=6,
        ),
    ),
    ill_libraries=dict(  # LibrarySearch.Meta.index
        name=dict(fields=["name.keyword"], title="Name", order=1),
        created=dict(
            fields=["_created"],
            title="Recently added",
            order=2,
        ),
        bestmatch=dict(
            fields=["-_score"],
            title="Best match",
            order=3,
        ),
    ),
)

FACET_LIBRARYLIMIT = 5

RECORDS_REST_FACETS = dict(
    ill_borrowing_requests=dict(  # BorrowingRequestsSearch.Meta.index
        aggs=dict(
            status=dict(terms=dict(field="status")),
            library=dict(
                terms=dict(
                    field="library.name.keyword", size=FACET_LIBRARYLIMIT
                )
            ),
            patron_loan_extension=dict(
                terms=dict(field="patron_loan.extension.status")
            ),
            type=dict(terms=dict(field="type")),
            payment_mode=dict(terms=dict(field="payment.mode")),
        ),
        post_filters=dict(
            status=terms_filter("status"),
            library=terms_filter("library.name.keyword"),
            patron_loan_extension=terms_filter("patron_loan.extension.status"),
            type=terms_filter("terms"),
            payment_mode=terms_filter("payment.mode"),
        ),
    )
)
