# -*- coding: utf-8 -*-
#
# Copyright (C) 2019-2020 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""ILS APIs."""

from __future__ import absolute_import, print_function

from invenio_accounts.models import User
from invenio_pidstore.errors import PersistentIdentifierError

from invenio_app_ils.circulation.utils import resolve_item_from_loan
from invenio_app_ils.errors import UnknownItemPidTypeError
from invenio_app_ils.ill.pidstore.pids import BORROWING_REQUEST_PID_TYPE
from invenio_app_ils.pidstore.pids import ITEM_PID_TYPE
from invenio_app_ils.proxies import current_app_ils
from invenio_app_ils.search.api import ItemSearch


def get_item_pids_by_document_pid(document_pid):
    """Retrieve Items PIDs given a Document PID."""
    search = ItemSearch().search_by_document_pid(document_pid)
    for item in search.scan():
        yield dict(value=item["pid"], type=ITEM_PID_TYPE)


def can_item_circulate(item_pid):
    """Return True if Item can circulate."""
    if item_pid["type"] not in [BORROWING_REQUEST_PID_TYPE, ITEM_PID_TYPE]:
        raise UnknownItemPidTypeError(pid_type=item_pid["type"])

    if item_pid["type"] == BORROWING_REQUEST_PID_TYPE:
        return True

    Item = current_app_ils.item_record_cls
    item = Item.get_record_by_pid(item_pid["value"])
    if item:
        return item["status"] == "CAN_CIRCULATE"
    return False


def get_document_pid_by_item_pid(item_pid):
    """Retrieve the Document PID of the given Item PID."""
    rec = resolve_item_from_loan(item_pid)
    return rec.get("document_pid")


def get_location_pid_by_item_pid(item_pid):
    """Retrieve Location PID given an Item PID."""
    if item_pid["type"] not in [BORROWING_REQUEST_PID_TYPE, ITEM_PID_TYPE]:
        raise UnknownItemPidTypeError(pid_type=item_pid["type"])

    if item_pid["type"] == BORROWING_REQUEST_PID_TYPE:
        # return a fake location in case of ILL
        return BORROWING_REQUEST_PID_TYPE

    Item = current_app_ils.item_record_cls
    item_rec = Item.get_record_by_pid(item_pid["value"])
    item = item_rec.replace_refs()
    return item["internal_location"]["location"]["pid"]


def item_exists(item_pid):
    """Return True if the Item exists given a PID."""
    try:
        resolve_item_from_loan(item_pid)
    except PersistentIdentifierError:
        return False
    return True


def document_exists(document_pid):
    """Return True if the Document exists given a PID."""
    Document = current_app_ils.document_record_cls
    try:
        Document.get_record_by_pid(document_pid)
    except PersistentIdentifierError:
        return False
    return True


def patron_exists(patron_pid):
    """Return True if the Patron exists given a PID."""
    return User.query.filter_by(id=patron_pid).first() is not None
