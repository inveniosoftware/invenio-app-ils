# -*- coding: utf-8 -*-
#
# Copyright (C) 2020 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""Test vocabularies endpoint."""
import json

from flask import url_for

from tests.helpers import user_login

LIST_ENDPOINT = "invenio_records_rest.vocid_list"


def test_vocabularies_permissions(client, testdata, json_headers, users):
    """Test vocabularies endpoints permissions."""
    tests = [
        ("admin", [200]),
        ("librarian", [200]),
        ("patron1", [200]),
        ("anonymous", [401]),
    ]

    def _test_list(expected_status):
        """Test get list."""
        url = url_for(LIST_ENDPOINT)
        res = client.get(url, headers=json_headers)
        assert res.status_code in expected_status

    for username, codes in tests:
        user_login(client, username, users)
        _test_list(codes)
