# -*- coding: utf-8 -*-
#
# Copyright (C) 2018-2020 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""Test ILS APIs."""

import pytest
from invenio_accounts.models import User

from invenio_app_ils.api import patron_exists
from invenio_app_ils.documents.api import Document
from invenio_app_ils.records.api import IlsRecord, Series


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
