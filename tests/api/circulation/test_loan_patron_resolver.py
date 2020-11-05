# -*- coding: utf-8 -*-
#
# Copyright (C) 2019-2020 CERN.
#
# Invenio-Circulation is free software; you can redistribute it and/or modify
# it under the terms of the MIT License; see LICENSE file for more details.

"""Tests for loan patron resolver."""

from invenio_circulation.api import Loan


def test_loan_patron_resolver(app, testdata):
    """Test item resolving from loan."""
    loan_pid = testdata["loans"][0]["pid"]
    loan = Loan.get_record_by_pid(loan_pid)
    loan = loan.replace_refs()
    assert loan["patron_pid"] == loan["patron"]["id"]


def test_loan_patron_resolver_for_non_existing_patron_pid(app, testdata):
    """Test item resolving from loan."""
    AnonymousPatron = app.config["ILS_PATRON_ANONYMOUS_CLASS"]
    loan_pid = testdata["loans"][6]["pid"]
    loan = Loan.get_record_by_pid(loan_pid)
    loan = loan.replace_refs()
    assert loan["patron_pid"] == str(20)
    assert loan["patron"]["id"] == str(AnonymousPatron.id)
    assert loan["patron"]["name"] == "anonymous"


def test_loan_patron_resolver_for_anonymous_patron_pid(app, testdata):
    """Test item resolving from loan."""
    loan_pid = testdata["loans"][7]["pid"]
    loan = Loan.get_record_by_pid(loan_pid)
    loan = loan.replace_refs()
    assert loan["patron_pid"] == loan["patron"]["id"]
    assert loan["patron"]["name"] == "anonymous"
