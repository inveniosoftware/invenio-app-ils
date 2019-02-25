# -*- coding: utf-8 -*-
#
# Copyright (C) 2018-2019 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""Document related resolvers."""

import jsonresolver
from invenio_circulation.search.api import search_by_pid
from werkzeug.routing import Rule

from invenio_app_ils.circulation.utils import circulation_is_item_available, \
    circulation_items_retriever

# Note: there must be only one resolver per file,
# otherwise only the last one is registered


@jsonresolver.hookimpl
def jsonresolver_loader(url_map):
    """Resolve the referred circulation aggregation for a Document record."""
    from flask import current_app

    def circulation_resolver(document_pid):
        """Return circulation info for the given Document."""
        circulation = {}
        loanable_items_count = 0
        items_count = 0
        item_pids = circulation_items_retriever(document_pid)

        for pid in item_pids:
            items_count += 1

            if circulation_is_item_available(pid):
                loanable_items_count += 1

        active_loans_count = search_by_pid(
            document_pid=document_pid,
            filter_states=current_app.config.get(
                "CIRCULATION_STATES_LOAN_ACTIVE", []
            ),
        ).execute().hits.total

        search = search_by_pid(
            document_pid=document_pid,
            filter_states=current_app.config.get(
                "CIRCULATION_STATES_LOAN_COMPLETED", []
            ),
        )

        pending_loans = search_by_pid(document_pid=document_pid,
                                      filter_states=['PENDING']
                                      ).execute().hits.total

        circulation["number_of_past_loans"] = search.execute().hits.total
        circulation["number_of_items"] = items_count
        circulation["active_loans"] = active_loans_count
        circulation["loanable_items"] = loanable_items_count
        circulation["pending_loans"] = pending_loans
        circulation["overbooked"] = pending_loans > loanable_items_count
        return circulation

    url_map.add(
        Rule(
            "/api/resolver/documents/<document_pid>/circulation",
            endpoint=circulation_resolver,
            host=current_app.config.get("JSONSCHEMAS_HOST"),
        )
    )
