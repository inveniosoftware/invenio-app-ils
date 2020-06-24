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

    class Meta:
        """Search only on series index."""

        index = "series"
        doc_types = None
