# -*- coding: utf-8 -*-
#
# Copyright (C) 2020 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""ILS Items APIs."""

from __future__ import absolute_import, print_function

from flask import current_app
from invenio_pidstore.errors import PersistentIdentifierError

from invenio_app_ils.circulation.utils import resolve_item_from_loan
from invenio_app_ils.pidstore.pids import ITEM_PID_TYPE
from invenio_app_ils.proxies import current_app_ils


def get_item_pids_by_document_pid(document_pid):
    """Retrieve Items PIDs given a Document PID."""
    ItemSearch = current_app_ils.item_search_cls
    search = ItemSearch().search_by_document_pid(document_pid)
    for item in search.scan():
        yield dict(value=item["pid"], type=ITEM_PID_TYPE)


def get_document_pid_by_item_pid(item_pid):
    """Retrieve the Document PID of the given Item PID."""
    rec = resolve_item_from_loan(item_pid)
    return rec.get("document_pid")


def get_default_location(item_pid):
    """Return default location."""
    return current_app.config["ILS_DEFAULT_LOCATION_PID"]


def item_exists(item_pid):
    """Return True if the Item exists given a PID."""
    try:
        resolve_item_from_loan(item_pid)
    except PersistentIdentifierError:
        return False
    return True
