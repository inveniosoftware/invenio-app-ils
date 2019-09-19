# -*- coding: utf-8 -*-
#
# Copyright (C) 2018-2019 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""Resolve the DocumentRequest for a Document."""

import jsonresolver
from elasticsearch import VERSION as ES_VERSION
from werkzeug.routing import Rule

from invenio_app_ils.errors import DocumentRequestError
from invenio_app_ils.search.api import DocumentRequestSearch

# Note: there must be only one resolver per file,
# otherwise only the last one is registered


@jsonresolver.hookimpl
def jsonresolver_loader(url_map):
    """Resolve the referred Document for an Document record."""
    from flask import current_app

    def document_request_resolver(document_pid):
        """Return the DocumentRequest for the given Document or raise."""
        search = DocumentRequestSearch().search_by_document_pid(document_pid)
        results = search.execute()
        if ES_VERSION[0] >= 7:
            total = results.hits.total.value
        else:
            total = results.hits.total
        if total < 1:
            return {}
        elif total > 1:
            raise DocumentRequestError(
                "Found multiple requests associated with document {}".format(
                    document_pid
                )
            )
        else:
            hit = results.hits[0].to_dict()
            return {
                "pid": hit.get("pid", None),
                "title": hit.get("title", None),
                "authors": hit.get("authors", None),
                "note": hit.get("note", None),
                "state": hit.get("state", None),
                "patron_pid": hit.get("patron_pid", None),
            }

    url_map.add(
        Rule(
            "/api/resolver/documents/<document_pid>/request",
            endpoint=document_request_resolver,
            host=current_app.config.get("JSONSCHEMAS_HOST"),
        )
    )
