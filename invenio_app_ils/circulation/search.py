# -*- coding: utf-8 -*-
#
# Copyright (C) 2018 CERN.
#
# Invenio-Circulation is free software; you can redistribute it and/or modify
# it under the terms of the MIT License; see LICENSE file for more details.

"""Search utilities."""

import re

from elasticsearch_dsl import A, Q
from flask import current_app, g, has_request_context, request
from flask_login import current_user
from invenio_circulation.proxies import current_circulation
from invenio_circulation.search.api import LoansSearch, search_by_pid

from invenio_app_ils.errors import SearchQueryError, UnauthorizedSearchError
from invenio_app_ils.permissions import backoffice_permission


class IlsLoansSearch(LoansSearch):
    """LoanSearch to filter loans."""

    def get_pending_loans_by_doc_pid(self, document_pid):
        """Return any pending loans for the given document."""
        return search_by_pid(
            document_pid=document_pid,
            filter_states=["PENDING"]
        )

    def get_active_loans_by_doc_pid(self, document_pid):
        """Return any active loans for the given document."""
        return search_by_pid(
            document_pid=document_pid,
            filter_states=current_app.config.get(
                "CIRCULATION_STATES_LOAN_ACTIVE", []
            ),
        )

    def get_past_loans_by_doc_pid(self, document_pid):
        """Return any past loans for the given document."""
        return search_by_pid(
            document_pid=document_pid,
            filter_states=current_app.config.get(
                "CIRCULATION_STATES_LOAN_COMPLETED", []
            ),
        )

    def get_loan_next_available_date(self, document_pid):
        """Return active loans on document sorted by the earliest end date."""
        return search_by_pid(
            document_pid=document_pid,
            filter_states=current_app.config.get(
                "CIRCULATION_STATES_LOAN_ACTIVE", []
            ),
            sort_by_field="end_date",
        )

    def get_active_loan_by_item_pid(self, item_pid):
        """Return any active loans for the given item."""
        return search_by_pid(
            item_pid=item_pid,
            filter_states=current_app.config.get(
                "CIRCULATION_STATES_LOAN_ACTIVE", []
            ),
        )

    def get_overdue_loans_by_doc_pid(self, document_pid):
        """Return any overdue loans for the given document."""
        return search_by_pid(
            document_pid=document_pid,
            filter_states=current_app.config.get(
                "CIRCULATION_STATES_LOAN_ACTIVE", []
            ),
        ).filter('range', end_date=dict(lt='now/d'))

    def get_most_loaned_documents(self, from_date, to_date, bucket_size):
        """Return aggregation of document_pids with most loans."""
        search = current_circulation.loan_search

        # Query
        states = current_app.config["CIRCULATION_STATES_LOAN_ACTIVE"] + \
            current_app.config["CIRCULATION_STATES_LOAN_COMPLETED"]

        from_date = from_date or None
        to_date = to_date or None

        search = search.query("bool", must=[
            Q("terms", state=states),
            Q("range", start_date=dict(gte=from_date, lte=to_date)),
        ])

        # Aggregation with sub-aggregation to calculate the extension count sum
        aggs = A("terms", field="document_pid", size=bucket_size)
        aggs = aggs.metric(
            "extensions",
            "sum",
            field="extension_count"
        )
        search.aggs.bucket("most_loaned_documents", aggs)

        # No need for the loan hits
        search = search[:0]

        return search

    class Meta:
        """Define permissions filter."""

        index = "loans"
        doc_types = None


def circulation_search_factory(self, search, query_parser=None):
    """Parse query using elasticsearch DSL query.

    :param self: REST view.
    :param search: Elastic search DSL search instance.
    :returns: Tuple with search instance and URL arguments.
    """
    def _default_parser(qstr=None):
        """Return default parser that uses the Q() from elasticsearch_dsl."""
        if qstr:
            return Q('query_string', query=qstr)
        return Q()

    from invenio_records_rest.facets import default_facets_factory
    from invenio_records_rest.sorter import default_sorter_factory

    query_string = request.values.get('q', '')

    if not current_user.is_authenticated:
        raise UnauthorizedSearchError(query_string)

    parser = query_parser or _default_parser
    query = parser(qstr=query_string)

    # if the logged in user in not librarian or admin, validate the query
    if has_request_context() and not backoffice_permission().allows(g.identity):
        # patron can find only his loans
        if not query_string:
            # force query to be patron_pid:<logged in user>
            only_patron_loans = 'patron_pid:{}'.format(g.identity.id)
            query = _default_parser(qstr=only_patron_loans)
        else:
            # check for patron_pid query value
            match = re.match(r"patron_pid:(?P<pid>\d)", query_string)
            if match and match.group('pid') != str(g.identity.id):
                raise UnauthorizedSearchError(query_string, g.identity.id)
    try:
        search = search.query(query)
    except SyntaxError:
        raise SearchQueryError(query_string)

    search_index = search._index[0]
    search, urlkwargs = default_facets_factory(search, search_index)
    search, sortkwargs = default_sorter_factory(search, search_index)
    for key, value in sortkwargs.items():
        urlkwargs.add(key, value)

    urlkwargs.add('q', query_string)
    return search, urlkwargs
