# -*- coding: utf-8 -*-
#
# Copyright (C) 2020 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""Test acquisition vendors."""

import json

from flask import url_for

from tests.helpers import user_login

_HTTP_OK = [200, 201, 204]
VENDOR_PID = "acqvid-1"
VENDOR_NAME = "A vendor"
ITEM_ENDPOINT = "invenio_records_rest.acqvid_item"
LIST_ENDPOINT = "invenio_records_rest.acqvid_list"


def test_acq_vendors_permissions(client, testdata, json_headers, users):
    """Test vendors endpoints permissions."""
    dummy_acquisition_vendor = dict(
        name=VENDOR_NAME
    )
    tests = [
        ("admin", _HTTP_OK, dummy_acquisition_vendor),
        ("librarian", _HTTP_OK, dummy_acquisition_vendor),
        ("patron1", [403], dummy_acquisition_vendor),
        ("anonymous", [401], dummy_acquisition_vendor),
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
            assert record["name"] == VENDOR_NAME
            return record["pid"]

    def _test_update(expected_status, data, pid):
        """Test record update."""
        pid_value = pid or VENDOR_PID
        url = url_for(ITEM_ENDPOINT, pid_value=pid_value)
        res = client.put(url, headers=json_headers, data=json.dumps(data))
        assert res.status_code in expected_status
        if res.status_code < 400:
            record = res.get_json()["metadata"]
            assert record["name"] == VENDOR_NAME

    def _test_read(expected_status, pid):
        """Test record read."""
        pid_value = pid or VENDOR_PID
        url = url_for(ITEM_ENDPOINT, pid_value=pid_value)
        res = client.get(url, headers=json_headers)
        assert res.status_code in expected_status

    def _test_delete(expected_status, pid):
        """Test record delete."""
        pid_value = pid or VENDOR_PID
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
