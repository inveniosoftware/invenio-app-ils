# SPDX-FileCopyrightText: 2020 CERN.
# SPDX-License-Identifier: MIT

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
