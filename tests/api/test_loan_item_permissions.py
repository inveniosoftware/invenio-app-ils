# -*- coding: utf-8 -*-
#
# Copyright (C) 2018 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""Test loans item permissions."""

from __future__ import absolute_import, print_function

import json

from flask import url_for
from invenio_accounts.models import User
from invenio_accounts.testutils import login_user_via_session
from invenio_circulation.api import Loan

NEW_LOAN = {
    "item_pid": "itemid-1",
    "patron_pid": "1",
    "transaction_date": "2018-06-29",
    "transaction_location_pid": "locid-1",
    "transaction_user_pid": "4",
    "pickup_location_pid": "locid-1",
    "request_expire_date": "2018-07-28"
}


def _fetch_loan(client, json_headers, loan, user=None):
    """Return the loan fetched with a REST call."""
    if user:
        login_user_via_session(client, email=User.query.get(user.id).email)
    url = url_for('invenio_records_rest.loanid_item',
                  pid_value=loan[Loan.pid_field])
    return client.get(url, headers=json_headers)


def _assert_get_loan_success(client, json_headers, loan, user):
    """Assert that GET API call succeeded."""
    res = _fetch_loan(client, json_headers, loan=loan, user=user)
    assert res.status_code == 200
    data = json.loads(res.data.decode('utf-8'))['metadata']
    assert data[Loan.pid_field] == loan[Loan.pid_field]
    assert data['patron_pid'] == loan['patron_pid']


def test_anonymous_cannot_get_any_loan(client, json_headers, testdata):
    """Test that anonymous cannot get any loan."""
    loan_patron1 = testdata['loans'][0]
    assert loan_patron1['patron_pid'] == "1"
    loan_patron2 = testdata['loans'][3]
    assert loan_patron2['patron_pid'] == "2"

    res = _fetch_loan(client, json_headers, loan=loan_patron1)
    assert res.status_code == 401
    res = _fetch_loan(client, json_headers, loan=loan_patron2)
    assert res.status_code == 401


def test_admin_or_librarian_can_get_any_loan(client, json_headers, users,
                                             testdata):
    """Test that admins and librarians can get any loan."""
    for user in [users['admin'], users['librarian']]:
        # GET loans of Patron 1
        loan_patron1 = testdata['loans'][0]
        assert loan_patron1['patron_pid'] == "1"
        _assert_get_loan_success(client, json_headers, loan=loan_patron1,
                                 user=user)

        # GET loans of Patron 2
        loan_patron2 = testdata['loans'][3]
        assert loan_patron2['patron_pid'] == "2"
        _assert_get_loan_success(client, json_headers, loan=loan_patron2,
                                 user=user)


def test_patron_can_get_only_his_loans(client, json_headers, users, testdata):
    """Test that patrons can get only their loans."""
    patron1 = users['patron1']
    patron2 = users['patron2']

    loan_patron1 = testdata['loans'][0]
    assert loan_patron1['patron_pid'] == "1"

    loan_patron2 = testdata['loans'][3]
    assert loan_patron2['patron_pid'] == "2"

    # Patron 1 GET his loans
    _assert_get_loan_success(client, json_headers, loan=loan_patron1,
                             user=patron1)
    # Patron 1 GET loans of Patron 2
    res = _fetch_loan(client, json_headers, loan=loan_patron2, user=patron1)
    assert res.status_code == 403

    # Patron 2 GET his loans
    _assert_get_loan_success(client, json_headers, loan=loan_patron2,
                             user=patron2)
    # Patron 2 GET loans of Patron 1
    res = _fetch_loan(client, json_headers, loan=loan_patron1, user=patron2)
    assert res.status_code == 403


def _test_post_new_loan(client, json_headers, response_code):
    """Test POST new loan."""
    url = url_for('invenio_records_rest.loanid_list')
    res = client.post(url, headers=json_headers, data=json.dumps(NEW_LOAN))
    assert res.status_code == response_code
    if res.status_code == 201:
        data = json.loads(res.data.decode('utf-8'))['metadata']
        return data[Loan.pid_field]


def _test_patch_existing_loan(client, json_patch_headers, loanid,
                              response_code):
    """Test PATCH existing loan."""
    url = url_for('invenio_records_rest.loanid_item', pid_value=loanid)
    patch = [{
        "op": "replace",
        "path": "/request_expire_date",
        "value": "2019-01-01"
    }]
    res = client.patch(url, headers=json_patch_headers, data=json.dumps(patch))
    assert res.status_code == response_code


def _test_replace_existing_loan(client, json_headers, loanid, response_code):
    """Test PUT existing loan."""
    url = url_for('invenio_records_rest.loanid_item', pid_value=loanid)
    res = client.put(url, headers=json_headers, data=json.dumps(NEW_LOAN))
    assert res.status_code == response_code


def _test_delete_existing_loan(client, json_headers, loanid, response_code):
    """Test DELETE existing loan."""
    url = url_for('invenio_records_rest.loanid_item', pid_value=loanid)
    res = client.delete(url, headers=json_headers)
    assert res.status_code == response_code


def test_anonymous_cannot_update_loans(client, json_headers,
                                       json_patch_headers, testdata):
    """Test that anonymous cannot update loans."""
    loanid = 'loanid-1'
    _test_post_new_loan(client, json_headers, 401)
    _test_patch_existing_loan(client,  json_patch_headers, loanid, 401)
    _test_replace_existing_loan(client, json_headers, loanid, 401)
    _test_delete_existing_loan(client, json_headers, loanid, 401)


def test_admin_or_librarian_can_update_loans(client, json_headers,
                                             json_patch_headers, users,
                                             testdata):
    """Test that librarians and admins can update loans."""
    for user in [users['admin'], users['librarian']]:
        login_user_via_session(client, email=User.query.get(user.id).email)
        loanid = _test_post_new_loan(client, json_headers, 201)
        _test_patch_existing_loan(client, json_patch_headers, loanid, 200)
        _test_replace_existing_loan(client, json_headers, loanid, 200)
        _test_delete_existing_loan(client, json_headers, loanid, 204)


def test_patron_cannot_update_loans(client, json_headers, json_patch_headers,
                                    users, testdata):
    """Test that patrons cannot update loans."""
    user = users['patron1']

    loanid = 'loanid-1'
    login_user_via_session(client, email=User.query.get(user.id).email)
    _test_post_new_loan(client, json_headers, 403)
    _test_patch_existing_loan(client, json_patch_headers, loanid, 403)
    _test_replace_existing_loan(client, json_headers, loanid, 403)
    _test_delete_existing_loan(client, json_headers, loanid, 403)
