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

from ..records.api import Document, Item


def circulation_item_ref_builder(item_pid):
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
    document = Document.get_record_by_pid(document_pid)
    for item_pid in document["items"]:
        yield item_pid


def circulation_document_retriever(item_pid):
    """Retrieve items given a document."""
    item = Item.get_record_by_pid(item_pid)
    return item["document_pid"]


def circulation_item_resolver(item_pid):
    """Retrieve item given its pid."""
    item = Item.get_record_by_pid(item_pid)
    # To avoid circular dependencies, we remove loan from item.
    del item["circulation_status"]
    return item


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
    return True


def circulation_patron_exists(patron_pid):
    """Check if user exists."""
    return True
