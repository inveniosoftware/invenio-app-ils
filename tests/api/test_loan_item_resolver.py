# -*- coding: utf-8 -*-
#
# Copyright (C) 2019 CERN.
#
# Invenio-Circulation is free software; you can redistribute it and/or modify
# it under the terms of the MIT License; see LICENSE file for more details.

"""Tests for loan item resolver."""

from invenio_circulation.api import Loan


def test_loan_item_resolver(app, testdata):
    """Test item resolving from loan."""
    loan_pid = testdata["loans"][1]["pid"]
    loan = Loan.get_record_by_pid(loan_pid)
    loan = loan.replace_refs()
    assert loan["item"]["pid"] == loan["item_pid"]["value"]


def test_loan_item_resolver_for_empty_item_pid(app, testdata):
    """Test item resolving from loan."""
    loan_pid = testdata["loans"][0]["pid"]
    loan = Loan.get_record_by_pid(loan_pid)
    loan = loan.replace_refs()
    assert loan["item"] == dict()
