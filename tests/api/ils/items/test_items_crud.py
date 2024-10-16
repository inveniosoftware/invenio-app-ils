# -*- coding: utf-8 -*-
#
# Copyright (C) 2021 CERN.
#
# Invenio-Circulation is free software; you can redistribute it and/or modify
# it under the terms of the MIT License; see LICENSE file for more details.

"""Tests items CRUD."""

from copy import deepcopy

import pytest

from invenio_app_ils.circulation.search import get_active_loan_by_item_pid
from invenio_app_ils.errors import (
    DocumentNotFoundError,
    InternalLocationNotFoundError,
    ItemHasPastLoansError,
)
from invenio_app_ils.items.api import ITEM_PID_TYPE, Item


def test_item_create(app, testdata):
    """Test creation of an item."""
    item = Item.create(
        dict(
            pid="itemid-99",
            document_pid="docid-1",
            internal_location_pid="ilocid-4",
            created_by=dict(type="script", value="demo"),
            barcode="cm-348048",
            status="CAN_CIRCULATE",
            circulation_restriction="NO_RESTRICTION",
            medium="PAPER",
        )
    )
    assert "$schema" in item
    assert "document" in item and "$ref" in item["document"]
    assert item["barcode"] == "CM-348048"
    assert "internal_location" in item and "$ref" in item["internal_location"]

    item = Item.get_record_by_pid("itemid-1")
    item = item.replace_refs()
    assert "document" in item and item["document"]["title"]
    assert "internal_location" in item and item["internal_location"]["name"]


def test_item_update(app, db, testdata):
    """Test update of an item."""
    item = Item.get_record_by_pid("itemid-1")
    item.update(dict(barcode="cm-348048"))
    item.commit()
    db.session.commit()

    assert Item.get_record_by_pid("itemid-1")["barcode"] == "CM-348048"


def test_item_validation(db, testdata):
    """Test validation when updating an item."""
    item_pid = testdata["items"][0]["pid"]
    orginal_item = Item.get_record_by_pid(item_pid)

    # change document pid
    item = deepcopy(orginal_item)
    item["document_pid"] = "not_found_doc"
    with pytest.raises(DocumentNotFoundError):
        item.commit()

    # change internal location pid
    item = deepcopy(orginal_item)
    item["internal_location_pid"] = "not_found_pid"
    with pytest.raises(InternalLocationNotFoundError):
        item.commit()


def test_item_references(db, testdata):
    """Test references when updating an item."""

    def get_active_loan_pid_and_item_pid():
        for t in testdata["items"]:
            if t["status"] == "CAN_CIRCULATE":
                item_pid = dict(type=ITEM_PID_TYPE, value=t["pid"])
                active_loan = get_active_loan_by_item_pid(item_pid).execute().hits
                total = active_loan.total.value
                if total > 0:
                    return t["pid"], active_loan[0]["pid"]

    # change document pid while is on loan
    item_pid, loan_pid = get_active_loan_pid_and_item_pid()
    item = Item.get_record_by_pid(item_pid)
    item["document_pid"] = "docid-1"
    with pytest.raises(ItemHasPastLoansError):
        item.commit()

    # change document to one that does not exist
    item = Item.get_record_by_pid("itemid-1")
    item["document_pid"] = "not_found_doc"
    with pytest.raises(DocumentNotFoundError):
        item.commit()
