# -*- coding: utf-8 -*-
#
# Copyright (C) 2019 CERN.
#
# Invenio-Circulation is free software; you can redistribute it and/or modify
# it under the terms of the MIT License; see LICENSE file for more details.

"""Tests for document resolvers."""

from invenio_app_ils.documents.api import Document


def test_document_resolvers(app, testdata):
    """Test item resolving from loan."""
    doc_pid = testdata["documents"][0]["pid"]
    document = Document.get_record_by_pid(doc_pid)
    document = document.replace_refs()

    # relations
    assert "relations" in document

    # circulation
    assert "active_loans_count" in document["circulation"]
    assert "pending_loans_count" in document["circulation"]
    assert "overdue_loans_count" in document["circulation"]
    assert "past_loans_count" in document["circulation"]

    # item and eitems
    assert document["items"]["total"] == 9 and document["items"]["hits"]
    assert document["eitems"]["total"] == 3 and document["eitems"]["hits"]

    # stock
    mediums = set([item["medium"] for item in document["items"]["hits"]])
    mediums.add("E-BOOK")
    assert set(document["stock"]["mediums"]) == mediums
