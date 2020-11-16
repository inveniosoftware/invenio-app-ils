# -*- coding: utf-8 -*-
#
# Copyright (C) 2020 CERN.
#
# Invenio-Circulation is free software; you can redistribute it and/or modify
# it under the terms of the MIT License; see LICENSE file for more details.

"""Tests documents CRUD."""

from invenio_app_ils.documents.api import Document


def _assert_extra_fields(doc):
    """Test that extra fields are automatically added."""
    assert "$schema" in doc
    assert "circulation" in doc and "$ref" in doc["circulation"]
    assert "relations" in doc and "$ref" in doc["relations"]
    assert "eitems" in doc and "$ref" in doc["eitems"]
    assert "items" in doc and "$ref" in doc["items"]
    assert "stock" in doc and "$ref" in doc["stock"]


def test_document_creation_refs(app):
    """Test creation of a document."""
    d = dict(
        pid="a1bc",
        created_by={"type": "script", "value": "demo"},
        title="Test title",
        authors=[dict(full_name="John Doe")],
        publication_year="2010",
        document_type="BOOK",
    )
    doc = Document.create(d)

    _assert_extra_fields(doc)


def test_document_update_refs(app):
    """Test update of a document."""
    d = dict(
        pid="a1bc",
        title="Test title",
        created_by={"type": "script", "value": "demo"},
        authors=[dict(full_name="John Doe")],
        publication_year="2010",
        document_type="BOOK",
    )
    doc = Document.create(d)
    del doc["circulation"]
    del doc["relations"]
    del doc["eitems"]
    del doc["items"]
    del doc["stock"]
    doc.update(dict(title="Test title 2"))

    _assert_extra_fields(doc)
    assert doc["title"] == "Test title 2"
