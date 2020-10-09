# -*- coding: utf-8 -*-
#
# Copyright (C) 2019 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""Resolve documents and patron for order lines."""

import jsonresolver
from werkzeug.routing import Rule

from invenio_app_ils.acquisition.proxies import current_ils_acq
from invenio_app_ils.patrons.api import get_patron_or_unknown_dump
from invenio_app_ils.proxies import current_app_ils
from invenio_app_ils.records.jsonresolvers.api import \
    get_field_value_for_record as get_field_value
from invenio_app_ils.records.jsonresolvers.api import pick


@jsonresolver.hookimpl
def jsonresolver_loader(url_map):
    """Resolve the referred document and patron for an Order Line."""
    from flask import current_app

    def document_resolver(order_line, doc):
        """Resolve the Document for the given Order Line."""
        order_line["document"] = pick(doc, "cover_metadata", "pid", "title")
        return doc

    def order_lines_resolver(order_pid):
        Order = current_ils_acq.order_record_cls
        Document = current_app_ils.document_record_cls
        order_lines = get_field_value(Order, order_pid, "order_lines")

        documents = {}
        for order_line in order_lines:
            doc_pid = order_line.get("document_pid")
            doc = documents.get(doc_pid) or Document.get_record_by_pid(doc_pid)
            documents[doc["pid"]] = doc
            document_resolver(order_line, doc)

            patron_pid = order_line.get("patron_pid")
            if patron_pid:
                patron_dump = get_patron_or_unknown_dump(patron_pid)
                order_line["patron"] = patron_dump

        return order_lines

    url_map.add(
        Rule(
            "/api/resolver/acquisition/orders/<order_pid>/order-lines",
            endpoint=order_lines_resolver,
            host=current_app.config.get("JSONSCHEMAS_HOST"),
        )
    )
