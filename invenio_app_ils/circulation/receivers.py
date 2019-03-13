# -*- coding: utf-8 -*-
#
# Copyright (C) 2018 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""Circulation receivers."""

from __future__ import absolute_import, print_function

from flask import current_app
from invenio_circulation.signals import loan_replace_item, loan_state_changed

from invenio_app_ils.circulation.mail.factory import loan_message_factory
from invenio_app_ils.circulation.mail.tasks import send_ils_mail
from invenio_app_ils.errors import MissingRequiredParameterError, \
    PatronNotFoundError
from invenio_app_ils.proxies import current_app_ils_extension
from invenio_app_ils.records.api import Item


def register_circulation_signals():
    """Register Circulation signal."""
    loan_state_changed.connect(
        index_record_after_loan_change, weak=False
    )
    loan_state_changed.connect(
        send_email_after_loan_change, weak=False
    )
    loan_replace_item.connect(
        index_after_loan_replace_item, weak=False
    )


def index_after_loan_replace_item(_, old_item_pid, new_item_pid):
    """Register Circulation signal to index item."""
    if old_item_pid:
        item = Item.get_record_by_pid(old_item_pid)
        current_app_ils_extension.item_indexer.index(item)

    if new_item_pid:
        item = Item.get_record_by_pid(new_item_pid)
        current_app_ils_extension.item_indexer.index(item)


def index_record_after_loan_change(_, loan, prev_loan=None, trigger=None):
    """Reindex item when attached loan changes."""
    current_app_ils_extension.loan_indexer.index(loan)


def send_email_after_loan_change(_, prev_loan, loan, trigger):
    """Send email notification when the loan changes."""
    _datastore = current_app.extensions["security"].datastore

    patron_pid = loan["patron_pid"]
    patron = _datastore.get_user(patron_pid)

    if not patron:
        raise PatronNotFoundError(patron_pid)
    if not patron.email:
        msg = "Patron with PID {} has no email address".format(patron_pid)
        raise MissingRequiredParameterError(description=msg)

    send_ils_mail(
        loan_message_factory(),
        prev_loan, loan, trigger,
        recipients=[patron.email]
    )
