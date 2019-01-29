# -*- coding: utf-8 -*-
#
# Copyright (C) 2018 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""Circulation configuration callbacks."""

from __future__ import absolute_import, print_function

from flask import current_app
from invenio_pidstore.errors import PersistentIdentifierError

from ..records.api import Item
from ..search.api import ItemSearch


def circulation_build_item_ref(item_pid):
    """Build $ref for item."""
    return {
        "$ref": "{scheme}://{host}/api/resolver/circulation/items/{item_pid}".format(
            scheme=current_app.config["JSONSCHEMAS_URL_SCHEME"],
            host=current_app.config["JSONSCHEMAS_HOST"],
            item_pid=item_pid,
        )
    }


def circulation_items_retriever(document_pid):
    """Retrieve items given a document."""
    search = ItemSearch().search_by_document_pid(document_pid)
    for item in search.scan():
        yield item["item_pid"]


def circulation_document_retriever(item_pid):
    """Retrieves document given an item."""
    item = Item.get_record_by_pid(item_pid)
    item = item.replace_refs()
    if item.get("document") and item["document"].get("document_pid"):
        return item["document"]["document_pid"]
    return ""


def circulation_item_location_retriever(item_pid):
    """Retrieve location pid given an item."""
    item_rec = Item.get_record_by_pid(item_pid)
    item = item_rec.replace_refs()
    return item["internal_location"]["location"]["location_pid"]


def circulation_item_exists(item_pid):
    """Retrieve location pid given an item."""
    try:
        Item.get_record_by_pid(item_pid)
    except PersistentIdentifierError as ex:
        current_app.logger.error(ex)
        return False
    return True


def circulation_is_item_available(item_pid):
    """Check if item is available."""
    item = Item.get_record_by_pid(item_pid)
    if item:
        return item["status"] == "LOANABLE"
    return False


def circulation_patron_exists(patron_pid):
    """Check if user exists."""
    return True
