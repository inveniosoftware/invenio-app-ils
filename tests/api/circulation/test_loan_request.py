# -*- coding: utf-8 -*-
#
# Copyright (C) 2019-2020 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""Test loans item permissions."""

import json
from copy import deepcopy
from datetime import timedelta

import arrow
from flask import url_for
from invenio_search import current_search

from tests.helpers import user_login

NEW_LOAN = {
    "document_pid": "CHANGE ME IN EACH TEST",
    "patron_pid": "3",
    "transaction_location_pid": "locid-1",
    "pickup_location_pid": "locid-1",
    "delivery": {"method": "PICKUP"},
    "request_start_date": "2019-09-10",
    "request_expire_date": "2019-09-20",
}


def test_anonymous_cannot_request_loan(client, json_headers, testdata):
    """Test that anonymous users cannot request a loan."""
    url = url_for("invenio_app_ils_circulation.loan_request")
    res = client.post(url, headers=json_headers, data=json.dumps(NEW_LOAN))
    assert res.status_code == 401


def test_patron_can_request_loan(client, json_headers, users, testdata):
    """Test that a patron can request a loan."""
    url = url_for("invenio_app_ils_circulation.loan_request")
    user = user_login(client, "patron1", users)
    params = deepcopy(NEW_LOAN)
    params["document_pid"] = "docid-3"
    params["transaction_user_pid"] = str(user.id)
    res = client.post(url, headers=json_headers, data=json.dumps(params))
    assert res.status_code == 202
    loan = res.get_json()["metadata"]
    assert loan["state"] == "PENDING"
    assert loan["document_pid"] == params["document_pid"]
    assert loan["transaction_date"]


def test_patron_can_cancel_loan(
    client, json_headers, users, testdata, app_config
):
    """Test that a patron can cancel its own loan."""
    url = url_for("invenio_app_ils_circulation.loan_request")
    user = user_login(client, "patron3", users)
    params = deepcopy(NEW_LOAN)
    params["document_pid"] = "docid-3"
    params["transaction_user_pid"] = str(user.id)

    # Create a Loan
    res = client.post(url, headers=json_headers, data=json.dumps(params))
    loan = res.get_json()

    cancel_url = loan["links"]["actions"]["cancel"]
    meta = loan["metadata"]
    payload = {
        "document_pid": meta["document_pid"],
        "patron_pid": meta["patron_pid"],
        "transaction_location_pid": meta["transaction_location_pid"],
        "transaction_user_pid": meta["transaction_user_pid"],
        "cancel_reason": "USER_CANCEL",
    }
    assert res.status_code == 202

    # Try to cancel a loan that belongs to patron3 as patron1
    user_login(client, "patron1", users)
    cancel_res = client.post(
        cancel_url, headers=json_headers, data=json.dumps(payload)
    )
    assert cancel_res.status_code == 403

    # Try to cancel a loan that belongs to patron3 as patron3
    user_login(client, "patron3", users)
    cancel_res = client.post(
        cancel_url, headers=json_headers, data=json.dumps(payload)
    )
    assert cancel_res.status_code == 202


def test_patron_can_request_loan_with_or_without_end_date(
    app, client, json_headers, users, testdata
):
    """Test that a patron can request a loan [with/without] end date."""
    url = url_for("invenio_app_ils_circulation.loan_request")
    user = user_login(client, "patron1", users)

    now = arrow.utcnow()
    start_date = (now + timedelta(days=3)).date().isoformat()
    end_date = (now + timedelta(days=15)).date().isoformat()

    # it should succeed when start/end dates provided
    params = deepcopy(NEW_LOAN)
    params["document_pid"] = "docid-2"
    params["request_start_date"] = start_date
    params["request_expire_date"] = end_date
    params["transaction_user_pid"] = str(user.id)
    res = client.post(url, headers=json_headers, data=json.dumps(params))
    assert res.status_code == 202
    loan = res.get_json()["metadata"]
    assert loan["state"] == "PENDING"
    assert loan["document_pid"] == params["document_pid"]
    assert loan["request_start_date"] == start_date
    assert loan["request_expire_date"] == end_date
    assert loan["transaction_date"]

    # it should fail when wrong date provided
    params = deepcopy(NEW_LOAN)
    past_end_date = now - timedelta(days=30)
    params["request_expire_date"] = past_end_date.date().isoformat()
    params["transaction_user_pid"] = str(user.id)
    res = client.post(url, headers=json_headers, data=json.dumps(params))
    assert res.status_code == 400

    # it should fail when request duration over max
    params = deepcopy(NEW_LOAN)
    days = app.config["ILS_CIRCULATION_LOAN_REQUEST_DURATION_DAYS"]
    past_end_date = now + timedelta(days=days + 1)
    params["request_expire_date"] = past_end_date.date().isoformat()
    params["transaction_user_pid"] = str(user.id)
    res = client.post(url, headers=json_headers, data=json.dumps(params))
    assert res.status_code == 400

    # it should fail when request start/end date not provided
    params = deepcopy(NEW_LOAN)
    params["document_pid"] = "docid-4"
    params["transaction_user_pid"] = str(user.id)
    del params["request_start_date"]
    del params["request_expire_date"]
    res = client.post(url, headers=json_headers, data=json.dumps(params))
    assert res.status_code == 202
    loan = res.get_json()["metadata"]
    now = arrow.utcnow()
    start_date = now.date().isoformat()
    days = app.config["ILS_CIRCULATION_LOAN_REQUEST_DURATION_DAYS"]
    end_date = (now + timedelta(days=days)).date().isoformat()
    assert loan["request_start_date"] == start_date
    assert loan["request_expire_date"] == end_date


def test_request_loan_with_or_without_delivery(
    app, client, json_headers, users, testdata
):
    """Test that loan request with or without delivery."""
    url = url_for("invenio_app_ils_circulation.loan_request")
    user = user_login(client, "patron1", users)

    previous_dev_methods = app.config["ILS_CIRCULATION_DELIVERY_METHODS"]
    app.config["ILS_CIRCULATION_DELIVERY_METHODS"] = {}
    params = deepcopy(NEW_LOAN)
    params["document_pid"] = "docid-12"
    params["transaction_user_pid"] = str(user.id)
    del params["delivery"]
    res = client.post(url, headers=json_headers, data=json.dumps(params))
    assert res.status_code == 202

    app.config["ILS_CIRCULATION_DELIVERY_METHODS"] = {
        "TEST_METHOD1": "",
        "TEST_METHOD2": "",
    }
    params = deepcopy(NEW_LOAN)
    params["document_pid"] = "docid-6"
    params["delivery"] = {"method": "TEST_METHOD1"}
    params["transaction_user_pid"] = str(user.id)
    res = client.post(url, headers=json_headers, data=json.dumps(params))
    assert res.status_code == 202

    app.config["ILS_CIRCULATION_DELIVERY_METHODS"] = {"TEST_METHOD": ""}
    params = deepcopy(NEW_LOAN)
    params["transaction_user_pid"] = str(user.id)
    del params["delivery"]
    res = client.post(url, headers=json_headers, data=json.dumps(params))
    assert res.status_code == 400
    assert res.get_json()["message"] == "Validation error."

    app.config["ILS_CIRCULATION_DELIVERY_METHODS"] = {"TEST_METHOD": ""}
    params = deepcopy(NEW_LOAN)
    params["delivery"] = {"method": "NON_EXISTING_METHOD"}
    params["transaction_user_pid"] = str(user.id)
    res = client.post(url, headers=json_headers, data=json.dumps(params))
    assert res.status_code == 400
    assert res.get_json()["message"] == "Validation error."

    # restore
    app.config["ILS_CIRCULATION_DELIVERY_METHODS"] = previous_dev_methods


def test_request_loan_with_active_loan_or_loan_request(
    app, client, json_headers, users, testdata
):
    """Test that a patron cannot request a loan with already an active loan or
    a loan request on the same document.
    """
    # Try to request document with already a loan request
    url = url_for("invenio_app_ils_circulation.loan_request")
    user = user_login(client, "patron1", users)
    params = deepcopy(NEW_LOAN)
    params["document_pid"] = "docid-3"
    params["transaction_user_pid"] = str(user.id)
    res = client.post(url, headers=json_headers, data=json.dumps(params))
    assert res.status_code == 202
    current_search.flush_and_refresh(index="*")
    res = client.post(url, headers=json_headers, data=json.dumps(params))
    assert res.status_code == 400

    # Try to request document with already an active loan
    user_login(client, "librarian", users)
    url = url_for("invenio_app_ils_circulation.loan_checkout")
    params = deepcopy(NEW_LOAN)
    params["document_pid"] = "docid-3"
    params["transaction_user_pid"] = str(users["librarian"].id)
    params["item_pid"] = dict(type="pitmid", value="itemid-60")
    res = client.post(url, headers=json_headers, data=json.dumps(params))
    assert res.status_code == 202
    current_search.flush_and_refresh(index="*")
    url = url_for("invenio_app_ils_circulation.loan_request")
    user = user_login(client, "patron1", users)
    params = deepcopy(NEW_LOAN)
    params["document_pid"] = "docid-3"
    params["transaction_user_pid"] = str(user.id)
    res = client.post(url, headers=json_headers, data=json.dumps(params))
    assert res.status_code == 400
