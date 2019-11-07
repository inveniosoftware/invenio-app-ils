# -*- coding: utf-8 -*-
#
# Copyright (C) 2019 CERN.
#
# Invenio-Circulation is free software; you can redistribute it and/or modify
# it under the terms of the MIT License; see LICENSE file for more details.

"""Tests for loan item resolver."""

from invenio_app_ils.api import Document


def test_document_items_resolver(app, testdata):
    """Test item resolving from loan."""
    doc_pid = testdata["documents"][1]["pid"]
    document = Document.get_record_by_pid(doc_pid)
    document = document.replace_refs()
    item_pid = testdata["items"][2]["pid"]
    assert document["items"]["hits"][0]["pid"] == item_pid


def test_document_stock_resolver(app, testdata):
    """Test item resolving from loan."""
    doc_pid = testdata["documents"][1]["pid"]
    item = testdata["items"][2]
    document = Document.get_record_by_pid(doc_pid)
    document = document.replace_refs()
    assert item["medium"] in document["stock"]["mediums"]
