# -*- coding: utf-8 -*-
#
# Copyright (C) 2019 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""Test loans item permissions."""

from __future__ import absolute_import, print_function

import json
from copy import deepcopy
from datetime import timedelta

import arrow
from flask import url_for
from invenio_accounts.models import User
from invenio_accounts.testutils import login_user_via_session

NEW_LOAN = {
    "document_pid": "CHANGE ME IN EACH TEST",
    "patron_pid": "3",
    "transaction_location_pid": "locid-1",
    "transaction_user_pid": "4",
    "pickup_location_pid": "locid-1",
    "delivery": {"method": "PICKUP"},
    "request_start_date": "2019-09-10",
    "request_expire_date": "2019-09-20",
}


def _login(client, users):
    """Login user and return url."""
    user = users["patron1"]
    login_user_via_session(client, user=User.query.get(user.id))
    return user


def test_anonymous_cannot_request_loan(client, json_headers, testdata):
    """Test that anonymous users cannot request a loan."""
    url = url_for("invenio_app_ils_circulation.loan_request")
    res = client.post(url, headers=json_headers, data=json.dumps(NEW_LOAN))
    assert res.status_code == 401


def test_patron_can_request_loan(client, json_headers, users, testdata):
    """Test that a patron can request a loan."""
    url = url_for("invenio_app_ils_circulation.loan_request")
    _login(client, users)
    params = deepcopy(NEW_LOAN)
    params["document_pid"] = "docid-3"
    res = client.post(url, headers=json_headers, data=json.dumps(params))
    assert res.status_code == 202
    loan = res.get_json()["metadata"]
    assert loan["state"] == "PENDING"
    assert loan["document_pid"] == params["document_pid"]
    assert loan["transaction_date"]


def test_patron_can_request_loan_on_item(
    client, json_headers, users, testdata
):
    """Test that a patron can request a loan on a item."""
    url = url_for("invenio_app_ils_circulation.loan_request")
    _login(client, users)
    params = deepcopy(NEW_LOAN)
    params["document_pid"] = "docid-13"
    params["item_pid"] = "itemid-10"
    res = client.post(url, headers=json_headers, data=json.dumps(params))
    assert res.status_code == 202
    loan = res.get_json()["metadata"]
    assert loan["state"] == "PENDING"
    assert loan["document_pid"] == params["document_pid"]
    assert loan["item_pid"] == params["item_pid"]
    assert loan["transaction_date"]


def test_patron_can_request_loan_with_or_without_end_date(
    app, client, json_headers, users, testdata
):
    """Test that a patron can request a loan [with/withou] end date."""
    url = url_for("invenio_app_ils_circulation.loan_request")
    _login(client, users)

    now = arrow.utcnow()
    start_date = (now + timedelta(days=3)).date().isoformat()
    end_date = (now + timedelta(days=15)).date().isoformat()

    # it should succeed when start/end dates provided
    params = deepcopy(NEW_LOAN)
    params["document_pid"] = "docid-2"
    params["request_start_date"] = start_date
    params["request_expire_date"] = end_date
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
    res = client.post(url, headers=json_headers, data=json.dumps(params))
    assert res.status_code == 400

    # it should fail when request duration over max
    params = deepcopy(NEW_LOAN)
    days = app.config["CIRCULATION_LOAN_REQUEST_DURATION_DAYS"]
    past_end_date = now + timedelta(days=days + 1)
    params["request_expire_date"] = past_end_date.date().isoformat()
    res = client.post(url, headers=json_headers, data=json.dumps(params))
    assert res.status_code == 400

    # it should fail when request start/end date not provided
    params = deepcopy(NEW_LOAN)
    params["document_pid"] = "docid-4"
    del params["request_start_date"]
    del params["request_expire_date"]
    res = client.post(url, headers=json_headers, data=json.dumps(params))
    assert res.status_code == 202
    loan = res.get_json()["metadata"]
    now = arrow.utcnow()
    start_date = now.date().isoformat()
    days = app.config["CIRCULATION_LOAN_REQUEST_DURATION_DAYS"]
    end_date = (now + timedelta(days=days)).date().isoformat()
    assert loan["request_start_date"] == start_date
    assert loan["request_expire_date"] == end_date


def test_request_loan_with_or_without_delivery(
    app, client, json_headers, users, testdata
):
    """Test that loan request with or without delivery."""
    url = url_for("invenio_app_ils_circulation.loan_request")
    _login(client, users)

    previous_dev_methods = app.config["CIRCULATION_DELIVERY_METHODS"]
    app.config["CIRCULATION_DELIVERY_METHODS"] = {}
    params = deepcopy(NEW_LOAN)
    params["document_pid"] = "docid-12"
    del params["delivery"]
    res = client.post(url, headers=json_headers, data=json.dumps(params))
    assert res.status_code == 202

    app.config["CIRCULATION_DELIVERY_METHODS"] = {
        "TEST_METHOD1": "",
        "TEST_METHOD2": "",
    }
    params = deepcopy(NEW_LOAN)
    params["document_pid"] = "docid-6"
    params["delivery"] = {"method": "TEST_METHOD1"}
    res = client.post(url, headers=json_headers, data=json.dumps(params))
    assert res.status_code == 202

    app.config["CIRCULATION_DELIVERY_METHODS"] = {"TEST_METHOD": ""}
    params = deepcopy(NEW_LOAN)
    del params["delivery"]
    res = client.post(url, headers=json_headers, data=json.dumps(params))
    assert res.status_code == 400
    assert res.get_json()["message"] == "Validation error."

    app.config["CIRCULATION_DELIVERY_METHODS"] = {"TEST_METHOD": ""}
    params = deepcopy(NEW_LOAN)
    params["delivery"] = {"method": "NON_EXISTING_METHOD"}
    res = client.post(url, headers=json_headers, data=json.dumps(params))
    assert res.status_code == 400
    assert res.get_json()["message"] == "Validation error."

    # restore
    app.config["CIRCULATION_DELIVERY_METHODS"] = previous_dev_methods
