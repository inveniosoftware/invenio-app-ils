# SPDX-FileCopyrightText: 2022 CERN.
# SPDX-License-Identifier: MIT

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
