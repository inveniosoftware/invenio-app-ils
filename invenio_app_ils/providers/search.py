# -*- coding: utf-8 -*-
#
# Copyright (C) 2018-2021 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""Providers search module."""

from invenio_search.api import RecordsSearch


class ProviderSearch(RecordsSearch):
    """Search for acquisition providers."""

    class Meta:
        """Search only on providers index."""

        index = "providers"
        doc_types = None
