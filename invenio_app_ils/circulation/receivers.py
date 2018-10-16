# -*- coding: utf-8 -*-
#
# Copyright (C) 2018 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""Circulation receivers."""

from __future__ import absolute_import, print_function

from invenio_circulation.signals import loan_state_changed
from invenio_indexer.api import RecordIndexer

from ..records.api import Item


def register_circulation_signals(app):
    """Register Circulation signal."""
    loan_state_changed.connect(index_item_after_loan_change,
                               sender=app, weak=False)


def index_item_after_loan_change(_, loan):
    """Reindex item when attached loan changes."""
    item_pid = loan.get(Item.pid_field)
    if item_pid:
        item = Item.get_record_by_pid(item_pid)
        RecordIndexer().index(item)
