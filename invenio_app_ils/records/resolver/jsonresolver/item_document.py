# -*- coding: utf-8 -*-
#
# Copyright (C) 2018-2019 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""Resolve the Document referenced in the Item."""

import jsonresolver
from werkzeug.routing import Rule

from ...api import Document, Item
from ..resolver import get_field_value_for_record as get_field_value

# Note: there must be only one resolver per file,
# otherwise only the last one is registered


@jsonresolver.hookimpl
def jsonresolver_loader(url_map):
    """Resolve the referred Document for an Item record."""
    from flask import current_app

    def get_document(document_pid):
        """Return the Document record."""
        document = Document.get_record_by_pid(document_pid)
        return {
            "document_pid": document.get("document_pid"),
            "title": document.get("title"),
            "authors": document.get("authors"),
        }

    def document_resolver(item_pid):
        """Return the Document record for the given Item or raise."""
        document_pid = get_field_value(Item, item_pid, Document.pid_field)
        return get_document(document_pid)

    url_map.add(
        Rule(
            "/api/resolver/items/<item_pid>/document",
            endpoint=document_resolver,
            host=current_app.config.get("JSONSCHEMAS_HOST"),
        )
    )
