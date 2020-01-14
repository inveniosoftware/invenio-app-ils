# -*- coding: utf-8 -*-
#
# Copyright (C) 2018-2020 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""Test ILS APIs."""

import pytest
from invenio_accounts.models import User

from invenio_app_ils.api import get_document_pid_by_item_pid, \
    get_item_pids_by_document_pid, get_location_pid_by_item_pid, item_exists, \
    patron_exists
from invenio_app_ils.documents.api import Document
from invenio_app_ils.pidstore.pids import ITEM_PID_TYPE
from invenio_app_ils.records.api import IlsRecord, Series


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


def test_get_location_pid_by_item_pid(testdata):
    """Test retrieve Location PID for the given Item."""
    first_item_pid = testdata["items"][0]["pid"]
    item_pid = dict(type=ITEM_PID_TYPE, value=first_item_pid)
    loc_pid = get_location_pid_by_item_pid(item_pid)
    assert loc_pid == "locid-1"


def test_item_exists(testdata):
    """Test return True if item exists."""
    first_item_pid = testdata["items"][0]["pid"]
    item_pid = dict(type=ITEM_PID_TYPE, value=first_item_pid)
    assert item_exists(item_pid)


def test_circulation_item_not_exist(testdata):
    """Test return False if item does not exist."""
    item_pid = dict(type=ITEM_PID_TYPE, value="not-existing-item-pid")
    assert not item_exists(item_pid)


def test_patron_exists(users):
    """Test return True if item exists."""
    test_patron = User.query.all()[0]
    assert patron_exists(test_patron.id)
    assert not patron_exists('not-existing-patron-pid')


@pytest.mark.parametrize(
    "pid, cls",
    [
        ('docid-1', Document),
        ('serid-1', Series),
    ]
)
def test_get_record_by_pid(testdata, pid, cls):
    """Test get_record_by_pid."""
    record = cls.get_record_by_pid(pid)

    assert isinstance(record, cls)
    assert record["pid"] == pid
    assert record._pid_type == cls._pid_type


@pytest.mark.parametrize(
    "pid, pid_type, expected_cls",
    [
        ('docid-1', 'docid', Document),
        ('serid-1', 'serid', Series),
    ]
)
def test_get_record_by_pid_and_pid_type(testdata, pid, pid_type, expected_cls):
    """Test get_record_by_pid with pid_type."""
    record = IlsRecord.get_record_by_pid(pid, pid_type=pid_type)

    assert isinstance(record, expected_cls)
    assert record["pid"] == pid
    assert record._pid_type == pid_type
