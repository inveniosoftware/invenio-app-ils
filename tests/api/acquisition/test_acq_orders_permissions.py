# -*- coding: utf-8 -*-
#
# Copyright (C) 2020 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""Test acquisition orders."""

import json

from flask import url_for

from tests.helpers import user_login

_HTTP_OK = [200, 201, 204]
ORDER_PID = "acqoid-1"
ITEM_ENDPOINT = "invenio_records_rest.acqoid_item"
LIST_ENDPOINT = "invenio_records_rest.acqoid_list"


def test_acq_orders_permissions(client, testdata, json_headers, users):
    """Test orders endpoints permissions."""
    dummy_acquisition_order = dict(
        status="PENDING",
        order_date="2020-02-25",
        vendor_pid="acqvid-1",
        order_lines=[
            dict(
                copies_ordered=3,
                document_pid="docid-1",
                medium="paper",
                recipient="library",
            )
        ],
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
            ord = res.get_json()["metadata"]
            assert ord["status"] == "PENDING"
            expected_created_by = dict(type="user_id", value=str(user.id))
            assert ord["created_by"] == expected_created_by
            assert not ord.get("updated_by")
            return ord["pid"]

    def _test_update(expected_status, data, pid, user):
        """Test record update."""
        pid_value = pid or ORDER_PID
        url = url_for(ITEM_ENDPOINT, pid_value=pid_value)
        res = client.put(url, headers=json_headers, data=json.dumps(data))
        assert res.status_code in expected_status
        if res.status_code < 400:
            expected_changed_by = dict(type="user_id", value=str(user.id))
            ord = res.get_json()["metadata"]
            assert ord["created_by"] == expected_changed_by
            assert ord["updated_by"] == expected_changed_by

    def _test_read(expected_status, pid):
        """Test record read."""
        pid_value = pid or ORDER_PID
        url = url_for(ITEM_ENDPOINT, pid_value=pid_value)
        res = client.get(url, headers=json_headers)
        assert res.status_code in expected_status

    def _test_delete(expected_status, pid):
        """Test record delete."""
        url = url_for(ITEM_ENDPOINT, pid_value=pid)
        res = client.delete(url, headers=json_headers)
        assert res.status_code in expected_status

    tests = [
        ("admin", _HTTP_OK, dummy_acquisition_order),
        ("librarian", _HTTP_OK, dummy_acquisition_order),
        ("patron1", [403], dummy_acquisition_order),
        ("anonymous", [401], dummy_acquisition_order),
    ]
    for username, expected_status, data in tests:
        user = user_login(client, username, users)
        _test_list(expected_status)
        pid = _test_create(expected_status, data, user)
        _test_update(expected_status, data, pid, user)
        _test_read(expected_status, pid)

    tests = [
        ("patron1", [403]),
        ("anonymous", [401]),
        ("librarian", [403]),
        ("admin", [204]),
    ]
    for username, expected_status in tests:
        user_login(client, username, users)
        _test_delete(expected_status, ORDER_PID)
