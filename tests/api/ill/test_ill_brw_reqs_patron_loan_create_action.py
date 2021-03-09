# -*- coding: utf-8 -*-
#
# Copyright (C) 2020 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""Test ILL borrowing requests actions."""

import json
from datetime import timedelta

import arrow
from flask import url_for

from invenio_app_ils.ill.api import (
    BORROWING_REQUEST_PID_TYPE,
    BorrowingRequest,
)
from tests.helpers import user_login

_HTTP_OK = [200, 201, 204]
ITEM_ENDPOINT = "invenio_records_rest.illbid_item"
LIST_ENDPOINT = "invenio_records_rest.illbid_list"


def _create_loan_action(pid, data, client, json_headers):
    """Send request to create a new loan from the ILL."""
    url = url_for("invenio_app_ils_ill.illbid_create_loan", pid_value=pid)
    data["transaction_location_pid"] = "locid-1"
    return client.post(url, headers=json_headers, data=json.dumps(data))


def _assert_create_loan_action_fails(pid, data, client, json_headers):
    """Asserts that the create loan action validation fails."""
    res = _create_loan_action(pid, data, client, json_headers)
    assert res.status_code == 400


def test_brwreq_create_loan_only_backoffice(
    client, testdata, json_headers, users
):
    """Test that patron have no permission of creating loans from ILLs."""
    user_login(client, "patron1", users)
    res = _create_loan_action("illbid-2", dict(), client, json_headers)
    assert res.status_code == 403


def test_brwreq_create_loan_fails_on_wrong_status(
    db, client, testdata, json_headers, users
):
    """Test borrowing requests create loan action fails on wrong status."""
    user_login(client, "librarian", users)

    def _create_new_brwreq(data=None):
        brwreq = data or dict(
            document_pid="docid-3",
            provider_pid="ill-provid-2",
            patron_pid="1",
            status="PENDING",
            type="PHYSICAL_COPY",
        )
        url = url_for(LIST_ENDPOINT)
        res = client.post(url, headers=json_headers, data=json.dumps(brwreq))
        assert res.status_code in _HTTP_OK
        brw_req = res.get_json()["metadata"]
        return brw_req["pid"]

    def _update_brwreq_with_new_status(pid, status):
        rec = BorrowingRequest.get_record_by_pid(pid)
        rec["status"] = status
        if status == "CANCELLED":
            rec["cancel_reason"] = "OTHER"
        rec.commit()
        db.session.commit()

    def _assert_fail_when_status(pid, status):
        _update_brwreq_with_new_status(pid, status)

        now = arrow.utcnow()
        future = now + timedelta(days=15)
        data = dict(
            loan_start_date=now.isoformat(), loan_end_date=future.isoformat()
        )
        _assert_create_loan_action_fails(pid, data, client, json_headers)

    pid = _create_new_brwreq()

    _assert_fail_when_status(pid, "PENDING")
    _assert_fail_when_status(pid, "ON_LOAN")
    _assert_fail_when_status(pid, "RETURNED")
    _assert_fail_when_status(pid, "CANCELLED")


def test_brwreq_create_loan_fails_on_wrong_loan_end_date(
    db, client, testdata, json_headers, users
):
    """Test borrowing requests create loan action fails on wrong end date."""
    user_login(client, "librarian", users)

    # demo data "illbid-2" has the valid state `REQUESTED`
    pid = "illbid-2"
    # missing date param
    _assert_create_loan_action_fails(pid, dict(), client, json_headers)

    now = arrow.utcnow()

    # wrong format date
    future = now + timedelta(days=5)
    data = dict(
        loan_start_date=now.isoformat(),
        loan_end_date=future.date().isoformat(),
    )
    _assert_create_loan_action_fails(pid, data, client, json_headers)
    data = dict(
        loan_start_date=now.date().isoformat(),
        loan_end_date=future.isoformat(),
    )
    _assert_create_loan_action_fails(pid, data, client, json_headers)

    # past date
    past = now - timedelta(days=15)
    data = dict(
        loan_start_date=now.date().isoformat(),
        loan_end_date=past.date().isoformat(),
    )
    _assert_create_loan_action_fails(pid, data, client, json_headers)


def test_brwreq_create_loan_fails_on_loan_pid_already_attached(
    db, client, testdata, json_headers, users
):
    """Test borrowing requests create loan action fails on loan_pid already."""
    user_login(client, "librarian", users)

    # demo data "illbid-2" has the valid state `REQUESTED`
    pid = "illbid-2"

    rec = BorrowingRequest.get_record_by_pid(pid)
    rec.setdefault("patron_loan", {})
    rec["patron_loan"]["pid"] = "loanid-3"
    rec.commit()
    db.session.commit()

    # already with a loan pid for some reasons
    now = arrow.utcnow()
    future = now + timedelta(days=5)
    data = dict(
        loan_start_date=now.date().isoformat(),
        loan_end_date=future.date().isoformat(),
    )
    _assert_create_loan_action_fails(pid, data, client, json_headers)


def test_brwreq_create_loan_succeeds(
    db, client, testdata, json_headers, users
):
    """Test borrowing requests create loan action succeeds."""
    user = user_login(client, "librarian", users)

    # demo data "illbid-2" has the valid state `REQUESTED`
    pid = "illbid-2"

    now = arrow.utcnow()
    start = (now + timedelta(days=3)).date().isoformat()
    future = (now + timedelta(days=5)).date().isoformat()
    data = dict(loan_start_date=start, loan_end_date=future)
    res = _create_loan_action(pid, data, client, json_headers)
    assert res.status_code in _HTTP_OK
    brw_req = res.get_json()["metadata"]

    assert brw_req["status"] == "ON_LOAN"
    assert "patron_loan" in brw_req
    patron_loan = brw_req["patron_loan"]
    assert "pid" in patron_loan
    assert "loan" in patron_loan
    loan = patron_loan["loan"]
    assert patron_loan["pid"] == loan["pid"]
    assert loan["end_date"] == future
    loan_pid = loan["pid"]

    # fetch the loan
    url = url_for("invenio_records_rest.loanid_item", pid_value=loan_pid)
    res = client.get(url, headers=json_headers)
    assert res.status_code in _HTTP_OK
    loan = res.get_json()["metadata"]

    # make sure the loan is created with the data from the ILL
    assert loan["item_pid"] == dict(type=BORROWING_REQUEST_PID_TYPE, value=pid)
    assert loan["start_date"] == start
    assert loan["end_date"] == future
    assert loan["document_pid"] == brw_req["document_pid"]
    assert loan["patron_pid"] == brw_req["patron_pid"]
    assert loan["transaction_user_pid"] == str(user.id)

    # update notes (a random field)
    brw_req["notes"] = "This is a note"
    url = url_for(ITEM_ENDPOINT, pid_value=pid)
    res = client.put(url, headers=json_headers, data=json.dumps(brw_req))
    assert res.status_code in _HTTP_OK
    updated_brw_req = res.get_json()["metadata"]

    # make sure `patron_loan` system field is preserved
    assert updated_brw_req["notes"] == "This is a note"
    assert "patron_loan" in updated_brw_req
    assert "pid" in patron_loan
    assert "loan" in patron_loan
