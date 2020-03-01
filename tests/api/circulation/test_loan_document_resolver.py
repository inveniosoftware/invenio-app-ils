# -*- coding: utf-8 -*-
#
# Copyright (C) 2019 CERN.
#
# Invenio-Circulation is free software; you can redistribute it and/or modify
# it under the terms of the MIT License; see LICENSE file for more details.

"""Tests for loan item resolver."""

from invenio_circulation.api import Loan


def test_loan_document_resolver(app, testdata):
    """Test item resolving from loan."""
    loan_pid = testdata["loans"][1]["pid"]
    loan = Loan.get_record_by_pid(loan_pid)
    loan = loan.replace_refs()
    assert loan["document"]["pid"] == loan["document_pid"]
