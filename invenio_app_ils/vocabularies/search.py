# -*- coding: utf-8 -*-
#
# Copyright (C) 2020 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""ILS Vocabularies search APIs."""

from invenio_search.api import RecordsSearch


class VocabularySearch(RecordsSearch):
    """Search for vocabularies."""

    class Meta:
        """Search only in vocabularies index."""

        index = "vocabularies"
        doc_types = None

    def search_by_type(self, type):
        """Search vocabularies by type."""
        return self.filter("term", type=type)

    def search_by_type_and_key(self, type, key):
        """Search vocabularies by type and key."""
        search = self.search_by_type(type)
        return search.filter("term", **{"key.keyword": key})
