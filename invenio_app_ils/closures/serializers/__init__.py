# -*- coding: utf-8 -*-
#
# This file is part of Invenio.
# Copyright (C) 2025-2025 CERN.
#
# Invenio is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.


from invenio_app_ils.closures.serializers.response import closure_periods_responsify
from invenio_app_ils.closures.serializers.schema import ClosurePeriodsV1


closure_periods_response = closure_periods_responsify(
    ClosurePeriodsV1, "application/json"
)
