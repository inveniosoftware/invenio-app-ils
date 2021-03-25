# -*- coding: utf-8 -*-
#
# Copyright (C) 2019-2020 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""Test loan extend."""

import json
from copy import deepcopy
from datetime import timedelta

import arrow
from flask import url_for
from invenio_circulation.api import Loan
from invenio_db import db

from invenio_app_ils.circulation.api import (
    circulation_default_loan_duration_for_item,
)
from invenio_app_ils.items.api import Item
from tests.helpers import user_login


def _checkout_loan_pid1(client, json_headers, users, loan_params):
    """Create an ongoing loan."""

    def _checkout(loan_pid, params):
        """Perform checkout action."""
        user_login(client, "librarian", users)
        checkout_url = url_for(
            "invenio_circulation_loan_actions.loanid_actions",
            pid_value=loan_pid,
            action="checkout",
        )
        resp = client.post(
            checkout_url, headers=json_headers, data=json.dumps(params)
        )
        assert resp.status_code == 202
        return resp.get_json()

    loan_pid = "loanid-1"
    params = deepcopy(loan_params)
    params["document_pid"] = "docid-1"
    params["item_pid"]["value"] = "itemid-2"

    return _checkout(loan_pid, params)


def test_loan_extend_permissions(
    client, json_headers, users, testdata, loan_params
):
    """Test loan can be extended."""
    params = deepcopy(loan_params)
    del params["transaction_date"]
    loan = _checkout_loan_pid1(client, json_headers, users, params)

    tests = [
        ("admin", 202),
        ("librarian", 202),
        ("patron1", 202),
        ("patron3", 403),
    ]

    for username, expected_resp_code in tests:
        extend_url = loan["links"]["actions"]["extend"]

        user_login(client, username, users)
        res = client.post(
            extend_url,
            headers=json_headers,
            data=json.dumps(params),
        )
        assert res.status_code == expected_resp_code


def test_loan_extension_end_date(
    app, client, json_headers, users, testdata, loan_params
):
    """Test loan end date after extension."""
    params = deepcopy(loan_params)
    del params["transaction_date"]
    record = _checkout_loan_pid1(client, json_headers, users, params)
    extend_url = record["links"]["actions"]["extend"]
    loan = record["metadata"]

    item = Item.get_record_by_pid(loan["item_pid"]["value"])
    item_loan_duration = circulation_default_loan_duration_for_item(item)

    user_login(client, "patron1", users)

    def _set_loan_end_date(loan_pid, new_end_date):
        """Set loan end date."""
        loan = Loan.get_record_by_pid(loan_pid)
        loan["end_date"] = new_end_date.date().isoformat()
        loan.commit()
        db.session.commit()

    def test_extension_end_date_loan_not_overdue(loan_pid):
        """Test that new end date is added to the current end date."""
        now = arrow.utcnow()
        new_end_date = now + timedelta(days=10)  # loan is not overdue
        _set_loan_end_date(loan_pid, new_end_date)

        expected_end_date = new_end_date + item_loan_duration

        res = client.post(
            extend_url, headers=json_headers, data=json.dumps(params)
        )
        assert res.status_code == 202
        new_loan = res.get_json()["metadata"]
        assert new_loan["end_date"] == expected_end_date.date().isoformat()

    def test_extension_end_date_loan_overdue(loan_pid):
        """Test that new end date is added to today."""
        now = arrow.utcnow()

        new_end_date = now - timedelta(days=2)  # loan is overdue since 2 days
        _set_loan_end_date(loan_pid, new_end_date)

        expected_end_date = now + item_loan_duration
        res = client.post(
            extend_url, headers=json_headers, data=json.dumps(params)
        )
        assert res.status_code == 202
        new_loan = res.get_json()["metadata"]
        # loan new end date should start from now
        assert new_loan["end_date"] == expected_end_date.date().isoformat()

    test_extension_end_date_loan_not_overdue(loan["pid"])
    test_extension_end_date_loan_overdue(loan["pid"])
