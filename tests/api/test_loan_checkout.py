# -*- coding: utf-8 -*-
#
# Copyright (C) 2018-19 CERN.
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
from flask_principal import UserNeed
from invenio_access.permissions import Permission
from invenio_accounts.models import User
from invenio_accounts.testutils import login_user_via_session

from invenio_app_ils.records.api import Item

NEW_LOAN = {
    "item_pid": "CHANGE ME IN EACH TEST",
    "document_pid": "docid-1",
    "patron_pid": "3",
    "transaction_location_pid": "locid-1",
    "transaction_user_pid": "4",
    "pickup_location_pid": "locid-1",
    "delivery": {"method": "PICK_UP"},
}


def _login(client, user, users):
    """Login user and return url."""
    login_user_via_session(client, user=User.query.get(user.id))
    return user


def test_anonymous_cannot_request_loan_on_item(client, json_headers, testdata):
    """Test that anonymous users cannot request a loan on a item."""
    url = url_for("invenio_app_ils_circulation.loan_checkout")
    res = client.post(url, headers=json_headers, data=json.dumps(NEW_LOAN))
    assert res.status_code == 401


def test_librarian_can_checkout_item_for_user(
    client, json_headers, users, testdata
):
    """Test that librarian can checkout a loan on a item for a patron."""
    _login(client, users["librarian"], users)
    url = url_for("invenio_app_ils_circulation.loan_checkout")
    params = deepcopy(NEW_LOAN)
    params["item_pid"] = "itemid-60"
    res = client.post(url, headers=json_headers, data=json.dumps(params))
    assert res.status_code == 202
    loan = res.get_json()["metadata"]
    assert loan["state"] == "ITEM_ON_LOAN"
    assert loan["item_pid"] == params["item_pid"]
    assert loan["document_pid"] == params["document_pid"]
    assert loan["patron_pid"] == params["patron_pid"]


def test_force_checkout_specific_permissions(
    app, client, json_headers, users, testdata
):
    """Test that only allowed users can perform a force checkout."""
    default_factory = app.config["ILS_VIEWS_PERMISSIONS_FACTORY"]
    librarian2 = users["librarian2"]

    # override default permission factory to require specific permission for
    # force-checkout action
    def custom_views_permissions_factory(action):
        if action == "circulation-loan-force-checkout":
            # fake permission for a specific user
            return Permission(UserNeed(librarian2.id))
        else:
            return default_factory(action)

    app.config[
        "ILS_VIEWS_PERMISSIONS_FACTORY"
    ] = custom_views_permissions_factory

    # prepare request
    url = url_for("invenio_app_ils_circulation.loan_checkout")
    params = deepcopy(NEW_LOAN)
    params["force"] = True
    params["item_pid"] = "itemid-MISSING"

    # force-checkout as librarian should fail
    _login(client, users["librarian"], users)
    res = client.post(url, headers=json_headers, data=json.dumps(params))
    assert res.status_code == 403

    # force-checkout as librarian2 should succeed
    _login(client, users["librarian2"], users)
    res = client.post(url, headers=json_headers, data=json.dumps(params))
    assert res.status_code == 202
    loan = res.get_json()["metadata"]
    assert loan["state"] == "ITEM_ON_LOAN"
    assert loan["item_pid"] == params["item_pid"]
    assert loan["document_pid"] == params["document_pid"]
    assert loan["patron_pid"] == params["patron_pid"]

    # restore default config
    app.config["ILS_VIEWS_PERMISSIONS_FACTORY"] = default_factory


def test_checkout_conditions_librarian(client, json_headers, users, testdata):
    """Test checkout conditions user."""
    _login(client, users["librarian"], users)
    url = url_for("invenio_app_ils_circulation.loan_checkout")

    params = deepcopy(NEW_LOAN)
    params["item_pid"] = "itemid-61"
    res = client.post(url, headers=json_headers, data=json.dumps(params))
    assert res.status_code == 202

    params = deepcopy(NEW_LOAN)
    params["item_pid"] = "itemid-MISSING"
    res = client.post(url, headers=json_headers, data=json.dumps(params))
    # missing
    assert res.status_code == 400

    params = deepcopy(NEW_LOAN)
    params["force"] = True
    params["item_pid"] = "itemid-MISSING"
    res = client.post(url, headers=json_headers, data=json.dumps(params))
    # missing but force
    assert res.status_code == 202
    item = Item.get_record_by_pid(params["item_pid"])
    assert item["status"] == "CAN_CIRCULATE"


def test_checkout_loader_start_end_dates(
    app, client, json_headers, users, testdata
):
    """Test that start and end dates request parameters."""
    _login(client, users["librarian"], users)
    url = url_for("invenio_app_ils_circulation.loan_checkout")
    loan_duration_timedelta = app.config["CIRCULATION_POLICIES"]["checkout"][
        "duration_default"
    ]("")
    now = arrow.utcnow()

    # it should succeed when no start/end dates provided
    start_date = now.date().isoformat()
    end_date = (now + loan_duration_timedelta).date().isoformat()

    params = deepcopy(NEW_LOAN)
    params["item_pid"] = "itemid-61"
    res = client.post(url, headers=json_headers, data=json.dumps(params))
    assert res.status_code == 202
    loan = res.get_json()["metadata"]
    assert loan["state"] == "ITEM_ON_LOAN"
    assert loan["item_pid"] == params["item_pid"]
    assert loan["start_date"] == start_date
    assert loan["end_date"] == end_date
    assert loan["transaction_date"]

    # it should succeed when no end date provided
    _start_date = now + timedelta(days=3)
    start_date = _start_date.date().isoformat()
    end_date = (_start_date + loan_duration_timedelta).date().isoformat()

    params = deepcopy(NEW_LOAN)
    params["item_pid"] = "itemid-62"
    params["start_date"] = start_date
    res = client.post(url, headers=json_headers, data=json.dumps(params))
    assert res.status_code == 202
    loan = res.get_json()["metadata"]
    assert loan["state"] == "ITEM_ON_LOAN"
    assert loan["item_pid"] == params["item_pid"]
    assert loan["start_date"] == start_date
    assert loan["end_date"] == end_date
    assert loan["transaction_date"]

    start_date = (now + timedelta(days=3)).date().isoformat()
    end_date = (now + timedelta(days=15)).date().isoformat()

    # it should succeed when start/end dates provided
    params = deepcopy(NEW_LOAN)
    params["item_pid"] = "itemid-63"
    params["start_date"] = start_date
    params["end_date"] = end_date
    res = client.post(url, headers=json_headers, data=json.dumps(params))
    assert res.status_code == 202
    loan = res.get_json()["metadata"]
    assert loan["state"] == "ITEM_ON_LOAN"
    assert loan["item_pid"] == params["item_pid"]
    assert loan["start_date"] == start_date
    assert loan["end_date"] == end_date
    assert loan["transaction_date"]

    # it should fail when only end date provided
    params = deepcopy(NEW_LOAN)
    params["item_pid"] = "itemid-63"
    params["end_date"] = end_date
    res = client.post(url, headers=json_headers, data=json.dumps(params))
    assert res.status_code == 400

    # it should fail when wrong date provided
    start_date = (now + timedelta(days=3)).date().isoformat()
    past_end_date = now - timedelta(days=30)
    params = deepcopy(NEW_LOAN)
    params["item_pid"] = "itemid-63"
    params["start_date"] = start_date
    params["end_date"] = past_end_date.date().isoformat()
    res = client.post(url, headers=json_headers, data=json.dumps(params))
    assert res.status_code == 400
