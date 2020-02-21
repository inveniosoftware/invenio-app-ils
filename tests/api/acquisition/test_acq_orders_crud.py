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

    def _test_create():
        """Test record creation."""
        url = url_for("invenio_records_rest.acqoid_list")
        res = client.post(url, headers=json_headers, data=json.dumps(data))
        assert res.status_code in expected_status

        if res.status_code < 400:
            ord = res.get_json()["metadata"]
            assert ord["status"] == "PENDING"
            # logged in user is automatically injected
            assert ord["created_by_pid"] == str(user.id)
            return ord["pid"]

    def _test_update():
        """Test record update."""
        url = url_for("invenio_records_rest.acqoid_item", pid_value="acqoid-1")
        res = client.put(url, headers=json_headers, data=json.dumps(data))
        assert res.status_code in expected_status

    def _test_read():
        """Test record read."""
        url = url_for("invenio_records_rest.acqoid_item", pid_value="acqoid-1")
        res = client.get(url, headers=json_headers, data=json.dumps(data))
        assert res.status_code in expected_status

    def _test_delete():
        """Test record delete."""
        url = url_for("invenio_records_rest.acqoid_item", pid_value="acqoid-1")
        res = client.get(url, headers=json_headers, data=json.dumps(data))
        assert res.status_code in expected_status

    for username, expected_status, data in tests:
        user = users[username]
        login_user_via_session(client, user=user)
        _test_create()
        _test_update()
        _test_read()
        _test_delete()
