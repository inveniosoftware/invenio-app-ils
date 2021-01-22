# -*- coding: utf-8 -*-
#
# Copyright (C) 2020 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""Test Items APIs."""

from invenio_app_ils.items.api import (
    ITEM_PID_TYPE,
    get_document_pid_by_item_pid,
    get_item_pids_by_document_pid,
    item_exists,
)


def test_get_item_pids_by_document_pid(testdata):
    """Test retrieve Items PIDs for the given Document PID."""
    first_doc_pid = testdata["documents"][0]["pid"]
    items_pids = get_item_pids_by_document_pid(first_doc_pid)
    assert len(list(items_pids)) == 9


def test_get_document_pid_by_item_pid(testdata):
    """Test retrieve Document PID for the given Item."""
    first_item_pid = testdata["items"][0]["pid"]
    item_pid = dict(type=ITEM_PID_TYPE, value=first_item_pid)
    doc_pid = get_document_pid_by_item_pid(item_pid)
    assert doc_pid == "docid-1"


def test_item_exists(testdata):
    """Test return True if item exists."""
    first_item_pid = testdata["items"][0]["pid"]
    item_pid = dict(type=ITEM_PID_TYPE, value=first_item_pid)
    assert item_exists(item_pid)


def test_item_not_exist(testdata):
    """Test return False if item does not exist."""
    item_pid = dict(type=ITEM_PID_TYPE, value="not-existing-item-pid")
    assert not item_exists(item_pid)
