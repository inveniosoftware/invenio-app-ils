# -*- coding: utf-8 -*-
#
# Copyright (C) 2018-19 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""Test loans item permissions."""

from __future__ import absolute_import, print_function

import json

from flask import url_for
from invenio_accounts.models import User
from invenio_accounts.testutils import login_user_via_session
from invenio_circulation.api import patron_has_active_loan_on_item
from invenio_circulation.search.api import search_by_pid

from invenio_app_ils.records.api import Item

NEW_FORCED_LOAN = {
    "force_checkout": "true",
    "item_pid": "itemid-8",
    "document_pid": "docid-1",
    "patron_pid": "1",
    "transaction_date": "2018-06-29",
    "transaction_location_pid": "locid-1",
    "transaction_user_pid": "4",
    "pickup_location_pid": "locid-1",
    "request_expire_date": "2018-07-28"
}

NEW_UNFORCED_LOAN = {
    "force_checkout": "false",
    "item_pid": "itemid-1",
    "document_pid": "docid-1",
    "patron_pid": "1",
    "transaction_date": "2018-06-29",
    "transaction_location_pid": "locid-1",
    "transaction_user_pid": "4",
    "pickup_location_pid": "locid-1",
    "request_expire_date": "2018-07-28"
}

NEW_LOAN = {
    "force_checkout": "false",
    "item_pid": "itemid-5",
    "document_pid": "docid-1",
    "patron_pid": "1",
    "transaction_date": "2018-06-29",
    "transaction_location_pid": "locid-1",
    "transaction_user_pid": "4",
    "pickup_location_pid": "locid-1",
    "request_expire_date": "2018-07-28"
}


def test_anonymous_cannot_request_loan_on_item(client, json_headers,
                                               testdata):
    """Test that anonymous users cannot request a loan on a item."""
    url = url_for('invenio_app_ils_circulation.loan_create')
    res = client.post(url,
                      headers=json_headers,
                      data=json.dumps(NEW_LOAN))
    assert res.status_code == 401


def test_librarian_can_request_loan_on_item(client, json_headers, users,
                                            testdata):
    """Test that a patron can request a loan on a item."""
    for user in [users['admin'], users['librarian']]:
        login_user_via_session(client, email=User.query.get(user.id).email)
        url = url_for('invenio_app_ils_circulation.loan_create')

        item_exists = True if search_by_pid(
            item_pid=NEW_FORCED_LOAN["item_pid"])\
            .execute().hits.total > 0 else False

        if item_exists and patron_has_active_loan_on_item(
            patron_pid=NEW_FORCED_LOAN["patron_pid"],
                item_pid=NEW_FORCED_LOAN["item_pid"]):
            res = client.post(url, headers=json_headers,
                              data=json.dumps(NEW_LOAN))
            assert res.status_code == 400
        elif item_exists:
            res = client.post(url, headers=json_headers,
                              data=json.dumps(NEW_LOAN))
            assert res.status_code == 202
            loan = json.loads(res.data.decode('utf-8'))['metadata']
            assert loan['state'] == 'ITEM_ON_LOAN'


def test_loan_can_be_created_on_missing_item_by_force(client, json_headers,
                                                      users, testdata):
    """Test that a patron can request a loan on a missing
       item by force checkout."""
    for user in [users['admin'], users['librarian']]:
        login_user_via_session(client, email=User.query.get(user.id).email)
        url = url_for('invenio_app_ils_circulation.loan_create')

        item_exists = True if search_by_pid(
            item_pid=NEW_FORCED_LOAN["item_pid"]) \
            .execute().hits.total > 0 else False

        if item_exists and patron_has_active_loan_on_item(
                patron_pid=NEW_FORCED_LOAN["patron_pid"],
                item_pid=NEW_FORCED_LOAN["item_pid"]):

            res = client.post(url,
                              headers=json_headers,
                              data=json.dumps(NEW_FORCED_LOAN))
            assert res.status_code == 400
            current_item_status = Item.get_record_by_pid(
                NEW_FORCED_LOAN["item_pid"])["status"]
            assert current_item_status == Item.get_record_by_pid(
                NEW_FORCED_LOAN["item_pid"])["status"]
        elif item_exists:
            res = client.post(url,
                              headers=json_headers,
                              data=json.dumps(NEW_FORCED_LOAN))
            assert res.status_code == 202
            loan = json.loads(res.data.decode('utf-8'))['metadata']
            assert loan['state'] == 'ITEM_ON_LOAN'


def test_loan_cannot_be_created_on_missing_item_by_default(client,
                                                           json_headers,
                                                           users,
                                                           testdata):
    """Test that a patron cannot request a loan on a missing
       item without force checkout."""
    for user in [users['admin'], users['librarian']]:
        login_user_via_session(client, email=User.query.get(user.id).email)
        url = url_for('invenio_app_ils_circulation.loan_create')
        res = client.post(url,
                          headers=json_headers,
                          data=json.dumps(NEW_UNFORCED_LOAN))
        assert res.status_code == 400
