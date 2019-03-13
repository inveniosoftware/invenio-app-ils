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

from invenio_app_ils.errors import PatronHasLoanOnItemError

NEW_LOAN = {
    "item_pid": "itemid-10",
    "document_pid": "docid-1",
    "patron_pid": "1",
    "transaction_date": "2018-06-29",
    "transaction_location_pid": "locid-1",
    "transaction_user_pid": "4",
    "pickup_location_pid": "locid-1",
    "request_expire_date": "2018-07-28"
}


def test_anonymous_cannot_request_loan_on_item(client, json_headers, testdata):
    """Test that anonymous users cannot request a loan on a item."""
    url = url_for('invenio_app_ils_circulation.loan_request')
    res = client.post(url, headers=json_headers, data=json.dumps(NEW_LOAN))
    assert res.status_code == 401


def test_patron_can_request_loan_on_item(client, json_headers, users,
                                         testdata):
    """Test that a patron can request a loan on a item."""
    user = users['patron1']
    login_user_via_session(client, email=User.query.get(user.id).email)
    url = url_for('invenio_app_ils_circulation.loan_request')
    res = client.post(url, headers=json_headers, data=json.dumps(NEW_LOAN))
    assert res.status_code == 202
    loan = json.loads(res.data.decode('utf-8'))['metadata']
    assert loan['state'] == 'PENDING'


def test_patron_cannot_request_loan_on_already_loaned_item(client,
                                                           json_headers,
                                                           users,
                                                           testdata):
    """Test that a patron can request a loan on a item."""
    def _get_duplicated(user_id):
        """Return an item PID of an existing loan for the given user."""
        for t in testdata['loans']:
            if t['patron_pid'] == user_id:
                return t['item_pid']

    user = users['patron1']
    login_user_via_session(client, email=User.query.get(user.id).email)
    url = url_for('invenio_app_ils_circulation.loan_request')

    duplicated_loan = dict(NEW_LOAN)
    duplicated_loan['item_pid'] = _get_duplicated(str(user.id))

    res = client.post(url, headers=json_headers,
                      data=json.dumps(duplicated_loan))
    assert res.status_code == PatronHasLoanOnItemError.code
