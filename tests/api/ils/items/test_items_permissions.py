# -*- coding: utf-8 -*-
#
# Copyright (C) 2018 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""Test accessibility of resource endpoints."""

import copy
import json

from flask import url_for

from tests.helpers import user_login, validate_response

_HTTP_OK = [200, 201, 204]
ITEM_PID = "itemid-1"
ITEM_ENDPOINT = "invenio_records_rest.pitmid_item"
LIST_ENDPOINT = "invenio_records_rest.pitmid_list"


def test_items_permissions(client, testdata, item_record, json_headers, users):
    """Test items endpoints permissions."""
    dummy_item = copy.deepcopy(item_record)
    tests = [
        ("admin", _HTTP_OK, dummy_item),
        ("librarian", _HTTP_OK, dummy_item),
        ("patron1", [403], dummy_item),
        ("anonymous", [401], dummy_item),
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
            return record["pid"]

    def _test_update(expected_status, data, pid):
        """Test record update."""
        pid_value = pid or ITEM_PID
        url = url_for(ITEM_ENDPOINT, pid_value=pid_value)
        res = client.put(url, headers=json_headers, data=json.dumps(data))
        assert res.status_code in expected_status
        if res.status_code < 400:
            record = res.get_json()["metadata"]

    def _test_read(expected_status, pid):
        """Test record read."""
        pid_value = pid or ITEM_PID
        url = url_for(ITEM_ENDPOINT, pid_value=pid_value)
        res = client.get(url, headers=json_headers)
        assert res.status_code in expected_status

    def _test_delete(expected_status, pid):
        """Test record delete."""
        pid_value = pid or ITEM_PID
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


def test_item_circulation(client, json_headers, testdata, users):
    """Test item circulation filtering."""

    tests = [
        ("patron1", "itemid-56", 403, False),
        ("patron2", "itemid-56", 403, True),
        ("patron1", "itemid-57", 403, True),
        ("patron2", "itemid-57", 403, False),
        ("librarian", "itemid-56", 200, False),
        ("admin", "itemid-57", 200, False),
    ]

    for username, pid, expected_resp_code, filtered in tests:
        user_login(client, username, users)
        url = url_for("invenio_records_rest.pitmid_item", pid_value=pid)
        res = validate_response(
            client, "get", url, json_headers, None, expected_resp_code
        )
        if res.status_code < 400:
            circulation = res.json["metadata"]["circulation"]
            filter_keys = ["loan_pid", "patron_pid"]
            if filtered:
                for key in filter_keys:
                    assert key not in circulation
            else:
                for key in filter_keys:
                    assert key in circulation
