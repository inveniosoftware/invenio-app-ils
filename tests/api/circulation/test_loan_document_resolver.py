# SPDX-FileCopyrightText: 2019 CERN.
# SPDX-License-Identifier: MIT

"""Tests for loan item resolver."""

from invenio_circulation.api import Loan


def test_loan_document_resolver(app, testdata):
    """Test item resolving from loan."""
    loan_pid = testdata["loans"][1]["pid"]
    loan = Loan.get_record_by_pid(loan_pid)
    loan = loan.replace_refs()
    assert loan["document"]["pid"] == loan["document_pid"]
