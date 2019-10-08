# -*- coding: utf-8 -*-
#
# Copyright (C) 2018-2019 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""Resolve the Patron referenced in the DocumentRequest."""

import jsonresolver
from werkzeug.routing import Rule

from invenio_app_ils.errors import PatronNotFoundError

from ...api import DocumentRequest, Patron
from ..resolver import get_field_value_for_record as get_field_value

# Note: there must be only one resolver per file,
# otherwise only the last one is registered


@jsonresolver.hookimpl
def jsonresolver_loader(url_map):
    """Resolve the referred Patron for an DocumentRequest record."""
    from flask import current_app

    def get_patron(patron_pid):
        """Return the Patron record."""
        return Patron.get_patron(patron_pid).dumps_loader()

    def patron_resolver(document_request_pid):
        """Get the Patron record for the given DocumentRequest or raise."""
        try:
            patron_pid = get_field_value(
                DocumentRequest,
                document_request_pid,
                "patron_pid"
            )
            if not patron_pid:
                return {}
            return get_patron(patron_pid)
        except PatronNotFoundError:
            return {}

    url_map.add(
        Rule(
            "/api/resolver/document-requests/<document_request_pid>/patron",
            endpoint=patron_resolver,
            host=current_app.config.get("JSONSCHEMAS_HOST"),
        )
    )
