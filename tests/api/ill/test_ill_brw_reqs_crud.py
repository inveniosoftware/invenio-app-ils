# -*- coding: utf-8 -*-
#
# Copyright (C) 2020 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""Test ILL borrowing requests."""

from __future__ import unicode_literals

import json

from flask import url_for
from invenio_accounts.testutils import login_user_via_session

_HTTP_OK = [200, 201, 204]


def test_brw_reqs_crud(client, testdata, json_headers, users):
    """Test borrowing requests permissions."""
    dummy_borrowing_request = dict(
        status="PENDING",
        document_pid="docid-1",
        patron_pid="1",
        library_pid="illlid-1",
        type="PHYSICAL",
    )
    tests = [
        ("admin", _HTTP_OK, dummy_borrowing_request),
        ("librarian", _HTTP_OK, dummy_borrowing_request),
        ("patron1", [403], dummy_borrowing_request),
    ]

    def _test_create():
        """Test record creation."""
        url = url_for("invenio_records_rest.illbid_list")
        res = client.post(url, headers=json_headers, data=json.dumps(data))
        assert res.status_code in expected_status

        if res.status_code < 400:
            brw_req = res.get_json()["metadata"]
            assert brw_req["status"] == "PENDING"
            # logged in user is automatically injected
            assert brw_req["created_by_pid"] == str(user.id)
            return brw_req["pid"]

    def _test_update():
        """Test record update."""
        url = url_for("invenio_records_rest.illbid_item", pid_value="illbid-1")
        res = client.put(url, headers=json_headers, data=json.dumps(data))
        assert res.status_code in expected_status

    def _test_read():
        """Test record read."""
        url = url_for("invenio_records_rest.illbid_item", pid_value="illbid-1")
        res = client.get(url, headers=json_headers, data=json.dumps(data))
        assert res.status_code in expected_status

    def _test_delete():
        """Test record delete."""
        url = url_for("invenio_records_rest.illbid_item", pid_value="illbid-1")
        res = client.get(url, headers=json_headers, data=json.dumps(data))
        assert res.status_code in expected_status

    for username, expected_status, data in tests:
        user = users[username]
        login_user_via_session(client, user=user)
        _test_create()
        _test_update()
        _test_read()
        _test_delete()
