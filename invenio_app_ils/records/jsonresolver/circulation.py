# -*- coding: utf-8 -*-
#
# Copyright (C) 2019 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""Ils Records Documents record circulation resolver."""

import jsonresolver
from werkzeug.routing import Rule

from invenio_app_ils.circulation.search import IlsLoansSearch
from invenio_app_ils.search.api import ItemSearch


@jsonresolver.hookimpl
def jsonresolver_loader(url_map):
    """Resolve the circulation for document record."""
    from flask import current_app

    def _circulation_for_document_resolver(document_pid):
        """Return circulation info for the given document."""
        circulation = {}

        items = list(ItemSearch().search_by_document_pid(document_pid).scan())
        items_count = len(items)
        loanable_items_count = sum(item["status"] == "LOANABLE" for item in items)

        loan_search = IlsLoansSearch()

        past_loans_count = len(list(loan_search.get_past_loans_by_doc_pid(document_pid)))
        active_loans_count = len(list(loan_search.get_active_loans_by_doc_pid(document_pid)))
        pending_loans_count = len(list(loan_search.get_pending_loans_by_doc_pid(document_pid)))

        circulation["number_of_past_loans"] = past_loans_count
        circulation["number_of_items"] = items_count
        circulation["active_loans"] = active_loans_count
        circulation["loanable_items"] = loanable_items_count
        circulation["pending_loans"] = pending_loans_count
        circulation["overbooked"] = pending_loans_count > loanable_items_count
        return circulation

    url_map.add(
        Rule(
            "/api/resolver/documents/<document_pid>/circulation",
            endpoint=_circulation_for_document_resolver,
            host=current_app.config.get("JSONSCHEMAS_HOST"),
        )
    )
