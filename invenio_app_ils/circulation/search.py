# -*- coding: utf-8 -*-
#
# Copyright (C) 2018-2020 CERN.
#
# Invenio-Circulation is free software; you can redistribute it and/or modify
# it under the terms of the MIT License; see LICENSE file for more details.

"""Search utilities."""

from datetime import datetime, timedelta

from elasticsearch_dsl import A, Q
from flask import current_app
from invenio_circulation.proxies import current_circulation
from invenio_circulation.search.api import search_by_pid


def get_pending_loans_by_doc_pid(document_pid):
    """Return any pending loans for the given document."""
    return search_by_pid(
        document_pid=document_pid, filter_states=["PENDING"]
    )


def get_active_loans_by_doc_pid(document_pid):
    """Return any active loans for the given document."""
    return search_by_pid(
        document_pid=document_pid,
        filter_states=current_app.config.get(
            "CIRCULATION_STATES_LOAN_ACTIVE", []
        ),
    )


def get_past_loans_by_doc_pid(document_pid):
    """Return any past loans for the given document."""
    return search_by_pid(
        document_pid=document_pid,
        filter_states=current_app.config.get(
            "CIRCULATION_STATES_LOAN_COMPLETED", []
        ),
    )


def get_loan_next_available_date(document_pid):
    """Return active loans on document sorted by the earliest end date."""
    return search_by_pid(
        document_pid=document_pid,
        filter_states=current_app.config.get(
            "CIRCULATION_STATES_LOAN_ACTIVE", []
        ),
        sort_by_field="end_date",
    )


def get_active_loan_by_item_pid(item_pid):
    """Return any active loans for the given item."""
    return search_by_pid(
        item_pid=item_pid,
        filter_states=current_app.config.get(
            "CIRCULATION_STATES_LOAN_ACTIVE", []
        ),
    )


def get_all_expiring_loans(expiring_in_days):
    """Return all loans that are expiring in the next <days> days."""
    future = (datetime.today() + timedelta(days=expiring_in_days)).date()
    states = current_app.config["CIRCULATION_STATES_LOAN_ACTIVE"]
    search_cls = current_circulation.loan_search_cls
    return (
        search_cls()
        .filter("terms", state=states)
        .filter(
            "range",
            end_date=dict(
                gte="{}||/d".format(future), lte="{}||/d".format(future)
            ),
        )
    )


def get_all_overdue_loans():
    """Return all loans that are overdue."""
    states = current_app.config["CIRCULATION_STATES_LOAN_ACTIVE"]
    search_cls = current_circulation.loan_search_cls
    return (
        search_cls()
        .filter("terms", state=states)
        .filter("range", end_date=dict(lt="now/d"))
    )


def get_overdue_loans_by_doc_pid(document_pid):
    """Return any overdue loans for the given document."""
    states = current_app.config["CIRCULATION_STATES_LOAN_ACTIVE"]
    return search_by_pid(
        document_pid=document_pid, filter_states=states
    ).filter("range", end_date=dict(lt="now/d"))


def get_most_loaned_documents(from_date, to_date, bucket_size):
    """Return aggregation of document_pids with most loans."""
    search_cls = current_circulation.loan_search_cls

    # Query
    states = (
        current_app.config["CIRCULATION_STATES_LOAN_ACTIVE"]
        + current_app.config["CIRCULATION_STATES_LOAN_COMPLETED"]
    )

    from_date = from_date or None
    to_date = to_date or None

    search = search_cls().query(
        "bool",
        must=[
            Q("terms", state=states),
            Q("range", start_date=dict(gte=from_date, lte=to_date)),
        ],
    )

    # Aggregation with sub-aggregation to calculate the extension count sum
    aggs = A("terms", field="document_pid", size=bucket_size)
    aggs = aggs.metric("extensions", "sum", field="extension_count")
    search.aggs.bucket("most_loaned_documents", aggs)

    # No need for the loan hits
    search = search[:0]

    return search
