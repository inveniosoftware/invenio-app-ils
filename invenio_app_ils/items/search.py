# -*- coding: utf-8 -*-
#
# Copyright (C) 2020 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""ILS Items search APIs."""

from invenio_search.api import RecordsSearch

from invenio_app_ils.errors import MissingRequiredParameterError


class ItemSearch(RecordsSearch):
    """RecordsSearch for Item."""

    class Meta:
        """Search only on items index."""

        index = "items"
        doc_types = None

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
                **{"internal_location.location_pid": location_pid}
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
