# -*- coding: utf-8 -*-
#
# Copyright (C) 2020 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""ILS Document Request search APIs."""

from invenio_search import RecordsSearch

from invenio_app_ils.errors import MissingRequiredParameterError


class DocumentRequestSearch(RecordsSearch):
    """RecordsSearch for requests."""

    class Meta:
        """Search only on requests index."""

        index = "document_requests"
        doc_types = None

    def search_by_document_pid(
        self, document_pid=None, filter_states=None, exclude_states=None
    ):
        """Retrieve requests based on the given document pid."""
        search = self

        if document_pid:
            search = search.filter("term", document_pid=document_pid)
        else:
            raise MissingRequiredParameterError(description="document_pid is required")

        if filter_states:
            search = search.filter("terms", state=filter_states)
        elif exclude_states:
            search = search.exclude("terms", state=exclude_states)

        return search

    def search_by_patron_pid(self, patron_pid=None):
        """Search by patron pid."""
        search = self

        if patron_pid:
            search = search.filter("term", patron_pid=patron_pid)
        else:
            raise MissingRequiredParameterError(description="patron_pid is required")
        return search
