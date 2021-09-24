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

from invenio_app_ils.items.api import ITEM_PID_TYPE


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
    """Return all loans that are expiring in the <days> days."""
    future = (datetime.today() + timedelta(days=expiring_in_days)).date()
    states = current_app.config["CIRCULATION_STATES_LOAN_ACTIVE"]
    search_cls = current_circulation.loan_search_cls
    return (
        search_cls()
        .filter("term", end_date=future.isoformat())
        .filter("terms", state=states)
    )


def get_all_range_expiring_loans_by_patron_pid(expiring_in_days, patron_pid):
    """Return loans expiring in the next <days> days for given patron."""
    future = (datetime.today() + timedelta(days=expiring_in_days)).date()
    states = current_app.config["CIRCULATION_STATES_LOAN_ACTIVE"]
    search_cls = current_circulation.loan_search_cls
    return (
        search_cls()
        .filter("term", patron_pid=patron_pid)
        .filter(
            "range",
            end_date=dict(
                gte="{}||/d".format(datetime.today().date()),
                lte="{}||/d".format(future),
            ),
        )
        .filter("terms", state=states)
    )


def get_all_range_expiring_ils_loans_by_patron_pid(expiring_in_days,
                                                   patron_pid):
    """Return ILS loans expiring in the next <days> days for given patron."""
    return get_all_range_expiring_loans_by_patron_pid(
        expiring_in_days, patron_pid)\
        .filter("term", item_pid__type=ITEM_PID_TYPE)


def get_all_expired_loans():
    """Return all loans that have expired."""
    states = current_app.config["CIRCULATION_STATES_LOAN_REQUEST"]
    search_cls = current_circulation.loan_search_cls
    return (
        search_cls()
        .filter("terms", state=states)
        .filter("range", request_expire_date=dict(lt="now/d"))
    )


def get_all_overdue_loans():
    """Return all loans that are overdue."""
    states = current_app.config["CIRCULATION_STATES_LOAN_ACTIVE"]
    search_cls = current_circulation.loan_search_cls
    return (
        search_cls()
        .filter("terms", state=states)
        .filter("range", end_date=dict(lt="now/d"))
        .filter("range", patron_pid=dict(gte=0))
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


def get_loans_aggregated_by_states(document_pid, states, patron_pid=None):
    """Returns loans aggregated by states for a given document."""
    search_cls = current_circulation.loan_search_cls
    search = (
        search_cls()
        .filter("terms", state=states)
        .filter("term", document_pid=document_pid)
    )
    if patron_pid:
        search = search.filter("term", patron_pid=patron_pid)
    # Aggregation
    aggs = A("terms", field="state")
    search.aggs.bucket("states", aggs)

    return search


def get_loans_by_patron_pid(patron_pid):
    """Returns a search for all loans (past and current) for a given patron."""
    LoanSearch = current_circulation.loan_search_cls
    return LoanSearch().filter("term", patron_pid=patron_pid)


def get_active_loans_by_patron_pid(patron_pid):
    """Returns a search for all the active loans of a given patron."""
    active_states = current_app.config["CIRCULATION_STATES_LOAN_ACTIVE"]
    search = get_loans_by_patron_pid(patron_pid).filter(
        "terms", state=active_states
    )
    return search


def get_active_loans():
    """Returns a search for all active loans."""
    active_states = current_app.config["CIRCULATION_STATES_LOAN_ACTIVE"]
    LoanSearch = current_circulation.loan_search_cls
    return LoanSearch().filter("terms", state=active_states)
