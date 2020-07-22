# -*- coding: utf-8 -*-
#
# Copyright (C) 2020 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""ILS Items search APIs."""

from elasticsearch_dsl import A, Q
from invenio_search.api import RecordsSearch

from invenio_app_ils.errors import MissingRequiredParameterError
from invenio_app_ils.proxies import current_app_ils


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


def get_items_aggregated_by_statuses(document_pid):
    """Returns items aggregated by statuses for a given document."""
    # Query
    search_cls = current_app_ils.item_search_cls
    search = search_cls().filter("term", document_pid=document_pid)

    # Aggregation
    aggs = A("terms", field="status")
    search.aggs.bucket("statuses", aggs)

    return search

