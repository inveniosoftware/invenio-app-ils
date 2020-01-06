# -*- coding: utf-8 -*-
#
# Copyright (C) 2019 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""Resolve the Item referenced in the Document."""

import jsonresolver
from werkzeug.routing import Rule

from invenio_app_ils.search.api import EItemSearch, ItemSearch


@jsonresolver.hookimpl
def jsonresolver_loader(url_map):
    """Resolve the referred Items for a Document record."""
    from flask import current_app

    def stock_resolver(document_pid):
        """Search and return the mediums of the document."""
        items_search = ItemSearch().search_by_document_pid(document_pid)
        items_search.aggs.bucket("mediums", "terms", field="medium")
        search_response = items_search.execute()
        mediums = [bucket.key for bucket in
                   search_response.aggregations.mediums.buckets]
        eitems_count = EItemSearch().search_by_document_pid(
            document_pid).count()
        if eitems_count > 0:
            mediums.append("ELECTRONIC_VERSION")
        return {
            "mediums": mediums,
        }

    url_map.add(
        Rule(
            "/api/resolver/documents/<document_pid>/stock",
            endpoint=stock_resolver,
            host=current_app.config.get("JSONSCHEMAS_HOST"),
        )
    )
