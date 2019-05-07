# -*- coding: utf-8 -*-
#
# Copyright (C) 2018-2019 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""Resolve the circulation status referenced in the Document."""

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
        item_search = ItemSearch()
        loan_search = IlsLoansSearch()

        all_items_count = item_search.search_by_document_pid(
            document_pid).execute().hits.total
        unavailable_items_count = item_search. \
            get_unavailable_items_by_document_pid(
                document_pid).execute().hits.total

        past_loans_count = loan_search.get_past_loans_by_doc_pid(
            document_pid).execute().hits.total
        active_loans_count = loan_search.get_active_loans_by_doc_pid(
            document_pid).execute().hits.total
        pending_loans_count = loan_search.get_pending_loans_by_doc_pid(
            document_pid).execute().hits.total

        items_available_for_loan = all_items_count - \
            active_loans_count - unavailable_items_count

        circulation = {
            "number_of_past_loans": past_loans_count,
            "number_of_items": all_items_count,
            "active_loans": active_loans_count,
            "items_available_for_loan": items_available_for_loan,
            "pending_loans": pending_loans_count,
            "overbooked": pending_loans_count > items_available_for_loan,
        }

        if circulation["overbooked"] or circulation["active_loans"] >= \
                circulation["items_available_for_loan"]:
            next_available_loans = loan_search.get_loan_next_available_date(
                document_pid).execute()
            if next_available_loans:
                circulation["next_available_date"] = \
                    next_available_loans.hits[0].end_date
        return circulation

    url_map.add(
        Rule(
            "/api/resolver/documents/<document_pid>/circulation",
            endpoint=circulation_resolver,
            host=current_app.config.get("JSONSCHEMAS_HOST"),
        )
    )
