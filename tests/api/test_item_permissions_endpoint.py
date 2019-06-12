# -*- coding: utf-8 -*-
#
# Copyright (C) 2018 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""Test accessibility of resource endpoints."""

from __future__ import unicode_literals

import copy
import json

import pytest
from flask import url_for
from invenio_accounts.models import User
from invenio_accounts.testutils import login_user_via_session


def user_login(user_id, client, users):
    """Util function log user in."""
    if user_id != "anonymous":
        login_user_via_session(
            client, email=User.query.get(users[user_id].id).email
        )


def _test_response(client, req_method, url, headers, data, expected_resp_code):
    """Util function testing response code."""
    if data:
        res = getattr(client, req_method)(
            url, headers=headers, data=json.dumps(data)
        )
    else:
        res = getattr(client, req_method)(url, headers=headers)
    assert expected_resp_code == res.status_code
    return res


def _test_data(key, expected_output, res):
    """Util function for testing output data."""
    if res.status_code != 403 and res.status_code != 401:
        data = json.loads(res.data.decode("utf-8"))["metadata"]
        assert data[key] == expected_output


@pytest.mark.parametrize(
    "user_id,res_id,expected_resp_code",
    [
        ("patron1", "itemid-1", 200),
        ("librarian", "itemid-1", 200),
        ("admin", "itemid-1", 200),
        ("anonymous", "itemid-1", 200),
        ("patron1", "itemid-54", 200),
        ("librarian", "itemid-54", 200),
        ("admin", "itemid-54", 200),
        ("anonymous", "itemid-54", 401),
    ],
)
def test_get_item_endpoint(
    client, json_headers, testdata, users, user_id, res_id, expected_resp_code
):
    """Test GET permissions."""
    user_login(user_id, client, users)
    url = url_for("invenio_records_rest.pitmid_item", pid_value=res_id)
    _test_response(client, "get", url, json_headers, None, expected_resp_code)


@pytest.mark.parametrize(
    "user_id,expected_resp_code",
    [("patron1", 403), ("librarian", 201), ("admin", 201), ("anonymous", 401)],
)
def test_post_item_endpoint(
    client,
    json_headers,
    testdata,
    users,
    user_id,
    expected_resp_code,
    item_record,
):
    """Test POST permissions of an item."""
    user_login(user_id, client, users)
    url = url_for("invenio_records_rest.pitmid_list")
    ITEM = copy.deepcopy(item_record)
    if "item_pid" in ITEM:
        del ITEM["item_pid"]
    res = _test_response(
        client, "post", url, json_headers, ITEM, expected_resp_code
    )
    _test_data("item_pid", "1", res)


@pytest.mark.parametrize(
    "user_id,res_id,expected_resp_code",
    [
        ("patron1", "itemid-55", 403),
        ("librarian", "itemid-55", 200),
        ("admin", "itemid-55", 200),
        ("anonymous", "itemid-55", 401),
        ("patron1", "itemid-50", 200),
        ("librarian", "itemid-50", 200),
        ("admin", "itemid-50", 200),
        ("anonymous", "itemid-50", 401),
        ("patron1", "itemid-53", 200),
        ("librarian", "itemid-53", 200),
        ("admin", "itemid-53", 200),
        ("anonymous", "itemid-53", 401),
    ],
)
def test_put_item_endpoint(
    client,
    json_headers,
    testdata,
    users,
    user_id,
    res_id,
    expected_resp_code,
    item_record,
):
    """Test PUT permissions of an item."""
    url = url_for("invenio_records_rest.pitmid_item", pid_value=res_id)
    user_login(user_id, client, users)
    ITEM = copy.deepcopy(item_record)
    res = _test_response(
        client, "put", url, json_headers, ITEM, expected_resp_code
    )
    _test_data("item_pid", res_id, res)


@pytest.mark.parametrize(
    "user_id,res_id,expected_resp_code",
    [
        ("patron1", "itemid-55", 403),
        ("librarian", "itemid-55", 200),
        ("admin", "itemid-55", 200),
        ("anonymous", "itemid-55", 401),
        ("patron1", "itemid-50", 200),
        ("librarian", "itemid-50", 200),
        ("admin", "itemid-50", 200),
        ("anonymous", "itemid-50", 401),
        ("patron1", "itemid-53", 200),
        ("librarian", "itemid-53", 200),
        ("admin", "itemid-53", 200),
        ("anonymous", "itemid-53", 401),
    ],
)
def test_patch_item_endpoint(
    client,
    json_patch_headers,
    testdata,
    users,
    user_id,
    res_id,
    expected_resp_code,
):
    """Test PATCH permission of an item."""
    patch = [{"op": "replace", "path": "/status", "value": "CAN_CIRCULATE"}]
    url = url_for("invenio_records_rest.pitmid_item", pid_value=res_id)
    user_login(user_id, client, users)
    res = _test_response(
        client,
        "patch",
        url,
        json_patch_headers,
        data=patch,
        expected_resp_code=expected_resp_code,
    )
    _test_data("status", "CAN_CIRCULATE", res)


@pytest.mark.parametrize(
    "user_id,res_id,expected_resp_code",
    [
        ("patron1", "itemid-55", 403),
        ("librarian", "itemid-55", 403),
        ("admin", "itemid-55", 204),
        ("anonymous", "itemid-55", 401),
        ("patron1", "itemid-51", 403),
        ("librarian", "itemid-51", 204),
        ("anonymous", "itemid-51", 401),
        ("patron1", "itemid-52", 204),
    ],
)
def test_delete_item_endpoint(
    client,
    json_headers,
    testdata,
    users,
    user_id,
    res_id,
    expected_resp_code,
    item_record,
):
    """Test DELETE permissions of an item."""
    user_login(user_id, client, users)
    url = url_for("invenio_records_rest.pitmid_item", pid_value=res_id)
    _test_response(
        client,
        "delete",
        url,
        json_headers,
        data=item_record,
        expected_resp_code=expected_resp_code,
    )


@pytest.mark.parametrize(
    "user_id,res_id,expected_resp_code,filtered",
    [
        ("patron1", "itemid-56", 200, False),
        ("patron2", "itemid-56", 200, True),
        ("patron1", "itemid-57", 200, True),
        ("patron2", "itemid-57", 200, False),
        ("librarian", "itemid-56", 200, False),
        ("admin", "itemid-57", 200, False),
    ]
)
def test_item_circulation_status(client, json_headers, testdata, users,
                                 user_id, res_id, expected_resp_code,
                                 filtered):
    """Test item circulation_status filtering."""
    user_login(user_id, client, users)
    url = url_for("invenio_records_rest.pitmid_item", pid_value=res_id)
    res = _test_response(
        client,
        "get",
        url,
        json_headers,
        None,
        expected_resp_code
    )
    circulation_status = res.json["metadata"]["circulation_status"]
    filter_keys = [
        "loan_pid",
        "patron_pid",
    ]
    if filtered:
        for key in filter_keys:
            assert key not in circulation_status
    else:
        for key in filter_keys:
            assert key in circulation_status
