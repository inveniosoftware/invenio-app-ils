# -*- coding: utf-8 -*-
#
# Copyright (C) 2020 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""Test ILL borrowing requests actions."""

from __future__ import unicode_literals

import json
from datetime import datetime, timedelta

import arrow
from flask import url_for
from invenio_accounts.testutils import login_user_via_session

from invenio_app_ils.ill.api import BORROWING_REQUEST_PID_TYPE, \
    BorrowingRequest


def test_brwreq_create_loan_only_backoffice(
    client, testdata, json_headers, users
):
    """Test that patron have no permission of creating loans from ILLs."""
    login_user_via_session(client, user=users["patron1"])
    url = url_for("invenio_records_rest.illbid_item", pid_value="illbid-2")
    res = client.put(url, headers=json_headers, data=json.dumps(dict()))
    assert res.status_code == 403


def _create_loan_action(pid, data, client, json_headers):
    """Send request to create a new load from the ILL."""
    url = url_for("ils_ill_actions.illbid_create_loan", pid_value=pid)
    return client.post(url, headers=json_headers, data=json.dumps(data))


def _assert_create_loan_action_fails(pid, data, client, json_headers):
    """Asserts that the create loan action validation fails."""
    res = _create_loan_action(pid, data, client, json_headers)
    assert res.status_code == 400


def test_brw_reqs_create_loan_fails_on_wrong_status(
    db, client, testdata, json_headers, users
):
    """Test borrowing requests create loan action fails on wrong status."""
    login_user_via_session(client, user=users["librarian"])

    def _create_new_brwreq(data=None):
        brwreq = data or dict(
            document_pid="docid-3",
            library_pid="illlid-2",
            patron_pid="1",
            status="PENDING",
            type="PHYSICAL",
        )
        url = url_for("invenio_records_rest.illbid_list")
        res = client.post(url, headers=json_headers, data=json.dumps(brwreq))
        assert res.status_code == 201
        brw_req = res.get_json()["metadata"]
        return brw_req["pid"]

    def _update_brwreq_with_new_status(pid, status):
        rec = BorrowingRequest.get_record_by_pid(pid)
        rec["status"] = status
        rec.commit()
        db.session.commit()

    def _assert_fail_when_status(pid, status):
        _update_brwreq_with_new_status(pid, status)

        future = datetime.now() + timedelta(days=15)
        data = dict(loan_end_date=future.isoformat())
        _assert_create_loan_action_fails(pid, data, client, json_headers)

    pid = _create_new_brwreq()

    _assert_fail_when_status(pid, "PENDING")
    _assert_fail_when_status(pid, "ON_LOAN")
    _assert_fail_when_status(pid, "RETURNED")
    _assert_fail_when_status(pid, "CANCELLED")


def test_brw_reqs_create_loan_fails_on_wrong_loan_end_date(
    db, client, testdata, json_headers, users
):
    """Test borrowing requests create loan action fails on wrong end date."""
    login_user_via_session(client, user=users["librarian"])

    # demo data "illbid-2" has the valid state `REQUESTED`
    pid = "illbid-2"
    # missing date param
    _assert_create_loan_action_fails(pid, dict(), client, json_headers)

    now = arrow.utcnow()

    # wrong format date
    future = now + timedelta(days=5)
    data = dict(loan_end_date=future.isoformat())
    _assert_create_loan_action_fails(pid, data, client, json_headers)

    # past date
    past = now - timedelta(days=15)
    data = dict(loan_end_date=past.date().isoformat())
    _assert_create_loan_action_fails(pid, data, client, json_headers)


def test_brw_reqs_create_loan_fails_on_loan_pid_already_attached(
    db, client, testdata, json_headers, users
):
    """Test borrowing requests create loan action fails on loan_pid already."""
    login_user_via_session(client, user=users["librarian"])

    # demo data "illbid-2" has the valid state `REQUESTED`
    pid = "illbid-2"

    rec = BorrowingRequest.get_record_by_pid(pid)
    rec["loan_pid"] = "loanid-3"
    rec.commit()
    db.session.commit()

    # already with a loan pid for some reasons
    future = arrow.utcnow() + timedelta(days=5)
    data = dict(loan_end_date=future.date().isoformat())
    _assert_create_loan_action_fails(pid, data, client, json_headers)


def test_brw_reqs_create_loan_succeeds(
    db, client, testdata, json_headers, users
):
    """Test borrowing requests create loan action succeeds."""
    user = users["librarian"]
    login_user_via_session(client, user=user)

    # demo data "illbid-2" has the valid state `REQUESTED`
    pid = "illbid-2"

    now = arrow.utcnow()
    future = (now + timedelta(days=5)).date().isoformat()
    data = dict(loan_end_date=future)
    res = _create_loan_action(pid, data, client, json_headers)
    assert res.status_code == 200
    brw_req = res.get_json()["metadata"]

    assert brw_req["loan_end_date"] == future
    assert brw_req["status"] == "ON_LOAN"
    assert "loan_pid" in brw_req
    loan_pid = brw_req["loan_pid"]

    # fetch the loan
    url = url_for("invenio_records_rest.loanid_item", pid_value=loan_pid)
    res = client.get(url, headers=json_headers)
    assert res.status_code == 200
    loan = res.get_json()["metadata"]

    # make sure the loan is created with the data from the ILL
    assert loan["item_pid"] == dict(type=BORROWING_REQUEST_PID_TYPE, value=pid)
    assert loan["start_date"] == now.date().isoformat()
    assert loan["end_date"] == future
    assert loan["document_pid"] == brw_req["document_pid"]
    assert loan["patron_pid"] == brw_req["patron_pid"]
    assert loan["transaction_user_pid"] == str(user.id)
