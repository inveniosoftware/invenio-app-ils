# -*- coding: utf-8 -*-
#
# Copyright (C) 2019 CERN.
#
# Invenio-Circulation is free software; you can redistribute it and/or modify
# it under the terms of the MIT License; see LICENSE file for more details.

"""Tests for loan item resolver."""
from copy import deepcopy
from json import loads

from invenio_circulation.api import Loan
from invenio_circulation.proxies import current_circulation
from pkg_resources import resource_string

from invenio_app_ils.records.api import Item


def test_loan_item_resolver(app, testdata):
    """Test item resolving from loan."""
    loan_pid = testdata["loans"][0]["loan_pid"]
    loan = Loan.get_record_by_pid(loan_pid)
    loan = loan.replace_refs()
    assert loan["item"]["item_pid"] == loan["item_pid"]
