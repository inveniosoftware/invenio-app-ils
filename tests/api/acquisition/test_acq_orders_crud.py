# -*- coding: utf-8 -*-
#
# Copyright (C) 2020 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""Test acquisition orders."""

from __future__ import unicode_literals

import json

from flask import url_for
from invenio_accounts.testutils import login_user_via_session

_HTTP_OK = [200, 201, 204]


def test_orders_crud(
    client, testdata, json_headers, users
):
    """Test creating orders."""
    dummy_acquisition_order = dict(
        status="PENDING",
        order_date="2020-02-25",
        vendor_pid="acqvid-1",
        order_lines=[dict(
            copies_ordered=3,
            document_pid="docid-1",
            medium="paper",
            recipient="library"
        )],
    )
    tests = [
        ("admin", _HTTP_OK, dummy_acquisition_order),
        ("librarian", _HTTP_OK, dummy_acquisition_order),
        ("patron1", [403], dummy_acquisition_order),
    ]

    def _test_create(expected_status, data):
        """Test record creation."""
        url = url_for("invenio_records_rest.acqoid_list")
        res = client.post(url, headers=json_headers, data=json.dumps(data))
        assert res.status_code in expected_status

        if res.status_code < 400:
            ord = res.get_json()["metadata"]
            assert ord["status"] == "PENDING"
            expected_created_by = dict(type="user_id", value=str(user.id))
            assert ord["created_by"] == expected_created_by
            assert not ord.get("updated_by")
            return ord["pid"]

    def _test_update(expected_status, data, pid):
        """Test record update."""
        pid_value = pid or "acqoid-1"
        url = url_for("invenio_records_rest.acqoid_item", pid_value=pid_value)
        res = client.put(url, headers=json_headers, data=json.dumps(data))
        assert res.status_code in expected_status
        if res.status_code < 400:
            expected_changed_by = dict(type="user_id", value=str(user.id))
            ord = res.get_json()["metadata"]
            assert ord["created_by"] == expected_changed_by
            assert ord["updated_by"] == expected_changed_by

    def _test_read(expected_status, data, pid):
        """Test record read."""
        pid_value = pid or "acqoid-1"
        url = url_for("invenio_records_rest.acqoid_item", pid_value=pid_value)
        res = client.get(url, headers=json_headers, data=json.dumps(data))
        assert res.status_code in expected_status

    def _test_delete(expected_status, data, pid):
        """Test record delete."""
        pid_value = pid or "acqoid-1"
        url = url_for("invenio_records_rest.acqoid_item", pid_value=pid_value)
        res = client.get(url, headers=json_headers, data=json.dumps(data))
        assert res.status_code in expected_status

    for username, expected_status, data in tests:
        user = users[username]
        login_user_via_session(client, user=user)
        pid = _test_create(expected_status, data)
        _test_update(expected_status, data, pid)
        _test_read(expected_status, data, pid)
        _test_delete(expected_status, data, pid)
