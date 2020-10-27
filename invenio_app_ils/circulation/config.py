# -*- coding: utf-8 -*-
#
# Copyright (C) 2020 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""Configuration for Invenio ILS circulation module."""

from invenio_circulation.api import Loan
from invenio_circulation.pidstore.pids import (_LOANID_CONVERTER,
                                               CIRCULATION_LOAN_PID_TYPE)
from invenio_circulation.search.api import LoansSearch
from invenio_circulation.transitions.transitions import (
    CreatedToPending, ItemOnLoanToItemReturned, ToCancelled)
from invenio_records_rest.facets import terms_filter

from invenio_app_ils.documents.api import document_exists
from invenio_app_ils.facets import (date_range_filter, overdue_agg,
                                    overdue_loans_filter)
from invenio_app_ils.ill.api import (can_item_circulate,
                                     circulation_default_extension_duration,
                                     circulation_default_loan_duration,
                                     circulation_item_location_retriever)
from invenio_app_ils.items.api import (get_document_pid_by_item_pid,
                                       get_item_pids_by_document_pid,
                                       item_exists)
from invenio_app_ils.patrons.api import patron_exists
from invenio_app_ils.permissions import (PatronOwnerPermission,
                                         authenticated_user_permission,
                                         backoffice_permission,
                                         loan_extend_circulation_permission,
                                         patron_owner_permission,
                                         superuser_permission)

from .api import ILS_CIRCULATION_LOAN_FETCHER, ILS_CIRCULATION_LOAN_MINTER
from .indexer import LoanIndexer
from .jsonresolvers.loan import (document_resolver, item_resolver,
                                 loan_patron_resolver)
from .transitions.transitions import ILSItemOnLoanToItemOnLoan, ILSToItemOnLoan
from .utils import (circulation_build_document_ref, circulation_build_item_ref,
                    circulation_build_patron_ref, circulation_can_be_requested,
                    circulation_default_extension_max_count,
                    circulation_is_loan_duration_valid,
                    circulation_loan_will_expire_days,
                    circulation_location_validator,
                    circulation_transaction_location_validator,
                    circulation_transaction_user_validator)

###############################################################################
# ILS Circulation
###############################################################################
#: New email template to override default ones
ILS_CIRCULATION_MAIL_TEMPLATES = {}
#: Loan message creator class
ILS_CIRCULATION_MAIL_MSG_CREATOR = (
    "invenio_app_ils.circulation.mail.factory:default_loan_message_creator"
)
#: Notification email for overdue loan sent automatically every X days
ILS_CIRCULATION_MAIL_OVERDUE_REMINDER_INTERVAL = 3
#: The maximum duration of a loan request
ILS_CIRCULATION_LOAN_REQUEST_DURATION_DAYS = 60
#: Period of time in days, before loans expire, for notifications etc.
ILS_CIRCULATION_LOAN_WILL_EXPIRE_DAYS = 7
#: Delivery methods
ILS_CIRCULATION_DELIVERY_METHODS = {
    "PICKUP": "Pick it up at the library desk",
    "DELIVERY": "Have it delivered to my office",
}

###############################################################################
# CIRCULATION overridden config
###############################################################################
CIRCULATION_ITEMS_RETRIEVER_FROM_DOCUMENT = get_item_pids_by_document_pid

CIRCULATION_DOCUMENT_RETRIEVER_FROM_ITEM = get_document_pid_by_item_pid

CIRCULATION_PATRON_EXISTS = patron_exists

CIRCULATION_ITEM_EXISTS = item_exists

CIRCULATION_DOCUMENT_EXISTS = document_exists

CIRCULATION_ITEM_LOCATION_RETRIEVER = circulation_item_location_retriever

CIRCULATION_TRANSACTION_LOCATION_VALIDATOR = (
    circulation_transaction_location_validator
)

CIRCULATION_TRANSACTION_USER_VALIDATOR = circulation_transaction_user_validator

CIRCULATION_LOAN_LOCATIONS_VALIDATION = circulation_location_validator

CIRCULATION_POLICIES = dict(
    checkout=dict(
        duration_default=circulation_default_loan_duration,
        duration_validate=circulation_is_loan_duration_valid,
        item_can_circulate=can_item_circulate,
    ),
    extension=dict(
        from_end_date=True,
        duration_default=circulation_default_extension_duration,
        max_count=circulation_default_extension_max_count,
    ),
    request=dict(can_be_requested=circulation_can_be_requested),
    upcoming_return_range=circulation_loan_will_expire_days,
)

CIRCULATION_ITEM_REF_BUILDER = circulation_build_item_ref

CIRCULATION_ITEM_RESOLVING_PATH = (
    "/api/resolver/circulation/loans/<loan_pid>/item"
)

CIRCULATION_ITEM_RESOLVER_ENDPOINT = item_resolver

CIRCULATION_DOCUMENT_REF_BUILDER = circulation_build_document_ref

CIRCULATION_DOCUMENT_RESOLVING_PATH = (
    "/api/resolver/circulation/loans/<loan_pid>/document"
)

CIRCULATION_DOCUMENT_RESOLVER_ENDPOINT = document_resolver

CIRCULATION_PATRON_REF_BUILDER = circulation_build_patron_ref

CIRCULATION_PATRON_RESOLVING_PATH = (
    "/api/resolver/circulation/loans/<loan_pid>/patron"
)

CIRCULATION_PATRON_RESOLVER_ENDPOINT = loan_patron_resolver

CIRCULATION_LOAN_TRANSITIONS = {
    "CREATED": [
        dict(
            dest="PENDING",
            trigger="request",
            transition=CreatedToPending,
            permission_factory=authenticated_user_permission,
            assign_item=False,
        ),
        dict(
            dest="ITEM_ON_LOAN",
            trigger="checkout",
            transition=ILSToItemOnLoan,
            permission_factory=backoffice_permission,
        ),
    ],
    "PENDING": [
        dict(
            dest="ITEM_ON_LOAN",
            trigger="checkout",
            transition=ILSToItemOnLoan,
            permission_factory=backoffice_permission,
        ),
        dict(
            dest="CANCELLED",
            trigger="cancel",
            transition=ToCancelled,
            permission_factory=patron_owner_permission,
        ),
    ],
    "ITEM_ON_LOAN": [
        dict(
            dest="ITEM_RETURNED",
            trigger="checkin",
            transition=ItemOnLoanToItemReturned,
            permission_factory=backoffice_permission,
            assign_item=False,
        ),
        dict(
            dest="ITEM_ON_LOAN",
            transition=ILSItemOnLoanToItemOnLoan,
            trigger="extend",
            permission_factory=loan_extend_circulation_permission,
        ),
        dict(
            dest="CANCELLED",
            trigger="cancel",
            transition=ToCancelled,
            permission_factory=backoffice_permission,
        ),
    ],
    "ITEM_RETURNED": [],
    "CANCELLED": [],
}

###############################################################################
# RECORDS REST
###############################################################################
ILS_CIRCULATION_RECORDS_REST_ENDPOINTS = dict(
    loanid=dict(
        pid_type=CIRCULATION_LOAN_PID_TYPE,
        pid_minter=ILS_CIRCULATION_LOAN_MINTER,
        pid_fetcher=ILS_CIRCULATION_LOAN_FETCHER,
        search_class=LoansSearch,
        search_factory_imp="invenio_app_ils.search_permissions"
        ":search_factory_filter_by_patron",
        record_class=Loan,
        indexer_class=LoanIndexer,
        record_loaders={
            "application/json": (
                "invenio_circulation.records.loaders:loan_loader"
            )
        },
        record_serializers={
            "application/json": (
                "invenio_app_ils.circulation.serializers:json_v1_response"
            )
        },
        search_serializers={
            "application/json": (
                "invenio_app_ils.circulation.serializers:json_v1_search"
            ),
            "text/csv": (
                "invenio_app_ils.circulation.serializers:csv_v1_search"
            ),
        },
        list_route="/circulation/loans/",
        item_route="/circulation/loans/<{0}:pid_value>".format(
            _LOANID_CONVERTER
        ),
        default_media_type="application/json",
        links_factory_imp="invenio_circulation.links:loan_links_factory",
        max_result_window=10000,
        error_handlers=dict(),
        read_permission_factory_imp=PatronOwnerPermission,
        list_permission_factory_imp=authenticated_user_permission,  # auth via search_factory
        create_permission_factory_imp=superuser_permission,
        update_permission_factory_imp=backoffice_permission,
        delete_permission_factory_imp=backoffice_permission,
    )
)

ILS_CIRCULATION_RECORDS_REST_SORT_OPTIONS = dict(
    loans=dict(  # LoansSearch.Meta.index
        request_expire_date=dict(
            fields=["request_expire_date"],
            title="Request expire date",
            order=2,
        ),
        request_start_date=dict(
            fields=["request_start_date"],
            title="Request start date",
            order=2,
        ),
        end_date=dict(
            fields=["end_date"],
            title="Loan end date",
            order=3,
        ),
        start_date=dict(
            fields=["start_date"],
            title="Loan start date",
            order=4,
        ),
        extensions=dict(
            fields=["extension_count"],
            title="Extensions count",
            order=5,
        ),
        created=dict(
            fields=["_created"], title="Recently added", order=6,
        ),
        bestmatch=dict(
            fields=["-_score"],
            title="Best match",
            order=7,
        ),
    )
)

ILS_CIRCULATION_RECORDS_REST_FACETS = dict(
    loans=dict(  # LoansSearch.Meta.index
        aggs=dict(
            state=dict(terms=dict(field="state")),
            delivery=dict(terms=dict(field="delivery.method")),
            returns=overdue_agg,
        ),
        post_filters={
            "state": terms_filter("state"),
            "delivery": terms_filter("delivery.method"),
            "returns.end_date": overdue_loans_filter("end_date"),
            "loans_from_date": date_range_filter("start_date", "gte"),
            "loans_to_date": date_range_filter("start_date", "lte"),
        },
    )
)
