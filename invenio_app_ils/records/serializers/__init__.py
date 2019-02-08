# -*- coding: utf-8 -*-
#
# Copyright (C) 2018 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""Ils serializers."""

from invenio_records_rest.schemas import RecordSchemaJSONV1
from invenio_records_rest.serializers.json import JSONSerializer
from invenio_records_rest.serializers.response import record_responsify

json_v1 = JSONSerializer(RecordSchemaJSONV1, replace_refs=True)
"""JSON v1 serializer."""

json_v1_response = record_responsify(json_v1, 'application/json')
"""JSON response builder that uses the JSON v1 serializer."""
