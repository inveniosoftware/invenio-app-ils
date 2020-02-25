# -*- coding: utf-8 -*-
#
# Copyright (C) 2020 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""ILS search permissions."""

import re

from elasticsearch_dsl import Q
from flask import current_app, g, has_request_context, request
from flask_login import current_user

from invenio_app_ils.errors import SearchQueryError, UnauthorizedSearchError
from invenio_app_ils.permissions import backoffice_permission


def _get_user_provides():
    """Extract the user's provides from g."""
    provides = []
    for need in g.identity.provides:
        try:
            provides.append(need.value.lower())
        except AttributeError:
            # Add the user ID (integer) to the list
            provides.append(need.value)
    return provides


def search_filter_record_permissions():
    """Filter list of results by `_access` and `restricted` fields."""
    if not has_request_context() or backoffice_permission().allows(g.identity):
        return Q()

    # A record is public if `restricted` field False or missing
    restricted_field_missing = ~Q("exists", field="restricted")
    is_restricted = restricted_field_missing | Q("term", restricted=False)

    combined_filter = is_restricted

    if current_app.config.get("ILS_RECORDS_EXPLICIT_PERMISSIONS_ENABLED"):
        # if `_access`, check `_access.read` against the user. It takes
        # precedence over `restricted`.
        # if not `_access`, check if open access as before.
        _access_field_exists = Q("exists", field="_access.read")
        provides = _get_user_provides()
        user_can_read = _access_field_exists & Q(
            "terms", **{"_access.read": provides}
        )
        combined_filter = user_can_read | (
            ~_access_field_exists & ~is_restricted
        )

    return Q("bool", filter=[combined_filter])


def _ils_search_factory(self, search, qs_validator):
    """Search factory with Query String validator.

    :param self: REST view.
    :param search: Elastic search DSL search instance.
    :returns: Tuple with search instance and URL arguments.
    """
    def query_parser(qstr=None):
        """Default parser that uses the Q() from elasticsearch_dsl."""
        if qstr:
            return Q('query_string', query=qstr)
        return Q()

    from invenio_records_rest.facets import default_facets_factory
    from invenio_records_rest.sorter import default_sorter_factory

    query_string = request.values.get("q")

    query = query_parser(qs_validator(query_string))

    try:
        search = search.query(query)
    except SyntaxError:
        raise SearchQueryError(query_string)

    search_index = search._index[0]
    search, urlkwargs = default_facets_factory(search, search_index)
    search, sortkwargs = default_sorter_factory(search, search_index)
    for key, value in sortkwargs.items():
        urlkwargs.add(key, value)

    urlkwargs.add("q", query_string)
    return search, urlkwargs


def search_factory_filter_by_patron(self, search):
    """Prepare query string to filter records by current logged in user."""
    def filter_by_patron(query_string):
        """Filter search results by patron_pid."""
        if not current_user.is_authenticated:
            raise UnauthorizedSearchError(query_string)

        # if the logged in user is not librarian or admin, validate the query
        if has_request_context() and not backoffice_permission().allows(
            g.identity
        ):
            # patron can find only his records
            if not query_string:
                # force query to be patron_pid:<logged in user>
                query_string = "patron_pid:{}".format(g.identity.id)
            else:
                # check for patron_pid query value
                match = re.match(r"patron_pid:(?P<pid>\d+)", query_string)
                if match and match.group("pid") != str(g.identity.id):
                    raise UnauthorizedSearchError(query_string, g.identity.id)
        return query_string

    return _ils_search_factory(self, search, filter_by_patron)
