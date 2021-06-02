# -*- coding: utf-8 -*-
#
# Copyright (C) 2020 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""ILS Document search APIs."""

from invenio_search import RecordsSearch
from invenio_search.api import DefaultFilter

from invenio_app_ils.search_permissions import search_filter_record_permissions


class DocumentSearch(RecordsSearch):
    """RecordsSearch for documents."""

    boosted_fields = [
        "identifiers.value.text^12.0",
        "identifiers.value^12.0",
        "title^8.0",
        "authors.full_name^6.0",
        "imprint.publisher^4.0",
        "edition^4.0",
        "keywords^2.0",
        "abstract^2.0",
    ]

    class Meta:
        """Search only on documents index."""

        index = "documents"
        doc_types = None
        default_filter = DefaultFilter(search_filter_record_permissions)

    def search_by_pid(self, *pids):
        """Retrieve documents with the given pid(s)."""
        return self.filter("terms", pid=pids)
