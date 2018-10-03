# -*- coding: utf-8 -*-
#
# Copyright (C) 2018 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""Test permissions."""

from __future__ import absolute_import, print_function

from flask import url_for
import json

from invenio_accounts.models import User
from invenio_accounts.testutils import login_user_via_session
from invenio_app_ils.permissions import loan_owner


def _fetch_loan(app, json_headers, loan, user):
    """Return the loan fetched with a REST call."""
    with app.test_client() as client:
        login_user_via_session(client, email=User.query.get(user.id).email)
        url = url_for('invenio_records_rest.loanid_item',
                      pid_value=loan['loanid'])
        return client.get(url, headers=json_headers)


def test_admin_can_fetch_any_loan(app, json_headers, db, users, testdata):
    """Test that admins can fetch any loan."""
    admin = users['admin']

    # Patron 1
    loan_patron1 = testdata['loans'][0]
    assert loan_patron1['patron_pid'] == "1"

    res = _fetch_loan(app, json_headers, loan=loan_patron1, user=admin)
    assert res.status_code == 200
    data = json.loads(res.data.decode('utf-8'))['metadata']
    assert data['loanid'] == loan_patron1['loanid']
    assert data['patron_pid'] == loan_patron1['patron_pid']

    # Patron 2
    loan_patron2 = testdata['loans'][3]
    assert loan_patron2['patron_pid'] == "2"

    res = _fetch_loan(app, json_headers, loan=loan_patron2, user=admin)
    assert res.status_code == 200
    data = json.loads(res.data.decode('utf-8'))['metadata']
    assert data['loanid'] == loan_patron2['loanid']
    assert data['patron_pid'] == loan_patron2['patron_pid']
