# -*- coding: utf-8 -*-
#
# Copyright (C) 2018-19 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""Test record delete."""

import pytest
from elasticsearch import VERSION as ES_VERSION
from invenio_accounts.models import User
from invenio_accounts.testutils import login_user_via_session
from invenio_circulation.proxies import current_circulation

from invenio_app_ils.errors import ItemDocumentNotFoundError, \
    ItemHasActiveLoanError
from invenio_app_ils.records.api import Item

lt_es7 = ES_VERSION[0] < 7


def test_update_item_status(client, users, json_headers, testdata, db):
    """Test update item status."""
    def get_active_loan_pid_and_item_pid():
        loan_search = current_circulation.loan_search
        for t in testdata["items"]:
            if t["status"] == "CAN_CIRCULATE":
                active_loan = (
                    loan_search.get_active_loan_by_item_pid(t["pid"])
                    .execute()
                    .hits
                )
                total = (
                    active_loan.total if lt_es7 else active_loan.total.value
                )
                if total > 0:
                    return t["pid"], active_loan[0]["pid"]

    login_user_via_session(
        client, email=User.query.get(users["admin"].id).email
    )
    item_pid, loan_pid = get_active_loan_pid_and_item_pid()
    item = Item.get_record_by_pid(item_pid)
    with pytest.raises(ItemHasActiveLoanError):
        item.commit()


def test_update_item_document(client, users, json_headers, testdata, db):
    """Test REPLACE document pid on item."""
    login_user_via_session(
        client, email=User.query.get(users["admin"].id).email
    )
    item = Item.get_record_by_pid("itemid-1")
    item["document_pid"] = "not_found_doc"
    with pytest.raises(ItemDocumentNotFoundError):
        item.commit()
