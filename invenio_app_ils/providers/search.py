# SPDX-FileCopyrightText: 2018-2021 CERN.
# SPDX-License-Identifier: MIT

"""Providers search module."""

from invenio_search.api import RecordsSearch


class ProviderSearch(RecordsSearch):
    """Search for acquisition providers."""

    class Meta:
        """Search only on providers index."""

        index = "providers"
        doc_types = None
