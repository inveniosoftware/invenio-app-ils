# -*- coding: utf-8 -*-
#
# Copyright (C) 2025 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""Invenio App ILS histogram statistics."""

from invenio_app_ils.stats.histogram.api import get_record_statistics
from invenio_app_ils.stats.histogram.schemas import HistogramParamsSchema
from invenio_app_ils.stats.histogram.views import create_histogram_view

__all__ = (
    "get_record_statistics",
    "HistogramParamsSchema",
    "create_histogram_view",
)
