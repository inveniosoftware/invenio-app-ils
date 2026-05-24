# SPDX-FileCopyrightText: 2025 CERN.
# SPDX-License-Identifier: MIT

"""Invenio App ILS histogram statistics."""

from invenio_app_ils.stats.histogram.api import get_record_statistics
from invenio_app_ils.stats.histogram.schemas import HistogramParamsSchema
from invenio_app_ils.stats.histogram.views import create_histogram_view

__all__ = (
    "get_record_statistics",
    "HistogramParamsSchema",
    "create_histogram_view",
)
