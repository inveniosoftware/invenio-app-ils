# -*- coding: utf-8 -*-
#
# Copyright (C) 2018 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""Test loans list permissions."""

from __future__ import absolute_import, print_function

import json

import pytest
from flask import url_for
from invenio_accounts.models import User
from invenio_accounts.testutils import login_user_via_session

from invenio_app_ils.circulation.search import IlsLoansSearch, \
    circulation_search_factory
from invenio_app_ils.errors import UnauthorizedSearchError

NEW_LOAN = {
    "item_pid": "200",
    "patron_pid": "1",
    "transaction_date": "2018-06-29",
    "transaction_location_pid": "locid-1",
    "transaction_user_pid": "4",
    "pickup_location_pid": "locid-1",
    "request_expire_date": "2018-07-28"
}


def _search_loans(client, json_headers, user=None, **kwargs):
    """Return the loan fetched with a REST call."""
    if user:
        login_user_via_session(client, email=User.query.get(user.id).email)
    url = url_for('invenio_records_rest.loanid_list', **kwargs)
    return client.get(url, headers=json_headers)


def test_anonymous_cannot_search_any_loan(client, json_headers):
    """Test that anonymous cannot search any loan in search results."""
    res = _search_loans(client, json_headers)
    assert res.status_code == 401


def test_admin_or_librarian_can_search_any_loan(client, json_headers, users,
                                                testdata):
    """Test that admins and librarians can search any loan."""
    for user in [users['admin'], users['librarian']]:
        res = _search_loans(client, json_headers, user=user)
        assert res.status_code == 200
        hits = json.loads(res.data.decode('utf-8'))
        assert len(hits['hits']['hits']) == len(testdata['loans'])


def test_anonymous_loans_search(app):
    """Test that not logged in users are unable to search."""
    with app.test_request_context("/"):
        with pytest.raises(UnauthorizedSearchError):
            circulation_search_factory(None, IlsLoansSearch())


def test_patrons_can_search_their_own_loans(client, json_headers, users,
                                            testdata):
    """Test that patrons can search their own loans."""
    def _validate_only_patron_loans(res, user, state):
        """Assert that result loans belong to the given user only."""
        patron_loans = [
            l for l in testdata['loans']
            if l['patron_pid'] == str(user.id) and l['state'] == state
        ]

        assert res.status_code == 200
        hits = json.loads(res.data.decode('utf-8'))
        assert len(hits['hits']['hits']) == len(patron_loans)
        for hit in hits['hits']['hits']:
            assert hit['metadata']['patron_pid'] == str(user.id)

    state = 'PENDING'
    for user in [users['patron1'], users['patron2']]:
        # search with no params
        res = _search_loans(client, json_headers, user=user,
                            state=state)
        _validate_only_patron_loans(res, user, state)

        # search with params
        res = _search_loans(client, json_headers, user=user,
                            state=state,  # test extra query
                            q="patron_pid:{}".format(str(user.id)))
        _validate_only_patron_loans(res, user, state)


def test_patrons_cannot_search_other_loans(client, json_headers, users,
                                           testdata):
    """Test that patrons cannot search for loans of other patrons."""
    res = _search_loans(client, json_headers, user=users['patron1'],
                        state='PENDING',  # test extra query
                        q="patron_pid:{}".format(str(users['patron2'].id)))
    assert res.status_code == 403
