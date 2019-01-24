# -*- coding: utf-8 -*-
#
# Copyright (C) 2018 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""Circulation receivers."""

from __future__ import absolute_import, print_function

from invenio_circulation.signals import loan_replace_item, loan_state_changed

from ..proxies import current_app_ils_extension
from ..records.api import Document, Item


def register_circulation_signals(app):
    """Register Circulation signal."""
    loan_state_changed.connect(
        index_record_after_loan_change, sender=app, weak=False
    )
    loan_replace_item.connect(
        index_after_loan_replace_item, sender=app, weak=False
    )


def index_after_loan_replace_item(_, old_item_pid, new_item_pid):
    """Register Circulation signal to index item."""
    if old_item_pid:
        item = Item.get_record_by_pid(old_item_pid)
        current_app_ils_extension.item_indexer.index(item)

    if new_item_pid:
        item = Item.get_record_by_pid(new_item_pid)
        current_app_ils_extension.item_indexer.index(item)


def index_record_after_loan_change(_, loan):
    """Reindex item when attached loan changes."""
    current_app_ils_extension.loan_indexer.index(loan)
