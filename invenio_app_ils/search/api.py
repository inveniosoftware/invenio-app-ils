# -*- coding: utf-8 -*-
#
# Copyright (C) 2018-2019 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""Search utilities."""

import re

from elasticsearch_dsl import Q
from flask import g, has_request_context, request
from flask_login import current_user
from invenio_search.api import RecordsSearch

from invenio_app_ils.errors import MissingRequiredParameterError, \
    SearchQueryError, UnauthorizedSearchError
from invenio_app_ils.permissions import backoffice_permission


class DocumentSearch(RecordsSearch):
    """RecordsSearch for documents."""

    class Meta:
        """Search only on documents index."""

        index = "documents"
        doc_types = None

    def search_by_pid(self, *pids):
        """Retrieve documents with the given pid(s)."""
        return self.filter("terms", pid=pids)

    def search_by_tag_pid(self, tag_pid=None, filter_states=None,
                              exclude_states=None):
        """Retrieve documents based on the given tag pid."""
        search = self
        return TagSearch.filter_by_tag_pid(
            search,
            tag_pid,
            filter_states,
            exclude_states
        )

    def search_by_series_pid(self, series_pid=None):
        """Retrieve documents with the given series_pid."""
        search = self

        if series_pid:
            search = search.filter("term", series__pid=series_pid)
        else:
            raise MissingRequiredParameterError(
                description="series_pid is required"
            )

        return search

    def search_by_document_request_pid(self, document_request_pid=None):
        """Retrieve document requests with the given document_request_pid."""
        search = self

        if document_request_pid:
            search = search.filter("term", request__pid=document_request_pid)
        else:
            raise MissingRequiredParameterError(
                description="document_request_pid is required"
            )

        return search


class _ItemSearch(RecordsSearch):
    """Base search class for items."""

    def search_by_document_pid(self, document_pid=None, filter_states=None,
                               exclude_states=None):
        """Retrieve items based on the given document pid."""
        search = self

        if document_pid:
            search = search.filter("term", document_pid=document_pid)
        else:
            raise MissingRequiredParameterError(
                description="document_pid is required"
            )

        if filter_states:
            search = search.filter("terms", status=filter_states)
        elif exclude_states:
            search = search.exclude("terms", status=exclude_states)

        return search

    def search_by_internal_location_pid(
        self,
        internal_location_pid=None,
        filter_states=None,
        exclude_states=None
    ):
        """Retrieve items based on the given internal location pid."""
        search = self

        if internal_location_pid:
            search = search.filter(
                "term",
                internal_location_pid=internal_location_pid
            )
        else:
            raise MissingRequiredParameterError(
                description="internal_location_pid is required"
            )

        if filter_states:
            search = search.filter("terms", status=filter_states)
        elif exclude_states:
            search = search.exclude("terms", status=exclude_states)

        return search


    def search_by_location_pid(
        self,
        location_pid=None,
        filter_states=None,
        exclude_states=None
    ):
        """Retrieve items based on the given location pid."""
        search = self

        if location_pid:
            search = search.filter(
                "term",
                internal_location__location_pid=location_pid
            )
        else:
            raise MissingRequiredParameterError(
                description="location_pid is required"
            )

        if filter_states:
            search = search.filter("terms", status=filter_states)
        elif exclude_states:
            search = search.exclude("terms", status=exclude_states)

        return search


class ItemSearch(_ItemSearch):
    """RecordsSearch for Item."""

    class Meta:
        """Search only on items index."""

        index = "items"
        doc_types = None

    def get_unavailable_items_by_document_pid(self, document_pid):
        """Retrieve items that are unavailable for a loan."""
        return self.search_by_document_pid(
            document_pid,
            exclude_states=["CAN_CIRCULATE"]
        )

    def get_for_reference_only_by_document_pid(self, document_pid):
        """Retrieve items which are for reference only."""
        return self.search_by_document_pid(
            document_pid,
            filter_states=["FOR_REFERENCE_ONLY"]
        )


class EItemSearch(_ItemSearch):
    """RecordsSearch for EItem."""

    class Meta:
        """Search only on items index."""

        index = "eitems"
        doc_types = None


class LocationSearch(RecordsSearch):
    """RecordsSearch for locations."""

    class Meta:
        """Search only on locations index."""

        index = "locations"
        doc_types = None


class InternalLocationSearch(RecordsSearch):
    """RecordsSearch for internal locations."""

    class Meta:
        """Search only on internal locations index."""

        index = "internal_locations"
        doc_types = None

    def search_by_location_pid(self, location_pid=None, filter_states=None,
                               exclude_states=None):
        """Retrieve internal locations based on the given location pid."""
        search = self

        if location_pid:
            search = search.filter("term", location_pid=location_pid)
        else:
            raise MissingRequiredParameterError(
                description="location_pid is required"
            )

        if filter_states:
            search = search.filter("terms", state=filter_states)
        elif exclude_states:
            search = search.exclude("terms", state=exclude_states)

        return search


class SeriesSearch(RecordsSearch):
    """RecordsSearch for series."""

    class Meta:
        """Search only on series index."""

        index = "series"
        doc_types = None

    def search_by_tag_pid(self, tag_pid=None, filter_states=None,
                              exclude_states=None):
        """Retrieve series with the given tag pid."""
        search = self
        return TagSearch.filter_by_tag_pid(
            search,
            tag_pid,
            filter_states,
            exclude_states
        )


class PatronsSearch(RecordsSearch):
    """Search for patrons."""

    class Meta:
        """Search only on patrons index."""

        index = "patrons"
        doc_types = None


class TagSearch(RecordsSearch):
    """Search for tags."""

    class Meta:
        """Search only on tags index."""

        index = "tags"
        doc_types = None

    @classmethod
    def filter_by_tag_pid(cls, search, tag_pid, filter_states=None,
                              exclude_states=None):
        """Filter a search by tag PID."""
        if tag_pid:
            search = search.filter("term", tag_pids=tag_pid)
        else:
            raise MissingRequiredParameterError(
                description="tag_pid is required"
            )

        if filter_states:
            search = search.filter("terms", state=filter_states)
        elif exclude_states:
            search = search.exclude("terms", state=exclude_states)

        return search


class DocumentRequestSearch(RecordsSearch):
    """RecordsSearch for requests."""

    class Meta:
        """Search only on requests index."""

        index = "document_requests"
        doc_types = None

    def search_by_document_pid(self, document_pid=None, filter_states=None,
                               exclude_states=None):
        """Retrieve requests based on the given document pid."""
        search = self

        if document_pid:
            search = search.filter("term", document_pid=document_pid)
        else:
            raise MissingRequiredParameterError(
                description="document_pid is required"
            )

        if filter_states:
            search = search.filter("terms", state=filter_states)
        elif exclude_states:
            search = search.exclude("terms", state=exclude_states)

        return search


def filter_by_patron_search_factory(self, search, query_parser=None):
    """Filter search queries to only show records for the logged in patron.

    If the logged in  user has backoffice permissions do not filter by patron.

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
        # patron can find only his document requests
        if not query_string:
            # force query to be patron_pid:<logged in user>
            patron_pid_filter = 'patron_pid:{}'.format(g.identity.id)
            query = _default_parser(qstr=patron_pid_filter)
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
