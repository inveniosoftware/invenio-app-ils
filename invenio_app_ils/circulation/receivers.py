# -*- coding: utf-8 -*-
#
# Copyright (C) 2018-2020 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""Circulation receivers."""

from invenio_circulation.proxies import current_circulation
from invenio_circulation.signals import loan_replace_item, loan_state_changed

from invenio_app_ils.circulation.mail.tasks import send_loan_mail
from invenio_app_ils.circulation.utils import resolve_item_from_loan
from invenio_app_ils.ill.api import BORROWING_REQUEST_PID_TYPE
from invenio_app_ils.ill.proxies import current_ils_ill
from invenio_app_ils.indexer import wait_es_refresh
from invenio_app_ils.items.api import ITEM_PID_TYPE
from invenio_app_ils.proxies import current_app_ils


def register_circulation_signals():
    """Register Circulation signal."""
    loan_state_changed.connect(send_email_after_loan_change, weak=False)
    loan_replace_item.connect(index_after_loan_replace_item, weak=False)


def index_after_loan_replace_item(_, old_item_pid, new_item_pid):
    """Register Circulation signal to index item."""
    loan_index = current_circulation.loan_search_cls.Meta.index
    # When indexing items, the `circulation` field will perform a search on
    # loans index. Wait for the loan index to be refreshed.
    wait_es_refresh(loan_index)

    if old_item_pid:
        rec = resolve_item_from_loan(old_item_pid)
        indexer = None
        if old_item_pid["type"] == ITEM_PID_TYPE:
            indexer = current_app_ils.item_indexer
        elif old_item_pid["type"] == BORROWING_REQUEST_PID_TYPE:
            indexer = current_ils_ill.borrowing_request_indexer_cls()
        indexer.index(rec)

    if new_item_pid:
        rec = resolve_item_from_loan(new_item_pid)
        indexer = None
        if new_item_pid["type"] == ITEM_PID_TYPE:
            indexer = current_app_ils.item_indexer
        elif new_item_pid["type"] == BORROWING_REQUEST_PID_TYPE:
            indexer = current_ils_ill.borrowing_request_indexer_cls()
        indexer.index(rec)


def send_email_after_loan_change(_, initial_loan, loan, trigger):
    """Send email notification when the loan changes."""
    send_loan_mail(
        action=trigger, loan=loan, message_ctx=dict(initial_loan=initial_loan)
    )
