# -*- coding: utf-8 -*-
#
# Copyright (C) 2019-2020 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""Configuration for Invenio ILS ILL module."""
from invenio_indexer.api import RecordIndexer
from invenio_records_rest.facets import terms_filter

from invenio_app_ils.config import RECORDS_REST_MAX_RESULT_WINDOW
from invenio_app_ils.permissions import (
    PatronOwnerPermission,
    authenticated_user_permission,
    backoffice_permission,
    superuser_permission,
)

from .api import (
    BORROWING_REQUEST_PID_FETCHER,
    BORROWING_REQUEST_PID_MINTER,
    BORROWING_REQUEST_PID_TYPE,
    BorrowingRequest,
)
from .notifications.api import ill_notifications_filter
from .search import BorrowingRequestsSearch

###############################################################################
# ILS ILL
###############################################################################
ILS_ILL_NOTIFICATIONS_MSG_BUILDER = (
    "invenio_app_ils.ill.notifications.messages:notification_ill_msg_builder"  # noqa
)
# Override default templates
ILS_ILL_NOTIFICATIONS_TEMPLATES = {}
# Function to select and filter which notifications should be sent
ILS_ILL_NOTIFICATIONS_FILTER = ill_notifications_filter

###############################################################################
# RECORDS REST
###############################################################################

_BORROWING_REQUEST_CONVERTER = (
    'pid(illbid, record_class="invenio_app_ils.ill.api:BorrowingRequest")'
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
            "application/json": "invenio_app_ils.ill.loaders:borrowing_request_loader"
        },
        record_serializers={
            "application/json": "invenio_app_ils.ill.serializers:json_v1_response"
        },
        search_serializers={
            "application/json": "invenio_app_ils.ill.serializers:json_v1_search",
            "text/csv": "invenio_app_ils.ill.serializers:csv_v1_search",
        },
        search_serializers_aliases={
            "csv": "text/csv",
            "json": "application/json",
        },
        list_route="/ill/borrowing-requests/",
        item_route="/ill/borrowing-requests/<{0}:pid_value>".format(
            _BORROWING_REQUEST_CONVERTER
        ),
        default_media_type="application/json",
        max_result_window=RECORDS_REST_MAX_RESULT_WINDOW,
        error_handlers=dict(),
        read_permission_factory_imp=PatronOwnerPermission,
        # auth via search_factory
        list_permission_factory_imp=authenticated_user_permission,
        create_permission_factory_imp=backoffice_permission,
        update_permission_factory_imp=backoffice_permission,
        delete_permission_factory_imp=superuser_permission,
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
)

FACET_PROVIDER_LIMIT = 5

RECORDS_REST_FACETS = dict(
    ill_borrowing_requests=dict(  # BorrowingRequestsSearch.Meta.index
        aggs=dict(
            status=dict(terms=dict(field="status")),
            provider=dict(
                terms=dict(field="provider.name.keyword", size=FACET_PROVIDER_LIMIT)
            ),
            patron_loan_extension=dict(
                terms=dict(field="patron_loan.extension.status")
            ),
            type=dict(terms=dict(field="type")),
            payment_mode=dict(terms=dict(field="payment.mode")),
        ),
        post_filters=dict(
            status=terms_filter("status"),
            provider=terms_filter("provider.name.keyword"),
            patron_loan_extension=terms_filter("patron_loan.extension.status"),
            type=terms_filter("type"),
            payment_mode=terms_filter("payment.mode"),
        ),
    )
)
