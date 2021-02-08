# -*- coding: utf-8 -*-
#
# Copyright (C) 2020 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""ILS Series search APIs."""

from invenio_search.api import RecordsSearch


class SeriesSearch(RecordsSearch):
    """RecordsSearch for series."""

    boosted_fields = [
        "title^8",
        "authors^6",
        "imprint.publisher^4",
        "edition^4",
        "keywords^2",
        "abstract^2",
    ]

    class Meta:
        """Search only on series index."""

        index = "series"
        doc_types = None
