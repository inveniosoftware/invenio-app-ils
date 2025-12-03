# -*- coding: utf-8 -*-
#
# This file is part of Invenio.
# Copyright (C) 2025-2025 CERN.
#
# Invenio is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.


from invenio_app_ils.circulation.stats.serializers.response import loan_stats_responsify
from invenio_app_ils.circulation.stats.serializers.schema import HistogramStatsV1

loan_stats_response = loan_stats_responsify(HistogramStatsV1, "application/json")
