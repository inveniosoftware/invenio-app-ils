# -*- coding: utf-8 -*-
#
# Copyright (C) 2018-19 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""Test record delete."""
import json

from flask import url_for
from invenio_accounts.models import User
from invenio_accounts.testutils import login_user_via_session
from invenio_circulation.api import Loan
from invenio_circulation.proxies import current_circulation

from invenio_app_ils.errors import IlsException, ItemDocumentNotFoundError, \
    ItemHasActiveLoanError
from invenio_app_ils.records.api import Item


def test_update_item_status(client, users, json_patch_headers,
                            json_headers, testdata, db):
    """Test DELETE existing location."""

    def get_active_loan_pid_and_item_pid():
        loan_search = current_circulation.loan_search
        for t in testdata["items"]:
            if t['status'] == "CAN_CIRCULATE":
                active_loan = loan_search\
                    .get_active_loan_by_item_pid(t[Item.pid_field])\
                    .execute().hits
                if active_loan.total > 0:
                    return t[Item.pid_field], active_loan[0][Loan.pid_field]

    login_user_via_session(
        client,
        email=User.query.get(users["admin"].id).email
    )
    item_pid, loan_pid = get_active_loan_pid_and_item_pid()
    patch_op = [{"op": "replace", "path": "/status", "value": "MISSING"}]
    url = url_for('invenio_records_rest.pitmid_item', pid_value=item_pid)

    res = client.patch(url,
                       headers=json_patch_headers,
                       data=json.dumps(patch_op))

    msg = (
        "Could not update item because it has an active loan with "
        "pid: {loan_pid}."
    ).format(
        loan_pid=loan_pid
    )

    assert res.status_code == ItemHasActiveLoanError.code
    assert res.json['error_class'] == "ItemHasActiveLoanError"
    assert res.json['message'] == msg


def test_update_item_document(client, users, json_patch_headers, json_headers,
                              testdata, db):
    """Test REPLACE document pid on item."""
    login_user_via_session(
        client,
        email=User.query.get(users["admin"].id).email
    )
    patch_op = [{
        "op": "replace", "path": "/document_pid", "value": "not_found_doc"
    }]
    url = url_for('invenio_records_rest.pitmid_item', pid_value="itemid-1")

    res = client.patch(url,
                       headers=json_patch_headers,
                       data=json.dumps(patch_op))

    msg = ("Document PID '{document_pid}' was not found").format(
        document_pid="not_found_doc"
    )

    assert res.status_code == ItemDocumentNotFoundError.code
    assert res.json['error_class'] == "ItemDocumentNotFoundError"
    assert res.json['message'] == msg
