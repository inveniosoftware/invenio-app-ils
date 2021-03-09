# -*- coding: utf-8 -*-
#
# Copyright (C) 2020 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""Test ILL borrowing requests."""

import json

from flask import url_for
from invenio_search import current_search

from tests.helpers import user_login

_HTTP_OK = [200, 201, 204]
BRWREQ_PID = "illbid-1"
ITEM_ENDPOINT = "invenio_records_rest.illbid_item"
LIST_ENDPOINT = "invenio_records_rest.illbid_list"


def test_ill_brwreqs_list_permissions(client, testdata, json_headers, users):
    """Test borrowing requests list permissions."""
    patron1_brwreq = dict(
        status="PENDING",
        document_pid="docid-1",
        patron_pid="1",
        provider_pid="ill-provid-1",
        type="PHYSICAL_COPY",
    )
    patron2_brwreq = dict(
        status="PENDING",
        document_pid="docid-1",
        patron_pid="2",
        provider_pid="ill-provid-1",
        type="PHYSICAL_COPY",
    )

    def _test_list(expected_status, pids):
        """Test get list for given pids."""
        q = " OR ".join(["pid:{}".format(pid) for pid in pids])
        list_url = url_for(LIST_ENDPOINT, q=q)
        res = client.get(list_url, headers=json_headers)
        assert res.status_code in expected_status
        return res.get_json()

    # create records
    list_url = url_for(LIST_ENDPOINT)
    user_login(client, "admin", users)
    res = client.post(
        list_url, headers=json_headers, data=json.dumps(patron1_brwreq)
    )
    patron1_brwreq_pid = res.get_json()["metadata"]["pid"]

    res = client.post(
        list_url, headers=json_headers, data=json.dumps(patron2_brwreq)
    )
    patron2_brwreq_pid = res.get_json()["metadata"]["pid"]
    all_pids = [patron1_brwreq_pid, patron2_brwreq_pid]
    # wait for ES
    current_search.flush_and_refresh(index="ill_borrowing_requests")

    # test results
    tests = [
        ("admin", _HTTP_OK, all_pids),
        ("librarian", _HTTP_OK, all_pids),
        ("patron1", _HTTP_OK, [patron1_brwreq_pid]),
        ("patron2", _HTTP_OK, [patron2_brwreq_pid]),
    ]
    for username, expected_status, expected_pids in tests:
        user_login(client, username, users)
        results = _test_list(expected_status, all_pids)
        assert results["hits"]["total"] == len(expected_pids)
        found_pids = [
            hit["metadata"]["pid"] for hit in results["hits"]["hits"]
        ]
        assert set(expected_pids) == set(found_pids)

    # anonymous
    user_login(client, "anonymous", users)
    _test_list([401], [])


def test_ill_brwreq_details_permissions(client, testdata, json_headers, users):
    """Test borrowing requests details permissions."""
    dummy_borrowing_request = dict(
        status="PENDING",
        document_pid="docid-1",
        patron_pid="1",
        provider_pid="ill-provid-1",
        type="PHYSICAL_COPY",
    )

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

    # create/update
    tests = [
        ("anonymous", [401], dummy_borrowing_request),
        ("patron2", [403], dummy_borrowing_request),
        ("patron1", [403], dummy_borrowing_request),
        ("librarian", _HTTP_OK, dummy_borrowing_request),
        ("admin", _HTTP_OK, dummy_borrowing_request),
    ]
    for username, expected_status, data in tests:
        user = user_login(client, username, users)
        pid = _test_create(expected_status, data, user)
        _test_update(expected_status, data, pid, user)

    # get
    tests = [
        ("anonymous", [401]),
        ("patron2", [403]),
        ("patron1", _HTTP_OK),
        ("librarian", _HTTP_OK),
        ("admin", _HTTP_OK),
    ]
    for username, expected_status in tests:
        user_login(client, username, users)
        _test_read(expected_status, BRWREQ_PID)

    # delete
    tests = [
        ("anonymous", [401]),
        ("patron2", [403]),
        ("patron1", [403]),
        ("librarian", [403]),
        ("admin", _HTTP_OK),
    ]
    for username, expected_status in tests:
        user_login(client, username, users)
        _test_delete(expected_status, BRWREQ_PID)
