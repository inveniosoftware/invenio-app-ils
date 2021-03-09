# -*- coding: utf-8 -*-
#
# Copyright (C) 2019 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""ILL search APIs."""

from invenio_search.api import RecordsSearch

from invenio_app_ils.errors import MissingRequiredParameterError


class BorrowingRequestsSearch(RecordsSearch):
    """Search for ILL borrowing requests."""

    class Meta:
        """Search only on borrowing requests index."""

        index = "ill_borrowing_requests"
        doc_types = None

    def search_by_document_pid(self, document_pid=None):
        """Search by document pid."""
        search = self

        if document_pid:
            search = search.filter("term", document_pid=document_pid)
        else:
            raise MissingRequiredParameterError(
                description="document_pid is required"
            )
        return search

    def search_by_patron_pid(self, patron_pid=None):
        """Search by patron pid."""
        search = self

        if patron_pid:
            search = search.filter("term", patron_pid=patron_pid)
        else:
            raise MissingRequiredParameterError(
                description="patron_pid is required"
            )
        return search

    def search_by_provider_pid(self, provider_pid=None):
        """Retrieve BorrowingRequests with the given provider_pid."""
        search = self

        if provider_pid:
            search = search.filter("term", provider_pid=provider_pid)
        else:
            raise MissingRequiredParameterError(
                description="provider_pid is required"
            )

        return search
