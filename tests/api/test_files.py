# -*- coding: utf-8 -*-
#
# Copyright (C) 2019 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""Test files."""

import json

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


def _test_data_exists(key, res):
    """Util function for testing output data."""
    data = json.loads(res.data.decode("utf-8"))["metadata"]
    assert key in data


def test_create_bucket_endpoint(client, json_headers, location, testdata,
                                users):
    """Test GET permissions."""
    user_login("admin", client, users)

    url_with_bucket_id = \
        url_for("invenio_app_ils_files.eitmid_bucket", pid_value="eitemid-3")
    url_without_bucket_id = \
        url_for("invenio_app_ils_files.eitmid_bucket", pid_value="eitemid-4")

    res1 = _test_response(
        client,
        "post",
        url_with_bucket_id,
        json_headers,
        None,
        200
    )
    _test_data_exists("bucket_id", res1)
    res2 = _test_response(
        client,
        "post",
        url_without_bucket_id,
        json_headers,
        None,
        201
    )
    _test_data_exists("bucket_id", res2)
