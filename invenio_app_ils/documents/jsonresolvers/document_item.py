# -*- coding: utf-8 -*-
#
# Copyright (C) 2019-2020 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""Resolve the Item referenced in the Document."""

import jsonresolver
from werkzeug.routing import Rule

from invenio_app_ils.proxies import current_app_ils


@jsonresolver.hookimpl
def jsonresolver_loader(url_map):
    """Resolve the referred Items for a Document record."""
    from flask import current_app

    def items_resolver(document_pid):
        """Search and return the total number of items."""
        items = []
        by_location = {}

        item_search = current_app_ils.item_search_cls()
        for hit in item_search.search_by_document_pid(document_pid).scan():
            item = hit.to_dict()
            circulation = item.get("circulation", {})
            obj = {
                "pid": item.get("pid"),
                "isbn": item.get("isbn"),
                "internal_location_pid": item.get("internal_location_pid"),
                "circulation_restriction": item.get("circulation_restriction"),
                "barcode": item.get("barcode"),
                "medium": item.get("medium"),
                "status": item.get("status"),
                "description": item.get("description"),
                "shelf": item.get("shelf"),
                "identifiers": item.get("identifiers"),
                "internal_location": {
                    "name": item.get("internal_location", {}).get("name", ""),
                    "location": {
                        "name": (
                            item.get("internal_location", {})
                            .get("location", {})
                            .get("name", "")
                        )
                    },
                },
            }
            if circulation:
                include_circulation_keys = ["state"]
                obj["circulation"] = {}
                for key in include_circulation_keys:
                    obj["circulation"][key] = circulation.get(key)
            items.append(obj)

            # grouping by location (can circulate and not on loan)
            location_name = (
                item.get("internal_location", {}).get("location", {}).get("name", "")
            )
            internal_location_name = item.get("internal_location", {}).get("name", "")
            if location_name not in by_location:
                by_location[location_name] = {
                    internal_location_name: [],
                    "total": 0,
                }
            if internal_location_name not in by_location[location_name]:
                by_location[location_name][internal_location_name] = []
            del obj["description"]
            by_location[location_name][internal_location_name].append(obj)
            by_location[location_name]["total"] += 1
        return {"total": len(items), "hits": items, "on_shelf": by_location}

    url_map.add(
        Rule(
            "/api/resolver/documents/<document_pid>/items",
            endpoint=items_resolver,
            host=current_app.config.get("JSONSCHEMAS_HOST"),
        )
    )
