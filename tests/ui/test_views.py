# -*- coding: utf-8 -*-
#
# Copyright (C) 2018 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""Views tests."""

from __future__ import absolute_import, print_function

import pytest
from flask import url_for
from invenio_accounts.models import User
from invenio_accounts.testutils import login_user_via_session


def test_ping(client):
    """Test the ping view."""
    resp = client.get(url_for('invenio_app_ils_main_ui.ping'))
    assert resp.status_code == 200
    assert resp.get_data(as_text=True) == 'OK'


def test_homepage_view(client):
    """Test the home view."""
    resp = client.get(url_for('invenio_app_ils_main_ui.index'))
    assert resp.status_code == 200


def test_anonymous_cannot_access_backoffice(client):
    """Test anonymous cannot access the backoffice view."""
    backoffice = url_for('invenio_app_ils_backoffice_ui.index')
    resp = client.get(backoffice)
    assert resp.status_code == 401


def test_logged_cannot_access_backoffice(client, users):
    """Test logged in user cannot access the backoffice view."""
    user = users['patron1']
    login_user_via_session(client, email=User.query.get(user.id).email)
    backoffice = url_for('invenio_app_ils_backoffice_ui.index')
    resp = client.get(backoffice)
    assert resp.status_code == 403


def test_librarian_can_access_backoffice(client, users):
    """Test librarian can access the backoffice view."""
    user = users['librarian']
    login_user_via_session(client, email=User.query.get(user.id).email)
    backoffice = url_for('invenio_app_ils_backoffice_ui.index')
    resp = client.get(backoffice)
    assert resp.status_code == 200
