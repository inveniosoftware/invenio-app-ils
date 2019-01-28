# -*- coding: utf-8 -*-
#
# Copyright (C) 2018 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""Ils Records Items record document resolver."""

import jsonresolver
from werkzeug.routing import Rule

from invenio_app_ils.records.api import Document


@jsonresolver.hookimpl
def jsonresolver_loader(url_map):
    """Resolve the document for item record."""
    from flask import current_app

    def _document_for_item_resolver(document_pid):
        """Return the document for the given item."""
        document = Document.get_record_by_pid(document_pid)
        # delete circulation field when document is dereferenced inside item
        del document["circulation"]
        return document

    url_map.add(
        Rule(
            "/api/resolver/items/document/<document_pid>",
            endpoint=_document_for_item_resolver,
            host=current_app.config.get("JSONSCHEMAS_HOST"),
        )
    )
