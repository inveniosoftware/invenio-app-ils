# -*- coding: utf-8 -*-
#
# Copyright (C) 2020 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""Resolve the EItem referenced in the Document."""

import jsonresolver
from werkzeug.routing import Rule

from invenio_app_ils.eitems.api import EItem
from invenio_app_ils.proxies import current_app_ils

# Note: there must be only one resolver per file,
# otherwise only the last one is registered


@jsonresolver.hookimpl
def jsonresolver_loader(url_map):
    """Resolve the referred EItems for a Document record."""
    from flask import current_app

    def eitems_resolver(document_pid):
        """Search and return the EItems that reference this Document."""
        eitems = []
        eitem_search = current_app_ils.eitem_search_cls()
        for hit in eitem_search.search_by_document_pid(document_pid).scan():
            eitem = hit.to_dict()
            eitems.append(
                {
                    "pid": eitem.get("pid"),
                    "eitem_type": eitem.get("eitem_type"),
                    "description": eitem.get("description"),
                    "identifiers": eitem.get("identifiers", []),
                    "internal_notes": eitem.get("internal_notes"),
                    "open_access": eitem.get("open_access"),
                    "bucket_id": eitem.get("bucket_id", None),
                    "files": eitem.get("files", []),
                    "urls": eitem.get("urls", []),
                }
            )

        return {"total": len(eitems), "hits": eitems}

    url_map.add(
        Rule(
            "/api/resolver/documents/<document_pid>/eitems",
            endpoint=eitems_resolver,
            host=current_app.config.get("JSONSCHEMAS_HOST"),
        )
    )
