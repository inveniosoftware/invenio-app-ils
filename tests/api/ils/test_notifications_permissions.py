# Copyright (C) 2021 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""Test notifications permissions."""

from flask import url_for

from tests.helpers import user_login

_HTTP_OK = [200, 201, 204]
_HTTP_UNAUTHORIZED = [401]
_HTTP_FORBIDDEN = [403]
_HTTP_NOT_FOUND = [404]
MAIL_ID = 1
ITEM_ENDPOINT = "invenio_app_ils_notifications.get_notification"
LIST_ENDPOINT = "invenio_app_ils_notifications.get_notifications"


def test_notifications_read_permissions(client, json_headers, users):
    """Test notifications endpoints read permissions."""
    list_tests = [
        ("admin", _HTTP_OK),
        ("librarian", _HTTP_OK),
        ("patron1", _HTTP_FORBIDDEN),
        ("anonymous", _HTTP_UNAUTHORIZED),
    ]

    item_tests = [
        ("admin", _HTTP_NOT_FOUND),
        ("librarian", _HTTP_NOT_FOUND),
        ("patron1", _HTTP_FORBIDDEN),
        ("anonymous", _HTTP_UNAUTHORIZED),
    ]

    def _test_list(expected_status):
        """Test get list."""
        url = url_for(LIST_ENDPOINT)
        res = client.get(url, headers=json_headers)
        assert res.status_code in expected_status

    def _test_read(expected_status, id):
        """Test record read."""
        url = url_for(ITEM_ENDPOINT, id=id)
        res = client.get(url, headers=json_headers)
        assert res.status_code in expected_status

    for username, expected_status in list_tests:
        user_login(client, username, users)
        _test_list(expected_status)

    for username, expected_status in item_tests:
        user_login(client, username, users)
        _test_read(expected_status, MAIL_ID)
