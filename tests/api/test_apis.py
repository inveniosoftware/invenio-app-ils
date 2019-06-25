# -*- coding: utf-8 -*-
#
# Copyright (C) 2018-2019 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""Test ILS APIs."""

from invenio_app_ils.api import (  # isort:skip
    get_document_pid_by_item_pid,
    get_item_pids_by_document_pid,
    get_location_pid_by_item_pid,
    item_exists,
    patron_exists,
)
from invenio_accounts.models import User

from invenio_app_ils.records.api import Document, Item


def test_get_item_pids_by_document_pid(testdata):
    """Test retrieve Items PIDs for the given Document PID."""
    first_doc_pid = testdata["documents"][0][Document.pid_field]
    items_pids = get_item_pids_by_document_pid(first_doc_pid)
    assert len(list(items_pids)) == 4


def test_get_document_pid_by_item_pid(testdata):
    """Test retrieve Document PID for the given Item."""
    first_item_pid = testdata["items"][0][Item.pid_field]
    doc_pid = get_document_pid_by_item_pid(first_item_pid)
    assert doc_pid == "docid-1"


def test_get_location_pid_by_item_pid(testdata):
    """Test retrieve Location PID for the given Item."""
    first_item_pid = testdata["items"][0][Item.pid_field]
    loc_pid = get_location_pid_by_item_pid(first_item_pid)
    assert loc_pid == "locid-1"


def test_item_exists(testdata):
    """Test return True if item exists."""
    first_item_pid = testdata["items"][0][Item.pid_field]
    assert item_exists(first_item_pid)


def test_circulation_item_not_exist(testdata):
    """Test return False if item does not exist."""
    assert not item_exists("not-existing-item-pid")


def test_patron_exists(users):
    """Test return True if item exists."""
    test_patron = User.query.all()[0]
    assert patron_exists(test_patron.id)
    assert not patron_exists('not-existing-patron-pid')
