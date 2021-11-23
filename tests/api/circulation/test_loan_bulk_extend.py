# -*- coding: utf-8 -*-
#
# Copyright (C) 2019-2020 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""Test bulk loan extension."""

from datetime import timedelta

import arrow
from flask import current_app
from invenio_circulation.api import Loan
from invenio_circulation.pidstore.pids import CIRCULATION_LOAN_PID_TYPE
from invenio_circulation.proxies import current_circulation
from invenio_search import current_search

from invenio_app_ils.circulation.api import bulk_extend_loans
from invenio_app_ils.cli import current_app_ils
from invenio_app_ils.items.api import ITEM_PID_TYPE, Item
from tests.api.conftest import _create_records
from tests.helpers import user_login

pid_start_value = 200
amount_of_ongoing_loans = 3
amount_of_overdue_loans = 3
pid_end_value = \
    pid_start_value + amount_of_ongoing_loans + amount_of_overdue_loans


def create_loans(start=pid_start_value, end=pid_end_value):
    ongoing_loans = []
    overdue_loans = []

    day_range_loan_extendable = \
        current_app.config["ILS_CIRCULATION_LOAN_WILL_EXPIRE_DAYS"]

    now = arrow.utcnow()

    start_date_expiring = now.isoformat()
    start_date_overdue = (now - timedelta(days=5)).isoformat()

    end_date_expiring = \
        (now + timedelta(days=day_range_loan_extendable - 1)).isoformat()
    end_date_overdue = (now - timedelta(days=2)).isoformat()

    def loan_generator(pid_value, overdue_loan=False):
        end_date = end_date_overdue if overdue_loan else end_date_expiring
        start_date = \
            start_date_overdue if overdue_loan else start_date_expiring

        loan = {
            "document_pid": "docid-1",
            "end_date": end_date,
            "item_pid": {
                "type": "pitmid",
                "value": f"itemid-{pid_value}"
            },
            "patron_pid": "1",
            "pickup_location_pid": "locid-1",
            "pid": f"loanid-{pid_value}",
            "start_date": start_date,
            "state": "ITEM_ON_LOAN",
            "transaction_location_pid": "locid-1",
            "transaction_user_pid": "1",
            "patron": {
                "email": "patron1@test.ch"
            }
        }

        return loan

    for number in range(start, end):
        if len(ongoing_loans) < amount_of_ongoing_loans:
            ongoing_loans.append(loan_generator(number))
        elif len(overdue_loans) < amount_of_overdue_loans:
            overdue_loans.append(loan_generator(number, True))

    return ongoing_loans + overdue_loans


def create_items(start=pid_start_value, end=pid_end_value):
    items = []

    def items_generator(pid_value):
        item = {
            "pid": f"itemid-{pid_value}",
            "created_by": {"type": "script", "value": "demo"},
            "barcode": f"123456{pid_value}89-1",
            "document_pid": "docid-1",
            "internal_location_pid": "ilocid-1",
            "circulation_restriction": "NO_RESTRICTION",
            "medium": "NOT_SPECIFIED",
            "status": "CAN_CIRCULATE",
            "document": {}
        }
        return item

    for number in range(start, end):
        items.append(items_generator(number))

    return items


def _prepare_data(db, repeated_run_number=0):
    total_loans = (amount_of_ongoing_loans + amount_of_overdue_loans)
    added_value = \
        (
            repeated_run_number
            *
            total_loans
            +
            repeated_run_number
        )

    new_pid_start_value = pid_start_value + added_value
    new_pid_end_value = pid_end_value + added_value

    loans = create_loans(new_pid_start_value, new_pid_end_value)
    items = create_items(new_pid_start_value, new_pid_end_value)

    bulk_index_items = _create_records(db, items,
                                       Item, ITEM_PID_TYPE)
    bulk_index_loans = _create_records(db, loans, Loan,
                                       CIRCULATION_LOAN_PID_TYPE)

    for item in bulk_index_items:
        current_app_ils.item_indexer.index(item)

    for loan in bulk_index_loans:
        current_circulation.loan_indexer().index(loan)

    current_search.flush_and_refresh(index="*")

    return {
        "loans": bulk_index_loans,
        "items": bulk_index_items
    }


def test_loan_extend_permissions(
    client, json_headers, users, testdata, loan_params, db
):
    def _run_asserts(extended_loans, loans, patron_pid="1"):

        assert len(extended_loans) >= len(loans)

        for extended_loan in extended_loans:
            for loan in loans:
                if loan['pid'] == extended_loan['pid']:
                    assert extended_loan['state'] == "ITEM_ON_LOAN"
                    assert extended_loan['patron_pid'] == str(patron_pid)
                    assert extended_loan['end_date'] > loan['end_date']

    def test_patron1_can_extend_own_loans():
        patron_1_ongoing_loans = _prepare_data(db)['loans']

        user_login(client, 'patron1', users)

        extended_loans, _ = bulk_extend_loans(patron_pid=1)

        _run_asserts(extended_loans, patron_1_ongoing_loans)

    def test_library_can_extend_any_loan():
        patron_1_ongoing_loans = \
            _prepare_data(db, repeated_run_number=1)['loans']

        user_login(client, "librarian", users)

        extended_loans, _ = bulk_extend_loans(patron_pid=1)

        _run_asserts(extended_loans, patron_1_ongoing_loans)

    def test_patron2_cannot_extend_patron1_loans():
        _prepare_data(db, repeated_run_number=2)

        user_login(client, "patron2", users)

        patron1_pid = "1"

        extended_loans, _ = bulk_extend_loans(patron1_pid)

        assert len(extended_loans) == 0

    test_patron1_can_extend_own_loans()
    test_library_can_extend_any_loan()
    test_patron2_cannot_extend_patron1_loans()
