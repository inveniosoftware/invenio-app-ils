# -*- coding: utf-8 -*-
#
# Copyright (C) 2018-2019 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""Ils serializers."""

from invenio_records_rest.serializers.csv import CSVSerializer
from invenio_records_rest.serializers.json import JSONSerializer

from invenio_app_ils.records.serializers.item import ItemJSONSerializer
from invenio_app_ils.schemas.json import ILSRecordSchemaJSONV1

from invenio_records_rest.serializers.response import (  # isort:skip
    record_responsify,
    search_responsify,
)


csv_v1 = CSVSerializer(ILSRecordSchemaJSONV1, csv_excluded_fields=[])
"""CSV serializer"""

csv_v1_response = record_responsify(csv_v1, "text/csv")
"""CSV response builder that uses the CSV serializer"""

csv_v1_search = search_responsify(csv_v1, "text/csv")
"""CSV search response builder that uses the CSV serializer"""

json_v1 = JSONSerializer(ILSRecordSchemaJSONV1, replace_refs=True)
"""JSON v1 serializer."""

json_v1_response = record_responsify(json_v1, "application/json")
"""JSON response builder that uses the JSON v1 serializer."""

json_v1_search = search_responsify(json_v1, "application/json")
"""JSON response builder that uses the JSON v1 serializer."""

item_v1 = ItemJSONSerializer(ILSRecordSchemaJSONV1, replace_refs=True)
"""Item v1 serializer."""

item_v1_response = record_responsify(item_v1, "application/json")
"""JSON response builder that filters item circulation status."""

item_v1_search = search_responsify(item_v1, "application/json")
"""JSON response builder that filters item circulation status."""
