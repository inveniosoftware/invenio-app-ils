# -*- coding: utf-8 -*-
#
# Copyright (C) 2018-2019 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""Search utilities."""

from invenio_search.api import RecordsSearch

from invenio_app_ils.errors import MissingRequiredParameterError


class DocumentSearch(RecordsSearch):
    """RecordsSearch for documents."""

    class Meta:
        """Search only on documents index."""

        index = "documents"
        doc_types = None

    def search_by_keyword_pid(self, keyword_pid=None, filter_states=None,
                              exclude_states=None):
        """Retrieve documents based on the given keyword pid."""
        search = self
        return KeywordSearch.filter_by_keyword_pid(
            search,
            keyword_pid,
            filter_states,
            exclude_states
        )

    def search_by_series_pid(self, series_pid=None):
        """Retrieve documents with the given series_pid."""
        search = self

        if series_pid:
            search = search.filter("term", series__series_pid=series_pid)
        else:
            raise MissingRequiredParameterError(
                description="series_pid is required"
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
            search = search.filter("terms", state=filter_states)
        elif exclude_states:
            search = search.filter("terms", state=exclude_states)

        return search

    def search_by_internal_location_pid(
        self,
        internal_location_pid=None,
        filter_states=None,
        exclude_states=None
    ):
        """Retrieve internal locations based on the given location pid."""
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
            search = search.filter("terms", state=filter_states)
        elif exclude_states:
            search = search.filter("terms", state=exclude_states)

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
            search = search.filter("terms", state=exclude_states)

        return search


class SeriesSearch(RecordsSearch):
    """RecordsSearch for series."""

    class Meta:
        """Search only on series index."""

        index = "series"
        doc_types = None

    def search_by_keyword_pid(self, keyword_pid=None, filter_states=None,
                              exclude_states=None):
        """Retrieve series with the given keyword pid."""
        search = self
        return KeywordSearch.filter_by_keyword_pid(
            search,
            keyword_pid,
            filter_states,
            exclude_states
        )


class PatronsSearch(RecordsSearch):
    """Search for patrons."""

    class Meta:
        """Search only on items index."""

        index = "patrons"
        doc_types = None


class KeywordSearch(RecordsSearch):
    """Search for keywords."""

    class Meta:
        """Search only on keywords index."""

        index = "keywords"
        doc_types = None

    @classmethod
    def filter_by_keyword_pid(cls, search, keyword_pid, filter_states=None,
                              exclude_states=None):
        """Filter a search by keyword PID."""
        if keyword_pid:
            search = search.filter("term", keyword_pids=keyword_pid)
        else:
            raise MissingRequiredParameterError(
                description="keyword_pid is required"
            )

        if filter_states:
            search = search.filter("terms", state=filter_states)
        elif exclude_states:
            search = search.filter("terms", state=exclude_states)

        return search
