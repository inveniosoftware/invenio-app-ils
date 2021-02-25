# -*- coding: utf-8 -*-
#
# Copyright (C) 2021 CERN.
#
# Invenio-Circulation is free software; you can redistribute it and/or modify
# it under the terms of the MIT License; see LICENSE file for more details.

"""Tests items CRUD."""

from copy import deepcopy

import pytest

from invenio_app_ils.errors import (
    DocumentNotFoundError,
    InternalLocationNotFoundError,
)
from invenio_app_ils.items.api import Item


def test_item_refs(app, testdata):
    """Test creation of an item."""
    item = Item.create(
        dict(
            pid="itemid-99",
            document_pid="docid-1",
            internal_location_pid="ilocid-4",
            created_by=dict(type="script", value="demo"),
            barcode="348048",
            status="CAN_CIRCULATE",
            circulation_restriction="NO_RESTRICTION",
            medium="PAPER",
        )
    )
    assert "$schema" in item
    assert "document" in item and "$ref" in item["document"]
    assert "internal_location" in item and "$ref" in item["internal_location"]

    item = Item.get_record_by_pid("itemid-1")
    item = item.replace_refs()
    assert "document" in item and item["document"]["title"]
    assert "internal_location" in item and item["internal_location"]["name"]


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
