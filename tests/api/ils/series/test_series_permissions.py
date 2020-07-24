# -*- coding: utf-8 -*-
#
# Copyright (C) 2020 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""Test Series permissions."""

import json

from flask import url_for

from tests.helpers import user_login

_HTTP_OK = [200, 201, 204]
SERIES_PID = "serid-1"
ITEM_ENDPOINT = "invenio_records_rest.serid_item"
LIST_ENDPOINT = "invenio_records_rest.serid_list"


def test_series_read_permissions(client, testdata, json_headers, users):
    """Test Series endpoints read permissions."""
    tests = [
        ("admin", _HTTP_OK),
        ("librarian", _HTTP_OK),
        ("patron1", _HTTP_OK),
        ("anonymous", _HTTP_OK),
    ]

    def _test_list(expected_status):
        """Test get list."""
        url = url_for(LIST_ENDPOINT)
        res = client.get(url, headers=json_headers)
        assert res.status_code in expected_status

    def _test_read(expected_status, pid):
        """Test record read."""
        url = url_for(ITEM_ENDPOINT, pid_value=pid)
        res = client.get(url, headers=json_headers)
        assert res.status_code in expected_status

    for username, expected_status in tests:
        user_login(client, username, users)
        _test_list(expected_status)
        _test_read(expected_status, SERIES_PID)


def test_series_edit_permissions(client, testdata, json_headers, users):
    """Test series endpoints permissions."""
    dummy_series = dict(
        title="The Gulf: The Making of An American Sea",
        authors=["Einstein, Albert", "Stachel, John J et al."],
        mode_of_issuance="MULTIPART_MONOGRAPH",
    )
    tests = [
        ("admin", _HTTP_OK, dummy_series),
        ("librarian", _HTTP_OK, dummy_series),
        ("patron1", [403], dummy_series),
        ("anonymous", [401], dummy_series),
    ]

    def _test_create(expected_status, data):
        """Test record creation."""
        url = url_for(LIST_ENDPOINT)
        res = client.post(url, headers=json_headers, data=json.dumps(data))
        assert res.status_code in expected_status

        if res.status_code < 400:
            record = res.get_json()["metadata"]
            assert record
            return record["pid"]

    def _test_update(expected_status, data, pid):
        """Test record update."""
        pid_value = pid or SERIES_PID
        url = url_for(ITEM_ENDPOINT, pid_value=pid_value)
        res = client.put(url, headers=json_headers, data=json.dumps(data))
        assert res.status_code in expected_status
        if res.status_code < 400:
            record = res.get_json()["metadata"]
            assert record

    def _test_delete(expected_status, pid):
        """Test record delete."""
        pid_value = pid or SERIES_PID
        url = url_for(ITEM_ENDPOINT, pid_value=pid_value)
        res = client.delete(url, headers=json_headers)
        assert res.status_code in expected_status

    for username, expected_status, data in tests:
        user_login(client, username, users)
        pid = _test_create(expected_status, data)
        _test_update(expected_status, data, pid)
        _test_delete(expected_status, pid)
