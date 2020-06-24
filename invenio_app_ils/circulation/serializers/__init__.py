# -*- coding: utf-8 -*-
#
# Copyright (C) 2020 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""Loan serializers."""

from invenio_records_rest.serializers.response import record_responsify, \
    search_responsify

from invenio_app_ils.records.schemas.json import ILSRecordSchemaJSONV1

from .csv import LoanCSVSerializer
from .json import LoanJSONSerializer

csv_v1 = LoanCSVSerializer(ILSRecordSchemaJSONV1)
"""CSV serializer"""

csv_v1_response = record_responsify(csv_v1, "text/csv")
"""CSV response builder that uses the CSV serializer"""

csv_v1_search = search_responsify(csv_v1, "text/csv")
"""CSV search response builder that uses the CSV serializer"""

json_v1 = LoanJSONSerializer(ILSRecordSchemaJSONV1, replace_refs=True)
"""JSON serializer."""

json_v1_response = record_responsify(json_v1, "application/json")
"""JSON response builder decorates loan."""

json_v1_search = search_responsify(json_v1, "application/json")
"""JSON response builder decorates loan."""
