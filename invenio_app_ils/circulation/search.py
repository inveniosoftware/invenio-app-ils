# -*- coding: utf-8 -*-
#
# Copyright (C) 2018 CERN.
# Copyright (C) 2018 RERO.
#
# Invenio-Circulation is free software; you can redistribute it and/or modify
# it under the terms of the MIT License; see LICENSE file for more details.

"""Search utilities."""

import re
from flask import abort, current_app, g, request

from elasticsearch_dsl.query import Bool, Q

from invenio_circulation.search import LoansSearch
from invenio_app_ils.permissions import allow_librarians
from invenio_search.api import RecordsSearch, DefaultFilter


def loan_permission_filter():
    """Filter loans by owner."""
    if allow_librarians().allows(g.identity):
        return Q()

    # Filter loans where the user is owner
    return Q('match', **{'patron_pid': g.identity.id})


class IlsLoansSearch(LoansSearch):
    """LoanSearch to filter loans."""

    class Meta:
        index = "loans"
        doc_types = None
        default_filter = DefaultFilter(loan_permission_filter)


class UnauthorizedSearch(Exception):
    """The user performing the search is not authorized."""


def circulation_search_factory(self, search, query_parser=None):
    """Parse query using elasticsearch DSL query.

    :param self: REST view.
    :param search: Elastic search DSL search instance.
    :returns: Tuple with search instance and URL arguments.
    """
    def _default_parser(qstr=None):
        """Default parser that uses the Q() from elasticsearch_dsl."""
        if qstr:
            return Q('query_string', query=qstr)
        return Q()

    def _(query_patron_pid):
        """."""
        if query_patron_pid == str(g.identity):
            only_patron_loans = 'patron_pid:{}'.format(g.identity.id)
            return Q('query_string', query=only_patron_loans)
        else:
            raise UnauthorizedSearch()

    from invenio_records_rest.facets import default_facets_factory
    from invenio_records_rest.sorter import default_sorter_factory

    query_string = request.values.get('q', '')

    # check the rights of the current user logged in
    if allow_librarians().allows(g.identity):
        # admin/librarian can search anything
        query = _default_parser(query_string)
    else:
        # patron can find only his loans
        try:
            match = re.match(r"patron_pid:(?P<patron_pid>\d)", query_string)
            if match:
                query = _(match.group('patron_pid'))
            elif not query_string:
                # search by current logged in user
                query = _(str(g.identity.id))
            else:
                raise UnauthorizedSearch()
        except UnauthorizedSearch:
            current_app.logger.debug(
                "Search for `{0}` not allowed by `patron_pid:{1}`".format(
                    query_string, str(g.identity.id)
            ))
            abort(403)

    try:
        search = search.query(query)
    except SyntaxError:
        current_app.logger.debug(
            "Failed parsing query: {0}".format(query_string), exc_info=True)
        raise InvalidQueryRESTError()

    search_index = search._index[0]
    search, urlkwargs = default_facets_factory(search, search_index)
    search, sortkwargs = default_sorter_factory(search, search_index)
    for key, value in sortkwargs.items():
        urlkwargs.add(key, value)

    urlkwargs.add('q', query_string)
    return search, urlkwargs
