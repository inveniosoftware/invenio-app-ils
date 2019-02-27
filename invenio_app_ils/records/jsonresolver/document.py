# -*- coding: utf-8 -*-
#
# Copyright (C) 2018-2019 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""Document related resolvers."""

import jsonresolver
from werkzeug.routing import Rule

from invenio_app_ils.circulation.search import IlsLoansSearch
from invenio_app_ils.search.api import ItemSearch

# Note: there must be only one resolver per file,
# otherwise only the last one is registered


@jsonresolver.hookimpl
def jsonresolver_loader(url_map):
    """Resolve the referred circulation aggregation for a Document record."""
    from flask import current_app

    def circulation_resolver(document_pid):
        """Return circulation info for the given Document."""
        circulation = {}

        items = list(ItemSearch().search_by_document_pid(document_pid).scan())
        loan_search = IlsLoansSearch()

        past_loans_count = loan_search.get_past_loans_by_doc_pid(document_pid).execute().hits.total
        active_loans_count = loan_search.get_active_loans_by_doc_pid(document_pid).execute().hits.total
        pending_loans_count = loan_search.get_pending_loans_by_doc_pid(document_pid).execute().hits.total

        circulation["number_of_past_loans"] = past_loans_count
        circulation["number_of_items"] = len(items)
        circulation["active_loans"] = active_loans_count
        circulation["loanable_items"] = sum(item["status"] == "LOANABLE" for item in items)
        circulation["pending_loans"] = pending_loans_count
        circulation["overbooked"] = pending_loans_count > circulation["loanable_items"]
        return circulation

    url_map.add(
        Rule(
            "/api/resolver/documents/<document_pid>/circulation",
            endpoint=circulation_resolver,
            host=current_app.config.get("JSONSCHEMAS_HOST"),
        )
    )
