# -*- coding: utf-8 -*-
#
# Copyright (C) 2018-2019 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""Resolve the Document reference in the EItem."""

import jsonresolver
from werkzeug.routing import Rule

from ...api import Document, EItem
from ..resolver import get_field_value_for_record as get_field_value

# Note: there must be only one resolver per file,
# otherwise only the last one is registered


@jsonresolver.hookimpl
def jsonresolver_loader(url_map):
    """Resolve the referred Document for an EItem record."""
    from flask import current_app

    def get_document(document_pid):
        """Return the Document record."""
        document = Document.get_record_by_pid(document_pid)
        return {
            "pid": document.get("pid"),
            "title": document.get("title"),
            "authors": document.get("authors"),
        }

    def document_resolver(eitem_pid):
        """Return the Document record for the given EItem or raise."""
        document_pid = get_field_value(EItem, eitem_pid,
                                       "document_pid")
        return get_document(document_pid)

    url_map.add(
        Rule(
            "/api/resolver/eitems/<eitem_pid>/document",
            endpoint=document_resolver,
            host=current_app.config.get("JSONSCHEMAS_HOST"),
        )
    )
