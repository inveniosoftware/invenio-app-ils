# -*- coding: utf-8 -*-
#
# Copyright (C) 2019 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""Circulation item resolving endpoint."""

from invenio_circulation.api import Loan

from ..api import Item
from .resolver import get_field_value_for_record as get_field_value


def item_resolver(loan_pid):
    """Resolve an Item given a Loan PID."""
    item_pid = get_field_value(Loan, loan_pid, Item.pid_field)
    item = Item.get_record_by_pid(item_pid)
    # remove `Document` and `circulation_status` fields to avoid circular deps.
    del item["$schema"]
    del item["circulation_status"]
    del item["document"]
    return item
