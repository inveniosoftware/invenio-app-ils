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
    resp = client.get(url_for('invenio_app_ils_ui.ping'))
    assert resp.status_code == 200
    assert resp.get_data(as_text=True) == 'OK'


@pytest.mark.skip(reason="test failing on Travis, to be fixed.")
def test_homepage_view(client):
    """Test the home view."""
    resp = client.get(url_for('invenio_app_ils_ui.index'))
    assert resp.status_code == 200
