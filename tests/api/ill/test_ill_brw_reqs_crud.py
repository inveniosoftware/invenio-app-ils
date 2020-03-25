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

    def _test_create(expected_status, data):
        """Test record creation."""
        url = url_for("invenio_records_rest.illbid_list")
        res = client.post(url, headers=json_headers, data=json.dumps(data))
        assert res.status_code in expected_status

        if res.status_code < 400:
            brw_req = res.get_json()["metadata"]
            assert brw_req["status"] == "PENDING"
            expected_created_by = dict(type="user_id", value=str(user.id))
            assert brw_req["created_by"] == expected_created_by
            assert not brw_req.get("updated_by")
            return brw_req["pid"]

    def _test_update(expected_status, data, pid):
        """Test record update."""
        pid_value = pid or "illbid-1"
        url = url_for("invenio_records_rest.illbid_item", pid_value=pid_value)
        res = client.put(url, headers=json_headers, data=json.dumps(data))
        assert res.status_code in expected_status
        if res.status_code < 400:
            expected_changed_by = dict(type="user_id", value=str(user.id))
            brw_req = res.get_json()["metadata"]
            assert brw_req["created_by"] == expected_changed_by
            assert brw_req["updated_by"] == expected_changed_by

    def _test_read(expected_status, data, pid):
        """Test record read."""
        pid_value = pid or "illbid-1"
        url = url_for("invenio_records_rest.illbid_item", pid_value=pid_value)
        res = client.get(url, headers=json_headers, data=json.dumps(data))
        assert res.status_code in expected_status

    def _test_delete(expected_status, data, pid):
        """Test record delete."""
        pid_value = pid or "illbid-1"
        url = url_for("invenio_records_rest.illbid_item", pid_value=pid_value)
        res = client.get(url, headers=json_headers, data=json.dumps(data))
        assert res.status_code in expected_status

    for username, expected_status, data in tests:
        user = users[username]
        login_user_via_session(client, user=user)
        pid = _test_create(expected_status, data)
        _test_update(expected_status, data, pid)
        _test_read(expected_status, data, pid)
        _test_delete(expected_status, data, pid)
