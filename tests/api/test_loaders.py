# -*- coding: utf-8 -*-
#
# Copyright (C) 2018 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""Test accesibility of resource endpoints."""

from __future__ import unicode_literals

import json

from flask import url_for
from invenio_accounts.models import User
from invenio_accounts.testutils import login_user_via_session

NEW_INTERNAL_LOCATION = {
    "location_pid": "locid-1",
    "legacy_id": "Test legacy id",
    "name": "My test internal location",
    "physical_location": "Left from the right building",
    "notes": "In house",
}


def user_login(user_id, client, users):
    """Util function log user in."""
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


def test_post_internal_location(client, json_headers, testdata, users):
    """Test POST of internal_location."""
    user_login("admin", client, users)
    url = url_for("invenio_records_rest.ilocid_list")
    res = _test_response(
        client, "post", url, json_headers, NEW_INTERNAL_LOCATION, 201
    )
    data = json.loads(res.data.decode("utf-8"))["metadata"]
    assert "name" in data["location"]


def test_post_partial_internal_location(client, json_headers, testdata, users):
    """Test POST of internal_location without all required data."""
    user_login("admin", client, users)
    del NEW_INTERNAL_LOCATION["location_pid"]
    url = url_for("invenio_records_rest.ilocid_list")
    _test_response(
        client, "post", url, json_headers, NEW_INTERNAL_LOCATION, 400
    )


def test_post_item(client, json_headers, testdata, users, item_record):
    """Test POST of an item."""
    user_login("admin", client, users)
    url = url_for("invenio_records_rest.pitmid_list")
    del item_record["item_pid"]
    res = _test_response(client, "post", url, json_headers, item_record, 201)
    data = json.loads(res.data.decode("utf-8"))["metadata"]
    assert "name" in data["internal_location"]
