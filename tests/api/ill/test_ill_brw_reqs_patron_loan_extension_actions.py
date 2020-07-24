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

from invenio_app_ils.ill.api import BORROWING_REQUEST_PID_TYPE
from tests.helpers import user_login, user_logout


def _create_on_loan_brwreq(
    patron_id, loan_start_date, loan_end_date, client, json_headers
):
    """Create a new ON_LOAN ILL borrowing request."""

    def _create_brwreq(patron_id):
        brwreq = dict(
            document_pid="docid-3",
            library_pid="illlid-2",
            patron_pid=patron_id,
            status="REQUESTED",
            type="PHYSICAL_COPY",
        )
        url = url_for("invenio_records_rest.illbid_list")
        res = client.post(url, headers=json_headers, data=json.dumps(brwreq))
        assert res.status_code == 201
        brw_req = res.get_json()["metadata"]
        return brw_req["pid"]

    def _create_loan_action(pid):
        """Send request to create a new loan from the ILL."""
        data = dict(
            loan_start_date=loan_start_date,
            loan_end_date=loan_end_date,
            transaction_location_pid="locid-1",
        )
        url = url_for("invenio_app_ils_ill.illbid_create_loan", pid_value=pid)
        res = client.post(url, headers=json_headers, data=json.dumps(data))
        assert res.status_code == 200
        brw_req = res.get_json()["metadata"]
        assert brw_req["status"] == "ON_LOAN"
        return brw_req

    brwreq_pid = _create_brwreq(patron_id)
    return _create_loan_action(brwreq_pid)


def _create_on_loan_brwreq_random_dates(patron_id, client, json_headers):
    """Create a new ON_LOAN ILL borrowing request with random start/end."""
    loan_start_date = arrow.utcnow()
    loan_end_date = loan_start_date + timedelta(days=15)
    brwreq = _create_on_loan_brwreq(
        patron_id,
        loan_start_date.date().isoformat(),
        loan_end_date.date().isoformat(),
        client,
        json_headers,
    )
    return brwreq, brwreq["pid"]


def _create_on_loan_brwreq_with_pending_extension(
    patron_id, client, json_headers
):
    """Create a new ON_LOAN ILL borrowing request with pending extension."""
    today = arrow.utcnow().date().isoformat()
    brwreq, brwreq_pid = _create_on_loan_brwreq_random_dates(
        "1", client, json_headers
    )
    res = _request_extension_action(brwreq_pid, client, json_headers)
    assert res.status_code == 200

    brwreq = res.get_json()["metadata"]
    patron_loan = brwreq["patron_loan"]

    assert patron_loan["loan"]["state"] == "ITEM_ON_LOAN"
    assert "extension_count" not in patron_loan["loan"]
    assert patron_loan["extension"]["status"] == "PENDING"
    assert patron_loan["extension"]["request_date"] == today

    return brwreq, brwreq["pid"]


def _request_extension_action(pid, client, json_headers):
    """Send HTTP request to request extension of ILL Borrowing Request."""
    url = url_for(
        "invenio_app_ils_ill.illbid_request_extension", pid_value=pid
    )
    return client.post(url, headers=json_headers, data=json.dumps({}))


def _accept_extension_action(pid, data, client, json_headers):
    """Send HTTP request to accept extension of ILL Borrowing Request."""
    data["transaction_location_pid"] = "locid-1"
    url = url_for("invenio_app_ils_ill.illbid_accept_extension", pid_value=pid)
    return client.post(url, headers=json_headers, data=json.dumps(data))


def _decline_extension_action(pid, _, client, json_headers):
    """Send HTTP request to decline extension of ILL Borrowing Request."""
    url = url_for(
        "invenio_app_ils_ill.illbid_decline_extension", pid_value=pid
    )
    return client.post(url, headers=json_headers, data=json.dumps({}))


def test_brwreq_request_extension_only_owner(
    client, testdata, json_headers, users
):
    """Test that patron can request extension only for his own loan."""
    user_login(client, "librarian", users)

    brwreq, brwreq_pid = _create_on_loan_brwreq_random_dates(
        "1", client, json_headers
    )

    # anonymous, forbidden
    user_logout(client)
    res = _request_extension_action(brwreq_pid, client, json_headers)
    assert res.status_code == 401

    # patron2 is not the owner, forbidden
    user_login(client, "patron2", users)
    res = _request_extension_action(brwreq_pid, client, json_headers)
    assert res.status_code == 403

    # patron1 is the owner, success
    user_login(client, "patron1", users)
    res = _request_extension_action(brwreq_pid, client, json_headers)
    assert res.status_code == 200
    extension = res.get_json()["metadata"]["patron_loan"]["extension"]
    assert extension["status"] == "PENDING"
    assert extension["request_date"] == arrow.now().date().isoformat()

    # create a new one with patron2 owner, librarian can request extension
    user_login(client, "librarian", users)
    brwreq, brwreq_pid = _create_on_loan_brwreq_random_dates(
        "2", client, json_headers
    )
    res = _request_extension_action(brwreq_pid, client, json_headers)
    assert res.status_code == 200
    assert extension["status"] == "PENDING"
    assert extension["request_date"] == arrow.now().date().isoformat()


def test_brwreq_accept_decline_extension_only_librarian(
    client, testdata, json_headers, users
):
    """Test that only librarian can accept or decline an extension."""

    tests = [_accept_extension_action, _decline_extension_action]
    for action in tests:
        user_login(client, "librarian", users)

        # create request
        brwreq, brwreq_pid = _create_on_loan_brwreq_with_pending_extension(
            "1", client, json_headers
        )

        loan_end_date = arrow.utcnow() + timedelta(days=15)
        data = dict(loan_end_date=loan_end_date.date().isoformat())

        # accept/decline

        # anonymous, forbidden
        user_logout(client)
        res = action(brwreq_pid, data, client, json_headers)
        assert res.status_code == 401

        # patron, forbidden
        user_login(client, "patron1", users)
        res = action(brwreq_pid, data, client, json_headers)
        assert res.status_code == 403

        # librarian, success
        user_login(client, "librarian", users)
        res = action(brwreq_pid, data, client, json_headers)
        assert res.status_code == 200


def test_brwreq_request_extension_fails_on_wrong_status(
    client, testdata, json_headers, users
):
    user_login(client, "patron1", users)
    # demo data "illbid-1" is not ON_LOAN
    res = _request_extension_action("illbid-1", client, json_headers)
    assert res.status_code == 400
    # demo data "illbid-7" has already a pending request extension
    res = _request_extension_action("illbid-7", client, json_headers)
    assert res.status_code == 400
    # demo data "illbid-" has declined request extension
    res = _request_extension_action("illbid-8", client, json_headers)
    assert res.status_code == 400


def test_brwreq_accept_decline_extension_should_fail_when_loan_not_active(
    client, testdata, json_headers, users
):
    """Test that accept or decline an extension fails on loan not active."""

    tests = [_accept_extension_action, _decline_extension_action]
    for action in tests:
        user_login(client, "librarian", users)

        # create request
        brwreq, brwreq_pid = _create_on_loan_brwreq_with_pending_extension(
            "1", client, json_headers
        )

        # check-in loan
        loan_pid = brwreq["patron_loan"]["pid"]
        url = url_for(
            "invenio_circulation_loan_actions.loanid_actions",
            pid_value=loan_pid,
            action="checkin",
        )
        item_pid = dict(type=BORROWING_REQUEST_PID_TYPE, value=brwreq["pid"])
        params = dict(
            document_pid=brwreq["document_pid"],
            item_pid=item_pid,
            patron_pid=brwreq["patron_pid"],
            transaction_location_pid="locid-1",
            transaction_user_pid="1",
        )
        res = client.post(url, headers=json_headers, data=json.dumps(params))
        assert res.status_code == 202

        # accept extension
        loan_end_date = arrow.utcnow() + timedelta(days=15)
        data = dict(loan_end_date=loan_end_date.date().isoformat())

        res = action(brwreq_pid, data, client, json_headers)
        assert res.status_code == 400


def test_brwreq_accept_extension_success(
    client, testdata, json_headers, users
):
    """Test accept extension success."""
    user_login(client, "librarian", users)

    # create request
    brwreq, brwreq_pid = _create_on_loan_brwreq_with_pending_extension(
        "1", client, json_headers
    )

    loan_end_date = arrow.utcnow() + timedelta(days=15)
    end_date = loan_end_date.date().isoformat()
    data = dict(loan_end_date=end_date)

    user_login(client, "librarian", users)
    # accept extension
    res = _accept_extension_action(brwreq_pid, data, client, json_headers)
    assert res.status_code == 200

    patron_loan = res.get_json()["metadata"]["patron_loan"]
    assert patron_loan["loan"]["state"] == "ITEM_ON_LOAN"
    assert patron_loan["loan"]["extension_count"] == 1
    assert patron_loan["loan"]["end_date"] == end_date
    assert "status" not in patron_loan["extension"]


def test_brwreq_decline_extension_success(
    client, testdata, json_headers, users
):
    """Test declone extension success."""
    user_login(client, "librarian", users)

    # create request
    brwreq, brwreq_pid = _create_on_loan_brwreq_with_pending_extension(
        "1", client, json_headers
    )
    end_date = brwreq["patron_loan"]["loan"]["end_date"]

    user_login(client, "librarian", users)
    # decline extension
    res = _decline_extension_action(brwreq_pid, dict(), client, json_headers)
    assert res.status_code == 200

    patron_loan = res.get_json()["metadata"]["patron_loan"]
    assert patron_loan["loan"]["state"] == "ITEM_ON_LOAN"
    assert "extension_count" not in patron_loan["loan"]
    assert patron_loan["loan"]["end_date"] == end_date
    assert patron_loan["extension"]["status"] == "DECLINED"

    # request again should now fail because it has been declined
    user_login(client, "patron1", users)
    res = _request_extension_action(brwreq_pid, client, json_headers)
    assert res.status_code == 400
