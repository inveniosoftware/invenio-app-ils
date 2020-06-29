# -*- coding: utf-8 -*-
#
# Copyright (C) 2020 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""Resolver for Document referenced in BorrowingRequest."""

import jsonresolver
from werkzeug.routing import Rule

from invenio_app_ils.proxies import current_app_ils
from invenio_app_ils.records.jsonresolvers.api import \
    get_field_value_for_record as get_field_value
from invenio_app_ils.records.jsonresolvers.api import get_pid_or_default, pick

from ..proxies import current_ils_ill

# Note: there must be only one resolver per file,
# otherwise only the last one is registered


@jsonresolver.hookimpl
def jsonresolver_loader(url_map):
    """Resolve the referred Document for a Borrowing Request record."""
    from flask import current_app

    @get_pid_or_default(default_value=dict())
    def get_document(document_pid):
        """Return the Document record."""
        Document = current_app_ils.document_record_cls
        document = Document.get_record_by_pid(document_pid)
        return pick(
            document,
            "cover_metadata",
            "edition",
            "pid",
            "publication_year",
            "title",
        )

    def borrowing_request_resolver(request_pid):
        """Return the Document record for the given Brw Request or raise."""
        request_record_cls = current_ils_ill.borrowing_request_record_cls
        document_pid = get_field_value(
            request_record_cls, request_pid, "document_pid"
        )
        return get_document(document_pid)

    url_map.add(
        Rule(
            "/api/resolver/ill/borrowing-requests/<request_pid>/document",
            endpoint=borrowing_request_resolver,
            host=current_app.config.get("JSONSCHEMAS_HOST"),
        )
    )
