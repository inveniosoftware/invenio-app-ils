# -*- coding: utf-8 -*-
#
# Copyright (C) 2019 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""Keywords related resolvers."""

import jsonresolver
from werkzeug.routing import Rule

from ..api import Document, Keyword
from .resolver import get_field_value_for_record as get_field_value

# Note: there must be only one resolver per file,
# otherwise only the last one is registered


@jsonresolver.hookimpl
def jsonresolver_loader(url_map):
    """Resolve the referred Keywords for a Document record."""
    from flask import current_app

    def keywords_resolver(document_pid):
        """Return the Keyword records for the given Keyword or raise."""
        keyword_pids = get_field_value(Document, document_pid, "keyword_pids")

        keywords = []
        for keyword_pid in keyword_pids:
            keyword = Keyword.get_record_by_pid(keyword_pid)
            del keyword["$schema"]
            keywords.append(keyword)

        return keywords

    url_map.add(
        Rule(
            "/api/resolver/documents/<document_pid>/keywords",
            endpoint=keywords_resolver,
            host=current_app.config.get("JSONSCHEMAS_HOST"),
        )
    )
