# -*- coding: utf-8 -*-
#
# Copyright (C) 2018-2020 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""Test loans item permissions."""

import json
from copy import deepcopy

from flask import url_for

from tests.helpers import user_login

NEW_LOAN = {
    "item_pid": {"type": "pitmid", "value": "itemid-1"},
    "document_pid": "docid-1",
    "patron_pid": "1",
    "transaction_location_pid": "locid-1",
    "pickup_location_pid": "locid-1",
}


def _fetch_loan(client, json_headers, loan):
    """Return the loan fetched with a REST call."""
    url = url_for("invenio_records_rest.loanid_item", pid_value=loan["pid"])
    return client.get(url, headers=json_headers)


def _assert_get_loan_success(client, json_headers, loan):
    """Assert that GET API call succeeded."""
    res = _fetch_loan(client, json_headers, loan)
    assert res.status_code == 200
    data = json.loads(res.data.decode("utf-8"))["metadata"]
    assert data["pid"] == loan["pid"]
    assert data["patron_pid"] == loan["patron_pid"]


def test_anonymous_cannot_get_any_loan(client, json_headers, testdata):
    """Test that anonymous cannot get any loan."""
    loan_patron1 = testdata["loans"][0]
    assert loan_patron1["patron_pid"] == "1"
    loan_patron2 = testdata["loans"][3]
    assert loan_patron2["patron_pid"] == "2"

    res = _fetch_loan(client, json_headers, loan_patron1)
    assert res.status_code == 401
    res = _fetch_loan(client, json_headers, loan_patron2)
    assert res.status_code == 401


def test_admin_or_librarian_can_get_any_loan(
    client, json_headers, users, testdata
):
    """Test that admins and librarians can get any loan."""
    for username in ["admin", "librarian"]:
        user_login(client, username, users)
        # GET loans of Patron 1
        loan_patron1 = testdata["loans"][0]
        assert loan_patron1["patron_pid"] == "1"
        _assert_get_loan_success(client, json_headers, loan_patron1)

        # GET loans of Patron 2
        loan_patron2 = testdata["loans"][3]
        assert loan_patron2["patron_pid"] == "2"
        _assert_get_loan_success(client, json_headers, loan_patron2)


def test_patron_can_get_only_his_loans(client, json_headers, users, testdata):
    """Test that patrons can get only their loans."""
    loan_patron1 = testdata["loans"][0]
    assert loan_patron1["patron_pid"] == "1"

    loan_patron2 = testdata["loans"][3]
    assert loan_patron2["patron_pid"] == "2"

    # Patron 1 GET his loans
    user_login(client, "patron1", users)
    _assert_get_loan_success(client, json_headers, loan_patron1)
    # Patron 1 GET loans of Patron 2
    res = _fetch_loan(client, json_headers, loan_patron2)
    assert res.status_code == 403

    # Patron 2 GET his loans
    user_login(client, "patron2", users)
    _assert_get_loan_success(client, json_headers, loan_patron2)
    # Patron 2 GET loans of Patron 1
    res = _fetch_loan(client, json_headers, loan_patron1)
    assert res.status_code == 403


def _test_post_new_loan(client, json_headers, user_id, response_code):
    """Test POST new loan."""
    url = url_for("invenio_records_rest.loanid_list")
    params = deepcopy(NEW_LOAN)
    params["transaction_user_pid"] = user_id
    res = client.post(url, headers=json_headers, data=json.dumps(params))
    assert res.status_code == response_code
    if res.status_code == 201:
        data = json.loads(res.data.decode("utf-8"))["metadata"]
        return data["pid"]


def _test_replace_existing_loan(
    client, json_headers, user_id, loanid, response_code
):
    """Test PUT existing loan."""
    url = url_for("invenio_records_rest.loanid_item", pid_value=loanid)
    params = deepcopy(NEW_LOAN)
    params["transaction_user_pid"] = user_id
    res = client.put(url, headers=json_headers, data=json.dumps(params))
    assert res.status_code == response_code


def _test_delete_existing_loan(client, json_headers, loanid, response_code):
    """Test DELETE existing loan."""
    url = url_for("invenio_records_rest.loanid_item", pid_value=loanid)
    res = client.delete(url, headers=json_headers)
    assert res.status_code == response_code


def test_anonymous_cannot_update_loans(client, json_headers, testdata):
    """Test that anonymous cannot update loans."""
    loanid = "loanid-1"
    _test_post_new_loan(client, json_headers, user_id="", response_code=401)
    _test_replace_existing_loan(
        client, json_headers, user_id="", loanid=loanid, response_code=401
    )


def test_patron_cannot_update_loans(client, json_headers, users, testdata):
    """Test that patrons cannot update loans."""
    loanid = "loanid-1"
    user = user_login(client, "patron1", users)
    _test_post_new_loan(client, json_headers, user.id, 403)
    _test_replace_existing_loan(client, json_headers, user.id, loanid, 403)
    _test_delete_existing_loan(client, json_headers, loanid, 403)
