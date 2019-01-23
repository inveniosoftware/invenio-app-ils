# -*- coding: utf-8 -*-
#
# Copyright (C) 2018 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""Test accesibility of resource endpoints."""

from __future__ import unicode_literals

import copy
import json

import pytest
from flask import url_for
from invenio_accounts.models import User
from invenio_accounts.testutils import login_user_via_session

NEW_ITEM = {
    "barcode": "123456789",
    "title": "Test item x",
    "internal_location_pid": "ilocid-1",
    "status": "LOANABLE",
}


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
    url = url_for("invenio_records_rest.itemid_item", pid_value=res_id)
    _test_response(client, "get", url, json_headers, None, expected_resp_code)


@pytest.mark.parametrize(
    "user_id,expected_resp_code",
    [
        ("patron1", 403),
        ("librarian", 201),
        ("admin", 201),
        ("anonymous", 401),
    ],
)
def test_post_item_endpoint(
    client, json_headers, testdata, users, user_id, expected_resp_code
):
    """Test POST permissions of an item."""
    user_login(user_id, client, users)
    url = url_for("invenio_records_rest.itemid_list")
    ITEM = copy.deepcopy(NEW_ITEM)
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
    client, json_headers, testdata, users, user_id, res_id, expected_resp_code
):
    """Test PUT permissions of an item."""
    url = url_for("invenio_records_rest.itemid_item", pid_value=res_id)
    user_login(user_id, client, users)
    ITEM = copy.deepcopy(NEW_ITEM)
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
    patch = [{"op": "replace", "path": "/status", "value": "LOANABLE"}]
    url = url_for("invenio_records_rest.itemid_item", pid_value=res_id)
    user_login(user_id, client, users)
    res = _test_response(
        client,
        "patch",
        url,
        json_patch_headers,
        data=patch,
        expected_resp_code=expected_resp_code,
    )
    _test_data("status", "LOANABLE", res)


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
    client, json_headers, testdata, users, user_id, res_id, expected_resp_code
):
    """Test DELETE permissions of an item."""
    user_login(user_id, client, users)
    url = url_for("invenio_records_rest.itemid_item", pid_value=res_id)
    _test_response(
        client,
        "delete",
        url,
        json_headers,
        data=NEW_ITEM,
        expected_resp_code=expected_resp_code,
    )
