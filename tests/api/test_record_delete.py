# -*- coding: utf-8 -*-
#
# Copyright (C) 2018-19 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""Test record delete."""

from flask import url_for
from invenio_accounts.models import User
from invenio_accounts.testutils import login_user_via_session


def test_delete_location(client, users, json_headers, testdata):
    """Test DELETE existing location."""
    login_user_via_session(
        client,
        email=User.query.get(users["admin"].id).email
    )

    location_pid = 'locid-1'
    url = url_for('invenio_records_rest.locid_item', pid_value=location_pid)
    res = client.delete(url, headers=json_headers)
    assert res.status_code == 400

    location_pid = 'locid-2'
    url = url_for('invenio_records_rest.locid_item', pid_value=location_pid)
    res = client.delete(url, headers=json_headers)
    assert res.status_code == 204


def test_delete_internal_location(client, users, json_headers, testdata):
    """Test DELETE existing internal_location."""
    login_user_via_session(
        client,
        email=User.query.get(users["admin"].id).email
    )

    internal_location_pid = 'ilocid-1'
    url = url_for(
        'invenio_records_rest.ilocid_item',
        pid_value=internal_location_pid
    )
    res = client.delete(url, headers=json_headers)
    assert res.status_code == 400

    internal_location_pid = 'ilocid-3'
    url = url_for(
        'invenio_records_rest.ilocid_item',
        pid_value=internal_location_pid
    )
    res = client.delete(url, headers=json_headers)
    assert res.status_code == 204


def test_delete_keyword(client, users, json_headers, testdata):
    """Test DELETE existing keyword."""
    login_user_via_session(
        client,
        email=User.query.get(users["admin"].id).email
    )

    keyword_pid = 'keyid-1'
    url = url_for('invenio_records_rest.keyid_item', pid_value=keyword_pid)
    res = client.delete(url, headers=json_headers)
    assert res.status_code == 204
