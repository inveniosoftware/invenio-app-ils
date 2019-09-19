# -*- coding: utf-8 -*-
#
# Copyright (C) 2019 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""Resolve the Item referenced in the Document."""

import jsonresolver
from werkzeug.routing import Rule

from invenio_app_ils.search.api import ItemSearch


@jsonresolver.hookimpl
def jsonresolver_loader(url_map):
    """Resolve the referred Items for a Document record."""
    from flask import current_app

    def items_resolver(document_pid):
        """Search and return the total number of items."""
        items = []
        for hit in ItemSearch().search_by_document_pid(document_pid).scan():
            item = hit.to_dict()
            circulation = item.get("circulation", {})
            obj = {
                "pid": item.get("pid"),
                "internal_location_pid": item.get("internal_location_pid"),
                "circulation_restriction": item.get("circulation_restriction"),
                "barcode": item.get("barcode"),
                "medium": item.get("medium"),
                "status": item.get("status"),
                "description": item.get("description"),
            }
            if circulation:
                include_circulation_keys = ['state']
                obj["circulation"] = {}
                for key in include_circulation_keys:
                    obj["circulation"][key] = circulation.get(key)
            items.append(obj)
        return {
            "total": len(items),
            "hits": items
        }

    url_map.add(
        Rule(
            "/api/resolver/documents/<document_pid>/items",
            endpoint=items_resolver,
            host=current_app.config.get("JSONSCHEMAS_HOST"),
        )
    )
