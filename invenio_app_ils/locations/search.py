# SPDX-FileCopyrightText: 2020 CERN.
# SPDX-License-Identifier: MIT

"""ILS Locations search APIs."""

from invenio_search.api import RecordsSearch


class LocationSearch(RecordsSearch):
    """RecordsSearch for locations."""

    class Meta:
        """Search only on locations index."""

        index = "locations"
        doc_types = None
