# -*- coding: utf-8 -*-
#
# Copyright (C) 2018-2020 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""Test internal locations."""
import json

from flask import url_for

from tests.helpers import user_login

_HTTP_OK = [200, 201, 204]
_INTERNAL_LOCATION_PID = "ilocid-1"
_INTERNAL_LOCATION_NAME = "A location"
_ITEM_ENDPOINT = "invenio_records_rest.ilocid_item"
_LIST_ENDPOINT = "invenio_records_rest.ilocid_list"


def test_internal_locations_permissions(client, testdata, json_headers, users):
    """Test internal locations endpoints permissions."""
    dummy_internal_location = dict(
        location_pid=testdata["locations"][0]["pid"],
        name=_INTERNAL_LOCATION_NAME
    )
    tests = [
        ("admin", _HTTP_OK, dummy_internal_location),
        ("librarian", _HTTP_OK, dummy_internal_location),
        ("patron1", [403], dummy_internal_location),
        ("anonymous", [401], dummy_internal_location),
    ]

    def _test_list(expected_status):
        """Test get list."""
        url = url_for(_LIST_ENDPOINT)
        res = client.get(url, headers=json_headers)
        assert res.status_code in expected_status

    def _test_create(expected_status, data):
        """Test record creation."""
        url = url_for(_LIST_ENDPOINT)
        res = client.post(url, headers=json_headers, data=json.dumps(data))
        assert res.status_code in expected_status

        if res.status_code < 400:
            record = res.get_json()["metadata"]
            assert record["name"] == _INTERNAL_LOCATION_NAME
            return record["pid"]

    def _test_update(expected_status, data, pid):
        """Test record update."""
        pid_value = pid or _INTERNAL_LOCATION_PID
        url = url_for(_ITEM_ENDPOINT, pid_value=pid_value)
        res = client.put(url, headers=json_headers, data=json.dumps(data))
        assert res.status_code in expected_status
        if res.status_code < 400:
            record = res.get_json()["metadata"]
            assert record["name"] == _INTERNAL_LOCATION_NAME

    def _test_read(expected_status, pid):
        """Test record read."""
        pid_value = pid or _INTERNAL_LOCATION_PID
        url = url_for(_ITEM_ENDPOINT, pid_value=pid_value)
        res = client.get(url, headers=json_headers)
        assert res.status_code in expected_status

    def _test_delete(expected_status, pid):
        """Test record delete."""
        pid_value = pid or _INTERNAL_LOCATION_PID
        url = url_for(_ITEM_ENDPOINT, pid_value=pid_value)
        res = client.delete(url, headers=json_headers)
        assert res.status_code in expected_status

    for username, expected_status, data in tests:
        user_login(client, username, users)
        _test_list(expected_status)
        pid = _test_create(expected_status, data)
        _test_update(expected_status, data, pid)
        _test_read(expected_status, pid)
        _test_delete(expected_status, pid)
