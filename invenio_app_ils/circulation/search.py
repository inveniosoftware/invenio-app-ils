# -*- coding: utf-8 -*-
#
# Copyright (C) 2018 CERN.
#
# Invenio-Circulation is free software; you can redistribute it and/or modify
# it under the terms of the MIT License; see LICENSE file for more details.

"""Search utilities."""

from datetime import datetime

from elasticsearch_dsl import A, Q
from flask import current_app
from invenio_circulation.proxies import current_circulation
from invenio_circulation.search.api import LoansSearch, search_by_pid


class IlsLoansSearch(LoansSearch):
    """LoanSearch to filter loans."""

    def get_pending_loans_by_doc_pid(self, document_pid):
        """Return any pending loans for the given document."""
        return search_by_pid(
            document_pid=document_pid,
            filter_states=["PENDING"]
        )

    def get_active_loans_by_doc_pid(self, document_pid):
        """Return any active loans for the given document."""
        return search_by_pid(
            document_pid=document_pid,
            filter_states=current_app.config.get(
                "CIRCULATION_STATES_LOAN_ACTIVE", []
            ),
        )

    def get_past_loans_by_doc_pid(self, document_pid):
        """Return any past loans for the given document."""
        return search_by_pid(
            document_pid=document_pid,
            filter_states=current_app.config.get(
                "CIRCULATION_STATES_LOAN_COMPLETED", []
            ),
        )

    def get_loan_next_available_date(self, document_pid):
        """Return active loans on document sorted by the earliest end date."""
        return search_by_pid(
            document_pid=document_pid,
            filter_states=current_app.config.get(
                "CIRCULATION_STATES_LOAN_ACTIVE", []
            ),
            sort_by_field="end_date",
        )

    def get_active_loan_by_item_pid(self, item_pid):
        """Return any active loans for the given item."""
        return search_by_pid(
            item_pid=item_pid,
            filter_states=current_app.config.get(
                "CIRCULATION_STATES_LOAN_ACTIVE", []
            ),
        )

    def get_overdue_loans_by_doc_pid(self, document_pid):
        """Return any overdue loans for the given document."""
        return search_by_pid(
            document_pid=document_pid,
            filter_states=current_app.config.get(
                "CIRCULATION_STATES_LOAN_ACTIVE", []
            ),
        ).filter('range', end_date=dict(lt='now/d'))

    def get_most_loaned_documents(self, from_date, to_date, bucket_size):
        """Return aggregation of document_pids with most loans."""
        search_cls = current_circulation.loan_search_cls

        # Query
        states = current_app.config["CIRCULATION_STATES_LOAN_ACTIVE"] + \
            current_app.config["CIRCULATION_STATES_LOAN_COMPLETED"]

        from_date = from_date or None
        to_date = to_date or None

        search = search_cls().query("bool", must=[
            Q("terms", state=states),
            Q("range", start_date=dict(gte=from_date, lte=to_date)),
        ])

        # Aggregation with sub-aggregation to calculate the extension count sum
        aggs = A("terms", field="document_pid", size=bucket_size)
        aggs = aggs.metric(
            "extensions",
            "sum",
            field="extension_count"
        )
        search.aggs.bucket("most_loaned_documents", aggs)

        # No need for the loan hits
        search = search[:0]

        return search

    def get_all_overdue_loans(self):
        """Return all loans that are overdue."""
        states = current_app.config["CIRCULATION_STATES_LOAN_ACTIVE"]
        search_cls = current_circulation.loan_search_cls
        search = search_cls().query("bool", must=[
            Q("terms", state=states),
            Q("range", end_date=dict(lt=datetime.utcnow())),
        ])
        return search

    def get_loans_in_range(self, from_date=None, to_date=None):
        """Return loans in the given date range."""
        search_cls = current_circulation.loan_search_cls
        search = search_cls().query("bool", must=[
            Q("range", start_date=dict(gte=from_date, lte=to_date)),
        ])
        return search

    class Meta:
        """Define permissions filter."""

        index = "loans"
        doc_types = None
