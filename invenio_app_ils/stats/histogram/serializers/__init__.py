# SPDX-FileCopyrightText: 2025-2025 CERN.
# SPDX-License-Identifier: MIT

"""Invenio App ILS histogram stats serializers."""

from invenio_app_ils.stats.histogram.serializers.response import (
    histogram_stats_responsify,
)
from invenio_app_ils.stats.histogram.serializers.schema import HistogramStatsV1

histogram_stats_response = histogram_stats_responsify(
    HistogramStatsV1, "application/json"
)
