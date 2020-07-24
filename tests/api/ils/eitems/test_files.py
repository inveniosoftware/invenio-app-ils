# -*- coding: utf-8 -*-
#
# Copyright (C) 2019 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""Test files."""

import json

from flask import url_for
from invenio_search import current_search
from six import BytesIO

from tests.helpers import user_login


def _test_response(
    client,
    req_method,
    url,
    headers,
    data,
    expected_resp_code,
    input_stream=None,
):
    """Util function testing response code."""
    kwargs = {}
    if input_stream:
        kwargs["input_stream"] = input_stream
    if data:
        res = getattr(client, req_method)(
            url, headers=headers, data=json.dumps(data), **kwargs
        )
    else:
        res = getattr(client, req_method)(url, headers=headers, **kwargs)
    assert expected_resp_code == res.status_code
    return res


def _test_data_exists(key, res):
    """Util function for testing output data."""
    data = json.loads(res.data.decode("utf-8"))["metadata"]
    assert key in data


def test_create_bucket_endpoint(
    client, json_headers, location, testdata, users
):
    """Test GET permissions."""
    user_login(client, "admin", users)

    url_with_bucket_id = url_for(
        "invenio_app_ils_files.eitmid_bucket", pid_value="eitemid-3"
    )
    url_without_bucket_id = url_for(
        "invenio_app_ils_files.eitmid_bucket", pid_value="eitemid-4"
    )

    res1 = _test_response(
        client, "post", url_with_bucket_id, json_headers, None, 200
    )
    _test_data_exists("bucket_id", res1)
    res2 = _test_response(
        client, "post", url_without_bucket_id, json_headers, None, 201
    )
    _test_data_exists("bucket_id", res2)


def test_create_bucket_permissions(
    client, json_headers, location, testdata, users
):
    """Test create bucket permissions."""
    url = url_for("invenio_app_ils_files.eitmid_bucket", pid_value="eitemid-1")
    _test_response(client, "post", url, json_headers, None, 401)

    test_data = [
        ("admin", "eitemid-1", 201),
        ("librarian", "eitemid-2", 201),
        ("patron1", "eitemid-2", 403),
    ]
    for user, pid, status_code in test_data:
        user_login(client, user, users)
        url = url_for("invenio_app_ils_files.eitmid_bucket", pid_value=pid)
        _test_response(client, "post", url, json_headers, None, status_code)


def test_upload_files_permissions(
    client, json_headers, bucket, testdata, users
):
    """Test upload files permissions."""
    filename = "myfile.txt"
    data = b"hello world"
    url = url_for(
        "invenio_files_rest.object_api", bucket_id=str(bucket.id), key=filename
    )

    test_data = [
        ("anonymous", 404),
        ("admin", 200),
        ("librarian", 200),
        ("patron1", 404),
    ]
    for user, status_code in test_data:
        user_login(client, user, users)
        _test_response(
            client,
            "put",
            url,
            json_headers,
            None,
            status_code,
            input_stream=BytesIO(data),
        )


def test_download_files_permissions(
    client, json_headers, location, testdata, users
):
    """Test download files permissions."""

    tests = [
        (
            "eitemid-4",
            [
                ("anonymous", 200),
                ("admin", 200),
                ("librarian", 200),
                ("patron1", 200),
            ],
        ),
        (
            "eitemid-5",
            [
                ("anonymous", 404),
                ("admin", 200),
                ("librarian", 200),
                ("patron1", 200),
            ],
        ),
    ]

    for pid, expected in tests:
        # Create e-item bucket
        user_login(client, "admin", users)
        url = url_for("invenio_app_ils_files.eitmid_bucket", pid_value=pid)
        res = _test_response(client, "post", url, json_headers, None, 201)
        bucket_id = json.loads(res.data)["metadata"]["bucket_id"]

        # Upload file to e-item bucket
        filename = "myfile.txt"
        data = b"hello world"
        url = url_for(
            "invenio_files_rest.object_api", bucket_id=bucket_id, key=filename
        )
        _test_response(
            client,
            "put",
            url,
            json_headers,
            None,
            200,
            input_stream=BytesIO(data),
        )

        current_search.flush_and_refresh(index="eitems")

        # Download file
        for user, status_code in expected:
            user_login(client, user, users)
            _test_response(client, "get", url, None, None, status_code)
