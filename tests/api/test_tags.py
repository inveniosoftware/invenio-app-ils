# -*- coding: utf-8 -*-
#
# Copyright (C) 2019 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""Test document tags."""

from __future__ import unicode_literals

import pytest

from invenio_app_ils.errors import DocumentTagNotFoundError
from invenio_app_ils.records.api import Document, Tag


def test_document_add_tags(app, testdata):
    """Test adding new tags to document record."""
    document_pid = testdata["documents"][0]["pid"]
    tag_data = testdata["tags"]
    tags = [
        Tag.get_record_by_pid(kw["pid"])
        for kw in tag_data
    ]
    document = Document.get_record_by_pid(document_pid)

    assert len(document["tag_pids"]) == 0

    for i, tag in enumerate(tags):
        document.add_tag(tag)

        doc_name = document.replace_refs()["tags"][i]["name"]
        assert doc_name == tag_data[i]["name"]

    assert len(document["tag_pids"]) == len(tags)

    # Shouldnt' add more tags
    for tag in tags:
        document.add_tag(tag)

    assert len(document["tag_pids"]) == len(tags)


def test_document_remove_tag(app, testdata):
    """Test removing tags from document record."""
    document_pid = testdata["documents"][0]["pid"]
    tags = [
        Tag.get_record_by_pid(kw["pid"])
        for kw in testdata["tags"]
    ]
    document = Document.get_record_by_pid(document_pid)

    for tag in tags:
        with pytest.raises(DocumentTagNotFoundError):
            assert not document.remove_tag(tag)

    assert len(document["tag_pids"]) == 0
    for tag in tags:
        document.add_tag(tag)
    assert len(document["tag_pids"]) == len(tags)

    assert document.remove_tag(tags[1])
    assert len(document["tag_pids"]) == len(tags) - 1

    # repeat
    with pytest.raises(DocumentTagNotFoundError):
        document.remove_tag(tags[1])
    assert len(document["tag_pids"]) == len(tags) - 1

    assert document.remove_tag(tags[0])
    assert len(document["tag_pids"]) == len(tags) - 2
