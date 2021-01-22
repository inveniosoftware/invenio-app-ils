# -*- coding: utf-8 -*-
#
# Copyright (C) 2018 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""Test accesibility of resource endpoints."""

import json

from flask import url_for

from tests.helpers import user_login, validate_response

NEW_INTERNAL_LOCATION = {
    "location_pid": "locid-1",
    "legacy_ids": ["Test legacy id"],
    "name": "My test internal location",
    "physical_location": "Left from the right building",
    "notes": "In house",
}


def test_post_internal_location(client, json_headers, testdata, users):
    """Test POST of internal_location."""
    user_login(client, "admin", users)
    url = url_for("invenio_records_rest.ilocid_list")
    res = validate_response(
        client, "post", url, json_headers, NEW_INTERNAL_LOCATION, 201
    )
    data = json.loads(res.data.decode("utf-8"))["metadata"]
    assert "name" in data["location"]


def test_post_partial_internal_location(client, json_headers, testdata, users):
    """Test POST of internal_location without all required data."""
    user_login(client, "admin", users)
    del NEW_INTERNAL_LOCATION["location_pid"]
    url = url_for("invenio_records_rest.ilocid_list")
    validate_response(
        client, "post", url, json_headers, NEW_INTERNAL_LOCATION, 400
    )


def test_post_item(client, json_headers, testdata, users, item_record):
    """Test POST of an item."""
    user_login(client, "admin", users)
    url = url_for("invenio_records_rest.pitmid_list")
    del item_record["pid"]
    res = validate_response(
        client, "post", url, json_headers, item_record, 201
    )
    data = json.loads(res.data.decode("utf-8"))["metadata"]
    assert "name" in data["internal_location"]
