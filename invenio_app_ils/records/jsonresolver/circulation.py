# -*- coding: utf-8 -*-
#
# Copyright (C) 2019 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""Ils Records Documents record circulation resolver."""

import jsonresolver
from invenio_circulation.api import get_loan_for_item, is_item_available
from invenio_circulation.search.api import search_by_pid
from werkzeug.routing import Rule

from invenio_app_ils.circulation.utils import circulation_is_item_available, \
    circulation_items_retriever
from invenio_app_ils.records.api import Document


@jsonresolver.hookimpl
def jsonresolver_loader(url_map):
    """Resolve the circulation for document record."""
    from flask import current_app

    def _circulation_for_document_resolver(document_pid):
        """Return circulation info for the given document."""
        circulation = {}
        active_loans_count = 0
        loanable_items_count = 0
        items_count = 0
        item_pids = circulation_items_retriever(document_pid)

        for pid in item_pids:
            items_count += 1
            if not is_item_available(pid):
                active_loans_count += 1

            if circulation_is_item_available(pid):
                loanable_items_count += 1

        search = search_by_pid(
            document_pid=document_pid,
            exclude_states=current_app.config.get(
                "CIRCULATION_STATES_LOAN_ACTIVE", []
            ),
        )

        circulation["number_of_past_loans"] = search.execute().hits.total
        circulation["number_of_items"] = items_count
        circulation["active_loans"] = active_loans_count
        circulation["loanable_items"] = loanable_items_count
        return circulation

    url_map.add(
        Rule(
            "/api/resolver/documents/<document_pid>/circulation",
            endpoint=_circulation_for_document_resolver,
            host=current_app.config.get("JSONSCHEMAS_HOST"),
        )
    )
