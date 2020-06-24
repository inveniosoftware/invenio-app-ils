# -*- coding: utf-8 -*-
#
# Copyright (C) 2020 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""ILS Locations search APIs."""

from invenio_search.api import RecordsSearch


class LocationSearch(RecordsSearch):
    """RecordsSearch for locations."""

    class Meta:
        """Search only on locations index."""

        index = "locations"
        doc_types = None
