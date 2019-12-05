# -*- coding: utf-8 -*-
#
# Copyright (C) 2018-2019 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""Acquisition search module."""

from invenio_search.api import RecordsSearch


class VendorSearch(RecordsSearch):
    """Search for acquisition vendors."""

    class Meta:
        """Search only on vendors index."""

        index = "acq-vendors"
        doc_types = None


class OrderSearch(RecordsSearch):
    """Search for acquisition Acquisition orders."""

    class Meta:
        """Search only on orders index."""

        index = "acq-orders"
        doc_types = None
