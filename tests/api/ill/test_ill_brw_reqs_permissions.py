# -*- coding: utf-8 -*-
#
# Copyright (C) 2020 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""Test ILL borrowing requests."""

import json

from flask import url_for
from tests.helpers import user_login

_HTTP_OK = [200, 201, 204]
BRWREQ_PID = "illbid-1"
ITEM_ENDPOINT = "invenio_records_rest.illbid_item"
LIST_ENDPOINT = "invenio_records_rest.illbid_list"


def test_ill_brwreqs_permissions(client, testdata, json_headers, users):
    """Test borrowing requests permissions."""
    dummy_borrowing_request = dict(
        status="PENDING",
        document_pid="docid-1",
        patron_pid="1",
        library_pid="illlid-1",
        type="PHYSICAL",
    )

    def _test_list(expected_status):
        """Test get list."""
        url = url_for(LIST_ENDPOINT)
        res = client.get(url, headers=json_headers)
        assert res.status_code in expected_status

    def _test_create(expected_status, data, user):
        """Test record creation."""
        url = url_for(LIST_ENDPOINT)
        res = client.post(url, headers=json_headers, data=json.dumps(data))
        assert res.status_code in expected_status

        if res.status_code < 400:
            brw_req = res.get_json()["metadata"]
            assert brw_req["status"] == "PENDING"
            expected_created_by = dict(type="user_id", value=str(user.id))
            assert brw_req["created_by"] == expected_created_by
            assert not brw_req.get("updated_by")
            return brw_req["pid"]

    def _test_update(expected_status, data, pid, user):
        """Test record update."""
        pid_value = pid or BRWREQ_PID
        url = url_for(ITEM_ENDPOINT, pid_value=pid_value)
        res = client.put(url, headers=json_headers, data=json.dumps(data))
        assert res.status_code in expected_status
        if res.status_code < 400:
            expected_changed_by = dict(type="user_id", value=str(user.id))
            brw_req = res.get_json()["metadata"]
            assert brw_req["created_by"] == expected_changed_by
            assert brw_req["updated_by"] == expected_changed_by

    def _test_read(expected_status, pid):
        """Test record read."""
        pid_value = pid or BRWREQ_PID
        url = url_for(ITEM_ENDPOINT, pid_value=pid_value)
        res = client.get(url, headers=json_headers)
        assert res.status_code in expected_status

    def _test_delete(expected_status, pid):
        """Test record delete."""
        url = url_for(ITEM_ENDPOINT, pid_value=pid)
        res = client.delete(url, headers=json_headers)
        assert res.status_code in expected_status

    tests = [
        ("admin", _HTTP_OK, dummy_borrowing_request),
        ("librarian", _HTTP_OK, dummy_borrowing_request),
        ("patron1", [403], dummy_borrowing_request),
        ("anonymous", [401], dummy_borrowing_request),
    ]
    for username, expected_status, data in tests:
        user = user_login(client, username, users)
        _test_list(expected_status)
        pid = _test_create(expected_status, data, user)
        _test_update(expected_status, data, pid, user)
        _test_read(expected_status, pid)

    tests = [
        ("admin", [403]),
        ("librarian", [403]),
        ("patron1", [403]),
        ("anonymous", [401]),
    ]
    for username, expected_status in tests:
        user_login(client, username, users)
        _test_delete(expected_status, BRWREQ_PID)
