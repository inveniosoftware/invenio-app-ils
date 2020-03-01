# -*- coding: utf-8 -*-
#
# Copyright (C) 2018 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""Test accessibility of resource endpoints."""

from __future__ import unicode_literals

import copy

import pytest
from flask import url_for
from tests.api.helpers import user_login, validate_data, validate_response


@pytest.mark.parametrize(
    "user,res_id,expected_resp_code",
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
    client,
    json_headers,
    testdata,
    users,
    with_access,
    user,
    res_id,
    expected_resp_code,
):
    """Test GET permissions."""
    user_login(client, user, users)
    url = url_for("invenio_records_rest.pitmid_item", pid_value=res_id)
    validate_response(
        client, "get", url, json_headers, None, expected_resp_code)


@pytest.mark.parametrize(
    "user,expected_resp_code",
    [("patron1", 403), ("librarian", 201), ("admin", 201), ("anonymous", 401)],
)
def test_post_item_endpoint(
    client,
    json_headers,
    testdata,
    users,
    user,
    expected_resp_code,
    item_record,
):
    """Test POST permissions of an item."""
    user_login(client, user, users)
    url = url_for("invenio_records_rest.pitmid_list")
    ITEM = copy.deepcopy(item_record)
    if "pid" in ITEM:
        del ITEM["pid"]
    res = validate_response(
        client, "post", url, json_headers, ITEM, expected_resp_code
    )
    validate_data("barcode", ITEM["barcode"], res)


@pytest.mark.parametrize(
    "user,res_id,expected_resp_code",
    [
        ("patron1", "itemid-55", 403),
        ("librarian", "itemid-55", 200),
        ("admin", "itemid-55", 200),
        ("anonymous", "itemid-55", 401),
        ("patron1", "itemid-50", 403),
        ("librarian", "itemid-50", 200),
        ("admin", "itemid-50", 200),
        ("anonymous", "itemid-50", 401),
        ("patron1", "itemid-53", 403),
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
    user,
    res_id,
    expected_resp_code,
    item_record,
):
    """Test PUT permissions of an item."""
    url = url_for("invenio_records_rest.pitmid_item", pid_value=res_id)
    user_login(client, user, users)
    ITEM = copy.deepcopy(item_record)
    res = validate_response(
        client, "put", url, json_headers, ITEM, expected_resp_code
    )
    validate_data("pid", res_id, res)


@pytest.mark.parametrize(
    "user,res_id,expected_resp_code",
    [
        ("patron1", "itemid-55", 403),
        ("librarian", "itemid-55", 204),
        ("admin", "itemid-55", 204),
        ("anonymous", "itemid-55", 401),
        ("patron1", "itemid-51", 403),
        ("librarian", "itemid-51", 204),
        ("anonymous", "itemid-51", 401),
        ("patron1", "itemid-52", 403),
    ],
)
def test_delete_item_endpoint(
    client,
    json_headers,
    testdata,
    users,
    user,
    res_id,
    expected_resp_code,
    item_record,
):
    """Test DELETE permissions of an item."""
    user_login(client, user, users)
    url = url_for("invenio_records_rest.pitmid_item", pid_value=res_id)
    validate_response(
        client,
        "delete",
        url,
        json_headers,
        data=item_record,
        expected_resp_code=expected_resp_code,
    )


@pytest.mark.parametrize(
    "user,res_id,expected_resp_code,filtered",
    [
        ("patron1", "itemid-56", 200, False),
        ("patron2", "itemid-56", 200, True),
        ("patron1", "itemid-57", 200, True),
        ("patron2", "itemid-57", 200, False),
        ("librarian", "itemid-56", 200, False),
        ("admin", "itemid-57", 200, False),
    ],
)
def test_item_circulation(
    client,
    json_headers,
    testdata,
    users,
    user,
    res_id,
    expected_resp_code,
    filtered,
):
    """Test item circulation filtering."""
    user_login(client, user, users)
    url = url_for("invenio_records_rest.pitmid_item", pid_value=res_id)
    res = validate_response(
        client, "get", url, json_headers, None, expected_resp_code
    )
    circulation = res.json["metadata"]["circulation"]
    filter_keys = ["loan_pid", "patron_pid"]
    if filtered:
        for key in filter_keys:
            assert key not in circulation
    else:
        for key in filter_keys:
            assert key in circulation
