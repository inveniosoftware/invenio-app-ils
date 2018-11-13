# -*- coding: utf-8 -*-
#
# Copyright (C) 2018 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""Test circulation utils."""

from invenio_app_ils.circulation.utils import (  # isort:skip
    circulation_document_retriever,
    circulation_item_exists,
    circulation_item_location_retriever,
    circulation_items_retriever,
)
from invenio_app_ils.records.api import Document, Item


def test_circulation_items_retriever(testdata):
    """Test retrieve Items PIDs for the given Document."""
    first_doc_pid = testdata["documents"][0][Document.pid_field]
    items_pids = circulation_items_retriever(first_doc_pid)
    assert len(list(items_pids)) == 2


def test_circulation_document_retriever(testdata):
    """Test retrieve Document PID for the given Item."""
    first_item_pid = testdata["items"][0][Item.pid_field]
    doc_pid = circulation_document_retriever(first_item_pid)
    assert doc_pid == "docid-1"


def test_circulation_item_location_retriever(testdata):
    """Test retrieve Location PID for the given Item."""
    first_item_pid = testdata["items"][0][Item.pid_field]
    loc_pid = circulation_item_location_retriever(first_item_pid)
    assert loc_pid == "locid-1"


def test_circulation_item_exists(testdata):
    """Test return True if item exists."""
    first_item_pid = testdata["items"][0][Item.pid_field]
    assert circulation_item_exists(first_item_pid)


def test_circulation_item_not_exist(testdata):
    """Test return False if item does not exist."""
    assert not circulation_item_exists("not-existing-item-pid")
