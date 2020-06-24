# -*- coding: utf-8 -*-
#
# Copyright (C) 2019 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""Resolve the Item referenced in the Document."""

import jsonresolver
from werkzeug.routing import Rule

from invenio_app_ils.proxies import current_app_ils

# Note: there must be only one resolver per file,
# otherwise only the last one is registered


@jsonresolver.hookimpl
def jsonresolver_loader(url_map):
    """Resolve the referred Items for a Document record."""
    from flask import current_app

    def stock_resolver(document_pid):
        """Search and return the mediums of the document."""
        item_search = current_app_ils.item_search_cls()
        eitem_search = current_app_ils.eitem_search_cls()

        search = item_search.search_by_document_pid(document_pid)
        search.aggs.bucket("mediums", "terms", field="medium")
        search_response = search.execute()
        mediums = [bucket.key for bucket in
                   search_response.aggregations.mediums.buckets]
        eitems_count = eitem_search.search_by_document_pid(
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
