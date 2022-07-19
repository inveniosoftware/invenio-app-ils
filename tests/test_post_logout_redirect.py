# -*- coding: utf-8 -*-
#
# Copyright (C) 2022 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""Simple test of correct patron redirection after being logged out."""

from flask import url_for

from tests.helpers import user_login


def test_correct_redirection_after_logout(client, users):
    """
    Test that a patron is redirected into /logged-out page after logging out.
    """
    user_login(client, "patron1", users)
    res = client.get(url_for("security.logout"), follow_redirects=True)

    assert res.status_code == 200
    assert res.request.path == url_for("logged_out.logged_out_view")
