# -*- coding: utf-8 -*-
#
# Copyright (C) 2020 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""Test loans default durations."""

from __future__ import absolute_import, print_function

from datetime import timedelta

import pytest

from invenio_app_ils.ill.api import circulation_default_extension_duration, \
    circulation_default_loan_duration

FAKE_LOAN_ITEM_NO_RESTRICTIONS = {
    "item_pid": {"type": "pitmid", "value": "itemid-1"}
}
FAKE_LOAN_ITEM_ONE_WEEK = {"item_pid": {"type": "pitmid", "value": "itemid-2"}}
FAKE_LOAN_ITEM_TWO_WEEKS = {
    "item_pid": {"type": "pitmid", "value": "itemid-3"}
}
FAKE_LOAN_ITEM_THREE_WEEKS = {
    "item_pid": {"type": "pitmid", "value": "itemid-4"}
}
FAKE_LOAN_ITEM_FOUR_WEEKS = {
    "item_pid": {"type": "pitmid", "value": "itemid-5"}
}


@pytest.mark.parametrize(
    "duration_func",
    [
        circulation_default_loan_duration,
        circulation_default_extension_duration,
    ],
)
def test_loans_default_durations(testdata, duration_func):
    """Test loans default durations."""
    assert duration_func(FAKE_LOAN_ITEM_NO_RESTRICTIONS, None) == timedelta(
        weeks=4
    )
    assert duration_func(FAKE_LOAN_ITEM_ONE_WEEK, None) == timedelta(weeks=1)
    assert duration_func(FAKE_LOAN_ITEM_TWO_WEEKS, None) == timedelta(weeks=2)
    assert duration_func(FAKE_LOAN_ITEM_THREE_WEEKS, None) == timedelta(
        weeks=3
    )
    assert duration_func(FAKE_LOAN_ITEM_FOUR_WEEKS, None) == timedelta(weeks=4)
