# -*- coding: utf-8 -*-
#
# Copyright (C) 2018 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""Search utilities."""

from elasticsearch_dsl.query import Bool, Q
from invenio_search.api import RecordsSearch


class DocumentSearch(RecordsSearch):
    """RecordsSearch for documents."""

    class Meta:
        """Search only on documents index."""

        index = 'documents'
        doc_types = None

class ItemSearch(RecordsSearch):
    """RecordsSearch for items."""

    class Meta:
        """Search only on items index."""

        index = 'items'
        doc_types = None

class LocationSearch(RecordsSearch):
    """RecordsSearch for locations."""

    class Meta:
        """Search only on locations index."""

        index = 'location'
        doc_types = None
