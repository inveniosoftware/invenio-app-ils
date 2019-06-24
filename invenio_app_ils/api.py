# -*- coding: utf-8 -*-
#
# Copyright (C) 2019 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""ILS APIs."""

from __future__ import absolute_import, print_function

from invenio_accounts.models import User
from invenio_pidstore.errors import PersistentIdentifierError

from .records.api import Document, Item, Location
from .search.api import ItemSearch


def get_item_pids_by_document_pid(document_pid):
    """Retrieve Items PIDs given a Document PID."""
    search = ItemSearch().search_by_document_pid(document_pid)
    for item in search.scan():
        yield item["item_pid"]


def can_item_circulate(item_pid):
    """Return True if Item can circulate."""
    item = Item.get_record_by_pid(item_pid)
    if item:
        return item["status"] == "CAN_CIRCULATE"
    return False


def get_document_pid_by_item_pid(item_pid):
    """Retrieve the Document PID of the given Item PID."""
    return Item.get_document_pid(item_pid)


def get_location_pid_by_item_pid(item_pid):
    """Retrieve Location PID given an Item PID."""
    item_rec = Item.get_record_by_pid(item_pid)
    item = item_rec.replace_refs()
    return item["internal_location"]["location"][Location.pid_field]


def item_exists(item_pid):
    """Return True if the Item exists given a PID."""
    try:
        Item.get_record_by_pid(item_pid)
    except PersistentIdentifierError as ex:
        return False
    return True


def document_exists(document_pid):
    """Return True if the Document exists given a PID."""
    try:
        Document.get_record_by_pid(document_pid)
    except PersistentIdentifierError as ex:
        return False
    return True


def patron_exists(patron_pid):
    """Return True if the Patron exists given a PID."""
    return User.query.filter_by(id=patron_pid).first() is not None
