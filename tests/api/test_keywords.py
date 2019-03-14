# -*- coding: utf-8 -*-
#
# Copyright (C) 2019 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""Test document keywords."""

from __future__ import unicode_literals

import pytest

from invenio_app_ils.errors import DocumentKeywordNotFoundError
from invenio_app_ils.records.api import Document, Keyword


def test_document_add_keywords(app, testdata):
    """Test adding new keywords to document record."""
    document_pid = testdata["documents"][0]["document_pid"]
    keyword_data = testdata["keywords"]
    keywords = [
        Keyword.get_record_by_pid(kw["keyword_pid"])
        for kw in keyword_data
    ]
    document = Document.get_record_by_pid(document_pid)

    assert len(document["keyword_pids"]) == 0

    for i, keyword in enumerate(keywords):
        document.add_keyword(keyword)

        doc_name = document.replace_refs()["keywords"][i]["name"]
        assert doc_name == keyword_data[i]["name"]

    assert len(document["keyword_pids"]) == len(keywords)

    # Shouldnt' add more keywords
    for keyword in keywords:
        document.add_keyword(keyword)

    assert len(document["keyword_pids"]) == len(keywords)


def test_document_remove_keyword(app, testdata):
    """Test removing keywords from document record."""
    document_pid = testdata["documents"][0]["document_pid"]
    keywords = [
        Keyword.get_record_by_pid(kw["keyword_pid"])
        for kw in testdata["keywords"]
    ]
    document = Document.get_record_by_pid(document_pid)

    for keyword in keywords:
        with pytest.raises(DocumentKeywordNotFoundError):
            assert not document.remove_keyword(keyword)

    assert len(document["keyword_pids"]) == 0
    for keyword in keywords:
        document.add_keyword(keyword)
    assert len(document["keyword_pids"]) == len(keywords)

    assert document.remove_keyword(keywords[1])
    assert len(document["keyword_pids"]) == len(keywords) - 1

    # repeat
    with pytest.raises(DocumentKeywordNotFoundError):
        document.remove_keyword(keywords[1])
    assert len(document["keyword_pids"]) == len(keywords) - 1

    assert document.remove_keyword(keywords[0])
    assert len(document["keyword_pids"]) == len(keywords) - 2
