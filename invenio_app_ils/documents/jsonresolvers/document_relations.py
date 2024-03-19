# -*- coding: utf-8 -*-
#
# Copyright (C) 2019 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""Resolve the relations referenced in the Document."""

import jsonresolver
from werkzeug.routing import Rule

from invenio_app_ils.documents.api import Document
from invenio_app_ils.records.jsonresolvers.api import get_pid_or_default

# Note: there must be only one resolver per file,
# otherwise only the last one is registered


@jsonresolver.hookimpl
def jsonresolver_loader(url_map):
    """Resolve the relations of a Document record."""
    from flask import current_app

    @get_pid_or_default(default_value=dict())
    def relations_resolver(document_pid):
        """Resolve record relations and add metadata."""
        document = Document.get_record_by_pid(document_pid)
        return document.relations

    url_map.add(
        Rule(
            "/api/resolver/documents/<document_pid>/relations",
            endpoint=relations_resolver,
            host=current_app.config.get("JSONSCHEMAS_HOST"),
        )
    )
