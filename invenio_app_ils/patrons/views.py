# -*- coding: utf-8 -*-
#
# Copyright (C) 2019 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""Invenio App ILS Patrons views."""

from elasticsearch import VERSION as ES_VERSION
from flask import Blueprint, current_app
from flask_login import current_user
from invenio_circulation.search.api import search_by_patron_item_or_document
from webargs import fields
from webargs.flaskparser import use_kwargs

from invenio_app_ils.circulation.search import get_loans_aggregated_by_states
from invenio_app_ils.permissions import need_permissions

lt_es7 = ES_VERSION[0] < 7


def get_user_loan_information_blueprint(_):
    """Add patron views to the blueprint."""
    blueprint = Blueprint("invenio_app_ils_patrons", __name__)

    @blueprint.route("/me/loans")
    @use_kwargs({"document_pid": fields.Str(required=True)})
    @need_permissions("patron-loans")
    def get_user_information(document_pid):
        patron_pid = str(current_user.id)
        return retrieve_user_loans_information(patron_pid, document_pid)

    return blueprint


def retrieve_user_loans_information(patron_pid, document_pid):
    """Retrieves patron loans for the given patron."""
    active_requested_loan_states = (
        current_app.config["CIRCULATION_STATES_LOAN_REQUEST"]
        + current_app.config["CIRCULATION_STATES_LOAN_ACTIVE"]
    )
    past_loan_states = current_app.config["CIRCULATION_STATES_LOAN_COMPLETED"]

    user_information = {
        "is_requested": False,
        "has_active_loan": False,
        "last_loan": None,
    }

    loans_search = get_loans_aggregated_by_states(
        document_pid,
        active_requested_loan_states + past_loan_states,
        patron_pid,
    )
    # No need for the loan hits
    loans_search = loans_search[:0]
    loan_result = loans_search.execute()
    for bucket in loan_result.aggregations.states.buckets:
        if (
            bucket["key"]
            in current_app.config["CIRCULATION_STATES_LOAN_ACTIVE"]
            and bucket["doc_count"] > 0
        ):
            user_information["has_active_loan"] = True
        elif (
            bucket["key"]
            in current_app.config["CIRCULATION_STATES_LOAN_REQUEST"]
            and bucket["doc_count"] > 0
        ):
            user_information["is_requested"] = True
        elif (
            bucket["key"]
            in current_app.config["CIRCULATION_STATES_LOAN_COMPLETED"]
            and bucket["doc_count"] > 0
        ):
            search = search_by_patron_item_or_document(
                patron_pid=patron_pid,
                document_pid=document_pid,
                filter_states=past_loan_states,
            )

            search = search.sort({"end_date": {"order": "desc"}})
            search_result = search.execute()
            has_past_loans = (
                search_result.hits.total > 0
                if lt_es7
                else search_result.hits.total.value > 0
            )
            if has_past_loans:
                last_loan = search_result.hits[0]
                user_information["last_loan"] = last_loan["end_date"]

    return user_information
