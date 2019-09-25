# -*- coding: utf-8 -*-
#
# Copyright (C) 2019 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""Circulation item resolving endpoint."""

from invenio_circulation.api import Loan
from invenio_pidstore.errors import PIDDeletedError

from ...errors import PatronNotFoundError
from ..api import Item, Patron
from .resolver import get_field_value_for_record as get_field_value


def item_resolver(loan_pid):
    """Resolve an Item given a Loan PID."""
    try:
        item_pid = get_field_value(Loan, loan_pid, "item_pid")
    except KeyError:
        return {}
    try:
        item = Item.get_record_by_pid(item_pid)
        # remove `Document` and `circulation` fields
        # to avoid circular deps.
        del item["$schema"]
        del item["circulation"]
        del item["document"]
    except PIDDeletedError:
        item = {}
    return item


def patron_resolver(loan_pid):
    """Resolve a Patron given a Loan PID."""
    try:
        patron_pid = get_field_value(Loan, loan_pid, "patron_pid")
    except KeyError:
        return {}

    try:
        p = Patron.get_patron(patron_pid)
        patron = p.dumps()
        patron.pop("$schema", None)
    except PatronNotFoundError:
        patron = {}
    return patron
