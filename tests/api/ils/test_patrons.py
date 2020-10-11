# -*- coding: utf-8 -*-
#
# Copyright (C) 2019 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""Test patrons endpoint."""

import json

from flask import url_for

from tests.helpers import user_login


def _patron_loans_request(client, json_headers, document_pid):
    """Perform a patron loans request."""
    response = client.get(
        url_for(
            "invenio_app_ils_patrons.get_user_information",
            document_pid=document_pid,
        ),
        headers=json_headers,
    )
    return json.loads(response.data.decode("utf-8"))


def _assert_patron_loans_information(
    client, json_headers, document_pid, expect
):
    """Assert patron loan information."""
    resp = _patron_loans_request(client, json_headers, document_pid)
    assert resp == expect


def _assert_error_when_not_authenticated(client, json_headers, document_pid):
    """Assert user is not logged in."""
    resp = _patron_loans_request(client, json_headers, document_pid)
    assert resp["status"] == 401


def test_patron_loans_information(
    client, json_headers, testdata_most_loaned, users
):
    """Test patron loans information API endpoint."""
    _assert_error_when_not_authenticated(client, json_headers, "docid-1")
    user_login(client, "librarian", users)

    _assert_patron_loans_information(
        client,
        json_headers,
        "docid-1",
        expect={
            "has_active_loan": False,
            "is_requested": False,
            "last_loan": None,
        },
    )

    user_login(client, "patron1", users)

    _assert_patron_loans_information(
        client,
        json_headers,
        "docid-1",
        expect={
            "has_active_loan": False,
            "is_requested": True,
            "last_loan": "2019-04-02",
        },
    )

    user_login(client, "patron2", users)
    _assert_patron_loans_information(
        client,
        json_headers,
        "docid-3",
        expect={
            "has_active_loan": False,
            "is_requested": True,
            "last_loan": None,
        },
    )
