# -*- coding: utf-8 -*-
#
# Copyright (C) 2018-2020 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""Test loans item permissions."""

import json
from copy import deepcopy
from datetime import timedelta

import arrow
from flask import url_for
from flask_principal import UserNeed
from invenio_access.permissions import Permission
from invenio_search import current_search

from invenio_app_ils.errors import (
    LoanSelfCheckoutDocumentOverbooked,
    LoanSelfCheckoutItemActiveLoan,
    LoanSelfCheckoutItemInvalidStatus,
)
from invenio_app_ils.items.api import Item
from invenio_app_ils.items.serializers import item
from invenio_app_ils.proxies import current_app_ils
from tests.helpers import user_login, user_logout

NEW_LOAN = {
    "item_pid": "CHANGE ME IN EACH TEST",
    "document_pid": "docid-1",
    "patron_pid": "3",
    "transaction_location_pid": "locid-1",
    "pickup_location_pid": "locid-1",
    "delivery": {"method": "PICKUP"},
}

NEW_LOAN_REQUEST = {
    "document_pid": "CHANGE ME IN EACH TEST",
    "patron_pid": "3",
    "transaction_location_pid": "locid-1",
    "pickup_location_pid": "locid-1",
    "delivery": {"method": "PICKUP"},
}


def test_anonymous_cannot_request_loan_on_item(client, json_headers, testdata):
    """Test that anonymous users cannot request a loan on a item."""
    url = url_for("invenio_app_ils_circulation.loan_checkout")
    res = client.post(url, headers=json_headers, data=json.dumps(NEW_LOAN))
    assert res.status_code == 401


def test_librarian_can_checkout_item_for_user(client, json_headers, users, testdata):
    """Test that librarian can checkout a loan on a item for a patron."""
    user_login(client, "librarian", users)
    url = url_for("invenio_app_ils_circulation.loan_checkout")
    params = deepcopy(NEW_LOAN)
    params["transaction_user_pid"] = str(users["librarian"].id)
    params["item_pid"] = dict(type="pitmid", value="itemid-60")
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

    app.config["ILS_VIEWS_PERMISSIONS_FACTORY"] = custom_views_permissions_factory

    # prepare request
    url = url_for("invenio_app_ils_circulation.loan_checkout")
    params = deepcopy(NEW_LOAN)
    params["force"] = True
    params["item_pid"] = dict(type="pitmid", value="itemid-MISSING")
    params["transaction_user_pid"] = str(librarian2.id)

    # force-checkout as librarian should fail
    user_login(client, "librarian", users)
    res = client.post(url, headers=json_headers, data=json.dumps(params))
    assert res.status_code == 403

    # force-checkout as librarian2 should succeed
    user_login(client, "librarian2", users)
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
    librarian = users["librarian"]
    user_login(client, "librarian", users)
    url = url_for("invenio_app_ils_circulation.loan_checkout")

    params = deepcopy(NEW_LOAN)
    params["item_pid"] = dict(type="pitmid", value="itemid-61")
    params["transaction_user_pid"] = str(librarian.id)
    res = client.post(url, headers=json_headers, data=json.dumps(params))
    assert res.status_code == 202

    params = deepcopy(NEW_LOAN)
    params["item_pid"] = dict(type="pitmid", value="itemid-MISSING")
    params["transaction_user_pid"] = str(librarian.id)
    res = client.post(url, headers=json_headers, data=json.dumps(params))
    # missing
    assert res.status_code == 400

    params = deepcopy(NEW_LOAN)
    params["force"] = True
    params["item_pid"] = dict(type="pitmid", value="itemid-MISSING")
    params["transaction_user_pid"] = str(librarian.id)
    res = client.post(url, headers=json_headers, data=json.dumps(params))
    # missing but force
    assert res.status_code == 202
    item = Item.get_record_by_pid(params["item_pid"]["value"])
    assert item["status"] == "CAN_CIRCULATE"


def test_checkout_loader_start_end_dates(app, client, json_headers, users, testdata):
    """Test that start and end dates request parameters."""
    librarian = users["librarian"]
    user_login(client, "librarian", users)
    item_pid = dict(type="pitmid", value="itemid-61")
    url = url_for("invenio_app_ils_circulation.loan_checkout")
    # fake duration for first item
    loan_duration_timedelta = app.config["CIRCULATION_POLICIES"]["checkout"][
        "duration_default"
    ](dict(item_pid=item_pid), dict())
    now = arrow.utcnow()

    # it should succeed when no start/end dates provided
    start_date = now.date().isoformat()
    end_date = (now + loan_duration_timedelta).date().isoformat()

    params = deepcopy(NEW_LOAN)
    params["item_pid"] = item_pid
    params["transaction_user_pid"] = str(librarian.id)
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
    params["item_pid"] = dict(type="pitmid", value="itemid-62")
    params["start_date"] = start_date
    params["transaction_user_pid"] = str(librarian.id)
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
    params["item_pid"] = dict(type="pitmid", value="itemid-63")
    params["start_date"] = start_date
    params["end_date"] = end_date
    params["transaction_user_pid"] = str(librarian.id)
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
    params["item_pid"] = dict(type="pitmid", value="itemid-63")
    params["end_date"] = end_date
    params["transaction_user_pid"] = str(librarian.id)
    res = client.post(url, headers=json_headers, data=json.dumps(params))
    assert res.status_code == 400

    # it should fail when wrong date provided
    start_date = (now + timedelta(days=3)).date().isoformat()
    past_end_date = now - timedelta(days=30)
    params = deepcopy(NEW_LOAN)
    params["item_pid"] = dict(type="pitmid", value="itemid-63")
    params["start_date"] = start_date
    params["end_date"] = past_end_date.date().isoformat()
    params["transaction_user_pid"] = str(librarian.id)
    res = client.post(url, headers=json_headers, data=json.dumps(params))
    assert res.status_code == 400


def test_self_checkout_search(app, client, json_headers, users, testdata):
    """Test self-checkout search."""
    app.config["ILS_SELF_CHECKOUT_ENABLED"] = True

    # test that anonymous user cannot search for barcodes
    url = url_for("invenio_app_ils_circulation.loan_self_checkout")
    res = client.get(f"{url}?barcode=123456", headers=json_headers)
    assert res.status_code == 401

    user_login(client, "patron2", users)

    # test the missing parameter error
    url = url_for("invenio_app_ils_circulation.loan_self_checkout")
    res = client.get(url, headers=json_headers)
    assert res.status_code == 400

    # test that authenticated user can search for barcodes, but it will return
    # 400 when not found
    unexisting_barcode = "123456"
    res = client.get(f"{url}?barcode={unexisting_barcode}", headers=json_headers)
    assert res.status_code == 400

    # test that an error is returned when the item cannot circulate
    missing_item_barcode = "123456789-1"
    url = url_for("invenio_app_ils_circulation.loan_self_checkout")
    res = client.get(f"{url}?barcode={missing_item_barcode}", headers=json_headers)
    assert res.status_code == 400
    # assert that the payload will contain the key error with a msg
    response = res.get_json()
    assert LoanSelfCheckoutItemInvalidStatus.description in response["message"]
    assert LoanSelfCheckoutItemInvalidStatus.supportCode in response["supportCode"]

    # create a loan on the same patron, and another one on another patron
    user_login(client, "librarian", users)
    url = url_for("invenio_app_ils_circulation.loan_checkout")

    for item_pid, patron_pid in [
        ("itemid-60", "2"),  # barcode 123456789-60
        ("itemid-61", "1"),  # barcode 123456789-61
    ]:
        params = deepcopy(NEW_LOAN)
        params["transaction_user_pid"] = str(users["librarian"].id)
        params["item_pid"] = dict(type="pitmid", value=item_pid)
        params["patron_pid"] = patron_pid
        res = client.post(url, headers=json_headers, data=json.dumps(params))
        assert res.status_code == 202

    # ensure new loans and related items are fully indexed
    current_search.flush_and_refresh(index="*")

    user_login(client, "patron2", users)

    # test that an error is returned when the item is already on loan by the same user
    on_loan_same_patron_barcode = "123456789-60"
    url = url_for("invenio_app_ils_circulation.loan_self_checkout")
    res = client.get(
        f"{url}?barcode={on_loan_same_patron_barcode}", headers=json_headers
    )
    assert res.status_code == 400
    # assert that the payload will contain the key error with a msg
    response = res.get_json()
    assert LoanSelfCheckoutItemActiveLoan.description in response["message"]
    assert LoanSelfCheckoutItemActiveLoan.supportCode in response["supportCode"]

    # test that an error is returned when the item is already on loan by another user
    on_loan_other_patron_barcode = "123456789-61"
    url = url_for("invenio_app_ils_circulation.loan_self_checkout")
    res = client.get(
        f"{url}?barcode={on_loan_other_patron_barcode}", headers=json_headers
    )
    assert res.status_code == 400
    # assert that the payload will contain the key error with a msg
    response = res.get_json()
    assert LoanSelfCheckoutItemActiveLoan.description in response["message"]
    assert LoanSelfCheckoutItemActiveLoan.supportCode in response["supportCode"]

    # test happy path
    available_barcode = "123456789-10"
    url = url_for("invenio_app_ils_circulation.loan_self_checkout")
    res = client.get(f"{url}?barcode={available_barcode}", headers=json_headers)
    assert res.status_code == 200
    response = res.get_json()
    assert response["metadata"]["pid"] == "itemid-10"


def test_self_checkout(app, client, json_headers, users, testdata):
    """Test self-checkout."""

    def _create_request(patron, document_pid):
        url = url_for("invenio_app_ils_circulation.loan_request")
        user = user_login(client, patron, users)
        params = deepcopy(NEW_LOAN_REQUEST)
        params["document_pid"] = document_pid
        params["patron_pid"] = str(user.id)
        params["transaction_user_pid"] = str(user.id)
        res = client.post(url, headers=json_headers, data=json.dumps(params))
        assert res.status_code == 202
        current_search.flush_and_refresh(index="*")

    def _self_checkout(patron, item_pid, document_pid):
        params = deepcopy(NEW_LOAN)
        params["document_pid"] = document_pid
        params["item_pid"] = dict(type="pitmid", value=item_pid)
        params["patron_pid"] = str(patron.id)
        params["transaction_user_pid"] = str(patron.id)
        return client.post(url, headers=json_headers, data=json.dumps(params))

    url = url_for("invenio_app_ils_circulation.loan_self_checkout")

    app.config["ILS_SELF_CHECKOUT_ENABLED"] = False

    # test a logged in user cannot self-checkout when the feature is disabled
    patron2 = user_login(client, "patron2", users)
    res = client.post(url, headers=json_headers)
    assert res.status_code == 403

    user_logout(client)
    app.config["ILS_SELF_CHECKOUT_ENABLED"] = True

    # test that anonymous user cannot self-checkout
    res = client.post(url, headers=json_headers)
    assert res.status_code == 401

    # test overbooked books
    # create multiple requests from different patrons
    _create_request("patron1", "docid-15")
    _create_request("patron3", "docid-15")

    document_rec = current_app_ils.document_record_cls.get_record_by_pid("docid-15")
    document = document_rec.replace_refs()
    assert document["circulation"]["overbooked"]

    # test that user cannot self-checkout an overbooked book, without having a request
    patron2 = user_login(client, "patron2", users)
    res = _self_checkout(patron2, "itemid-71", "docid-15")
    assert res.status_code == 400
    response = res.get_json()
    assert LoanSelfCheckoutDocumentOverbooked.description in response["message"]
    assert LoanSelfCheckoutDocumentOverbooked.supportCode in response["supportCode"]

    # test that user cannot self-checkout an overbooked book, having a request
    # create request from the same patron
    _create_request("patron2", "docid-15")
    patron2 = user_login(client, "patron2", users)
    res = _self_checkout(patron2, "itemid-71", "docid-15")
    assert res.status_code == 400
    response = res.get_json()
    assert LoanSelfCheckoutDocumentOverbooked.description in response["message"]
    assert LoanSelfCheckoutDocumentOverbooked.supportCode in response["supportCode"]

    # test that user can self-checkout having a prior request
    _create_request("patron2", "docid-16")

    patron2 = user_login(client, "patron2", users)
    res = _self_checkout(patron2, "itemid-72", "docid-16")
    assert res.status_code == 202
    response = res.get_json()
    assert response["metadata"]["delivery"]["method"] == "SELF-CHECKOUT"

    # test that user can self-checkout without having a prior request, even if there
    # are other requests on the book (but not overbooked)
    _create_request("patron1", "docid-17")

    patron2 = user_login(client, "patron2", users)
    res = _self_checkout(patron2, "itemid-73", "docid-17")
    assert res.status_code == 202
    response = res.get_json()
    assert response["metadata"]["delivery"]["method"] == "SELF-CHECKOUT"
