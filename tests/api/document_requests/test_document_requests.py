# -*- coding: utf-8 -*-
#
# Copyright (C) 2020 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""Test document requests."""

import json

from flask import url_for

from tests.helpers import user_login


def _compare_list_data(all_expected, data, user_id, is_admin):
    """Compare list data with expected values."""
    if is_admin:
        expected = []
        for pids in all_expected.values():
            for pid in pids:
                expected.append(pid)
    else:
        expected = all_expected[str(user_id)]

    for hit in data["hits"]["hits"]:
        assert hit["metadata"]["pid"] in expected


def test_request_list_permissions(client, testdata, json_headers, users):
    """Test doc req list permissions."""
    url = url_for("invenio_records_rest.dreqid_list")
    res = client.get(url, headers=json_headers)
    assert res.status_code == 401

    requests_by_patron = {}
    for req in testdata["document_requests"]:
        if req["patron_pid"] not in requests_by_patron:
            requests_by_patron[req["patron_pid"]] = []
        requests_by_patron[req["patron_pid"]].append(req["pid"])

    for username in users.keys():
        user = user_login(client, username, users)
        url = url_for("invenio_records_rest.dreqid_list")
        res = client.get(url, headers=json_headers)
        assert res.status_code == 200
        data = json.loads(res.data.decode("utf-8"))
        is_admin = "librarian" in user.email or "admin" in user.email
        _compare_list_data(requests_by_patron, data, user.id, is_admin)


def test_create_document_request(client, testdata, json_headers, users):
    """Test creating document requests."""
    tests = [
        (
            "admin",
            201,
            dict(
                title="Test title",
                request_type="LOAN",
                medium="Paper",
                patron_pid="1",
            ),
        ),
        (
            "librarian",
            400,
            dict(
                patron_pid="1",
            ),
        ),
        (
            "admin",
            201,
            dict(
                patron_pid="1",
                title="Test",
                invalid_param="Test",
                request_type="LOAN",
                medium="Paper",
            ),
        ),
        (
            "librarian",
            201,
            dict(
                title="Test title",
                patron_pid="1",
                request_type="BUY",
                medium="Paper",
            ),
        ),
        (
            "patron1",
            201,
            dict(
                title="Test title",
                patron_pid="1",
                request_type="BUY",
                medium="Paper",
            ),
        ),
        (
            "patron2",
            400,
            dict(
                title="Test title",
                patron_pid="1",
                request_type="LOAN",
                medium="Paper",
            ),
        ),
        (
            "patron2",
            201,
            dict(
                title="Test title",
                patron_pid="2",
                request_type="LOAN",
                medium="Paper",
            ),
        ),
    ]
    for username, expected_status, data in tests:
        user_login(client, username, users)
        url = url_for("invenio_records_rest.dreqid_list")
        res = client.post(url, headers=json_headers, data=json.dumps(data))
        assert res.status_code == expected_status
        if res.status_code == 201:
            assert "invalid_param" not in json.loads(res.data)["metadata"]
