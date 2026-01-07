# -*- coding: utf-8 -*-
#
# This file is part of Invenio.
# Copyright (C) 2025-2025 CERN.
#
# Invenio is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""Invenio App ILS histogram stats serializers."""

from invenio_app_ils.stats.histogram.serializers.response import (
    histogram_stats_responsify,
)
from invenio_app_ils.stats.histogram.serializers.schema import HistogramStatsV1

histogram_stats_response = histogram_stats_responsify(
    HistogramStatsV1, "application/json"
)
