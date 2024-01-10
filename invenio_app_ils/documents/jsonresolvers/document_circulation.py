# -*- coding: utf-8 -*-
#
# Copyright (C) 2018-2020 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""Resolve the circulation status referenced in the Document."""

import jsonresolver
from werkzeug.routing import Rule

from invenio_app_ils.circulation.search import (
    get_loan_next_available_date,
    get_loans_aggregated_by_states,
    get_overdue_loans_by_doc_pid,
)
from invenio_app_ils.ill.api import BORROWING_REQUEST_PID_TYPE
from invenio_app_ils.items.search import get_items_aggregated_by_statuses

# Note: there must be only one resolver per file,
# otherwise only the last one is registered


@jsonresolver.hookimpl
def jsonresolver_loader(url_map):
    """Resolve the referred circulation aggregation for a Document record."""
    from flask import current_app

    def circulation_resolver(document_pid):
        """Return circulation info for the given Document."""
        # loans
        loan_states = (
            current_app.config["CIRCULATION_STATES_LOAN_ACTIVE"]
            + current_app.config["CIRCULATION_STATES_LOAN_COMPLETED"]
            + current_app.config["CIRCULATION_STATES_LOAN_REQUEST"]
        )

        past_loans_count = 0
        active_loans_count = 0
        pending_loans_count = 0
        loans_search = get_loans_aggregated_by_states(document_pid, loan_states)

        loans_result = loans_search.execute()

        for bucket in loans_result.aggregations.states.buckets:
            if bucket["key"] in current_app.config["CIRCULATION_STATES_LOAN_COMPLETED"]:
                past_loans_count += bucket["doc_count"]
            elif bucket["key"] in current_app.config["CIRCULATION_STATES_LOAN_ACTIVE"]:
                active_loans_count += bucket["doc_count"]
            elif bucket["key"] in current_app.config["CIRCULATION_STATES_LOAN_REQUEST"]:
                pending_loans_count += bucket["doc_count"]

        overdue_loans_count = get_overdue_loans_by_doc_pid(document_pid).count()

        # items
        unavailable_items_count = 0
        items_for_reference_count = 0
        item_statuses = get_items_aggregated_by_statuses(document_pid)
        item_result = item_statuses.execute()
        items_count = item_result.hits.total.value
        for bucket in item_result.aggregations.statuses.buckets:
            if bucket["key"] not in "CAN_CIRCULATE":
                unavailable_items_count += bucket["doc_count"]
            if bucket["key"] in "FOR_REFERENCE_ONLY":
                items_for_reference_count = bucket["doc_count"]

        active_ill_loans_count = 0

        for hit in loans_result.hits:
            loan = hit.to_dict()
            loan_item_type = loan.get("item_pid", {}).get("type")
            is_brw_req = loan_item_type == BORROWING_REQUEST_PID_TYPE
            if (
                loan["state"] in current_app.config["CIRCULATION_STATES_LOAN_ACTIVE"]
                and is_brw_req
            ):
                active_ill_loans_count += 1

        active_ils_loans_count = active_loans_count - active_ill_loans_count

        available_items_for_loan_count = (
            items_count - active_ils_loans_count - unavailable_items_count
        )

        circulation = {
            "active_loans_count": active_loans_count,
            "available_items_for_loan_count": available_items_for_loan_count,
            "can_circulate_items_count": items_count - unavailable_items_count,
            "items_for_reference_count": items_for_reference_count,
            "overbooked": pending_loans_count > available_items_for_loan_count,
            "overdue_loans_count": overdue_loans_count,
            "past_loans_count": past_loans_count,
            "pending_loans_count": pending_loans_count,
        }

        if (
            circulation["overbooked"]
            or circulation["active_loans_count"]
            >= circulation["available_items_for_loan_count"]
        ):
            next_available_loans = (
                get_loan_next_available_date(document_pid).execute().hits
            )
            total = next_available_loans.total.value
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
