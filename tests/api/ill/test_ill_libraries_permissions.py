# -*- coding: utf-8 -*-
#
# Copyright (C) 2020 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""Test ILL libraries."""

import json

from flask import url_for

from tests.helpers import user_login

_HTTP_OK = [200, 201, 204]
LIBRARY_PID = "illlid-1"
LIBRARY_NAME = "A library"
ITEM_ENDPOINT = "invenio_records_rest.illlid_item"
LIST_ENDPOINT = "invenio_records_rest.illlid_list"


def test_ill_libraries_permissions(client, testdata, json_headers, users):
    """Test libraries endpoints permissions."""
    dummy_library = dict(
        name=LIBRARY_NAME
    )
    tests = [
        ("admin", _HTTP_OK, dummy_library),
        ("librarian", _HTTP_OK, dummy_library),
        ("patron1", [403], dummy_library),
        ("anonymous", [401], dummy_library),
    ]

    def _test_list(expected_status):
        """Test get list."""
        url = url_for(LIST_ENDPOINT)
        res = client.get(url, headers=json_headers)
        assert res.status_code in expected_status

    def _test_create(expected_status, data):
        """Test record creation."""
        url = url_for(LIST_ENDPOINT)
        res = client.post(url, headers=json_headers, data=json.dumps(data))
        assert res.status_code in expected_status

        if res.status_code < 400:
            record = res.get_json()["metadata"]
            assert record["name"] == LIBRARY_NAME
            return record["pid"]

    def _test_update(expected_status, data, pid):
        """Test record update."""
        pid_value = pid or LIBRARY_PID
        url = url_for(ITEM_ENDPOINT, pid_value=pid_value)
        res = client.put(url, headers=json_headers, data=json.dumps(data))
        assert res.status_code in expected_status
        if res.status_code < 400:
            record = res.get_json()["metadata"]
            assert record["name"] == LIBRARY_NAME

    def _test_read(expected_status, pid):
        """Test record read."""
        pid_value = pid or LIBRARY_PID
        url = url_for(ITEM_ENDPOINT, pid_value=pid_value)
        res = client.get(url, headers=json_headers)
        assert res.status_code in expected_status

    def _test_delete(expected_status, pid):
        """Test record delete."""
        pid_value = pid or LIBRARY_PID
        url = url_for(ITEM_ENDPOINT, pid_value=pid_value)
        res = client.delete(url, headers=json_headers)
        assert res.status_code in expected_status

    for username, expected_status, data in tests:
        user_login(client, username, users)
        _test_list(expected_status)
        pid = _test_create(expected_status, data)
        _test_update(expected_status, data, pid)
        _test_read(expected_status, pid)
        _test_delete(expected_status, pid)
