# -*- coding: utf-8 -*-
#
# Copyright (C) 2019 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""ILL search APIs."""

from invenio_search.api import RecordsSearch

from invenio_app_ils.errors import MissingRequiredParameterError


class LibrarySearch(RecordsSearch):
    """Search for ILL libraries."""

    class Meta:
        """Search only on libraries index."""

        index = "ill-libraries"
        doc_types = None


class BorrowingRequestsSearch(RecordsSearch):
    """Search for ILL borrowing requests."""

    class Meta:
        """Search only on borrowing requests index."""

        index = "ill-borrowing-requests"
        doc_types = None

    def search_by_library_pid(self, library_pid=None):
        """Retrieve BorrowingRequests with the given library_pid."""
        search = self

        if library_pid:
            search = search.filter("term", library_pid=library_pid)
        else:
            raise MissingRequiredParameterError(
                description="library_pid is required"
            )

        return search
