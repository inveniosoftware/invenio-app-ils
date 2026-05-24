# SPDX-FileCopyrightText: 2020 CERN.
# SPDX-License-Identifier: MIT

"""ILS Patrons search APIs."""

from invenio_search.api import RecordsSearch


class PatronsSearch(RecordsSearch):
    """Search for patrons."""

    class Meta:
        """Search only on patrons index."""

        index = "patrons"
        doc_types = None
