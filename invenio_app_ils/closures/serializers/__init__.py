# SPDX-FileCopyrightText: 2025-2025 CERN.
# SPDX-License-Identifier: MIT


from invenio_app_ils.closures.serializers.response import closure_periods_responsify
from invenio_app_ils.closures.serializers.schema import ClosurePeriodsV1


closure_periods_response = closure_periods_responsify(
    ClosurePeriodsV1, "application/json"
)
