# -*- coding: utf-8 -*-
#
# Copyright (C) 2018-2020 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""Resolve the circulation status referenced in the Document."""

import jsonresolver
from elasticsearch import VERSION as ES_VERSION
from werkzeug.routing import Rule

from invenio_app_ils.circulation.search import get_active_loans_by_doc_pid, \
    get_loan_next_available_date, get_overdue_loans_by_doc_pid, \
    get_past_loans_by_doc_pid, get_pending_loans_by_doc_pid
from invenio_app_ils.proxies import current_app_ils

lt_es7 = ES_VERSION[0] < 7


# Note: there must be only one resolver per file,
# otherwise only the last one is registered


@jsonresolver.hookimpl
def jsonresolver_loader(url_map):
    """Resolve the referred circulation aggregation for a Document record."""
    from flask import current_app

    def circulation_resolver(document_pid):
        """Return circulation info for the given Document."""
        # loans
        past_loans_count = get_past_loans_by_doc_pid(document_pid).count()
        active_loans_count = get_active_loans_by_doc_pid(document_pid).count()
        pending_loans_count = get_pending_loans_by_doc_pid(
            document_pid
        ).count()
        overdue_loans_count = get_overdue_loans_by_doc_pid(
            document_pid
        ).count()

        # items
        item_search = current_app_ils.item_search_cls()
        items_count = item_search.search_by_document_pid(document_pid).count()
        unavailable_items_count = item_search.get_unavailable_items_by_document_pid(
            document_pid
        ).count()
        has_items_for_loan = (
            items_count - active_loans_count - unavailable_items_count
        )
        has_items_for_reference_only_count = item_search.get_for_reference_only_by_document_pid(
            document_pid
        ).count()

        circulation = {
            "active_loans": active_loans_count,
            "can_circulate_items_count": items_count - unavailable_items_count,
            "has_items_for_loan": has_items_for_loan,
            "overbooked": pending_loans_count > has_items_for_loan,
            "overdue_loans": overdue_loans_count,
            "past_loans_count": past_loans_count,
            "pending_loans": pending_loans_count,
            "has_items_on_site": has_items_for_reference_only_count,
        }

        if (
            circulation["overbooked"]
            or circulation["active_loans"] >= circulation["has_items_for_loan"]
        ):
            next_available_loans = (
                get_loan_next_available_date(document_pid).execute().hits
            )
            total = (
                next_available_loans.total
                if lt_es7
                else next_available_loans.total.value
            )
            if total > 0:
                next_date = next_available_loans[0].end_date
                circulation["next_available_date"] = next_date
        return circulation

    url_map.add(
        Rule(
            "/api/resolver/documents/<document_pid>/circulation",
            endpoint=circulation_resolver,
            host=current_app.config.get("JSONSCHEMAS_HOST"),
        )
    )
