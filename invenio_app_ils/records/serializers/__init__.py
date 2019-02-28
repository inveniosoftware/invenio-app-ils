# -*- coding: utf-8 -*-
#
# Copyright (C) 2018 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""Ils serializers."""

from invenio_records_rest.serializers.json import JSONSerializer
from invenio_records_rest.serializers.response import record_responsify
from invenio_records_rest.schemas import RecordSchemaJSONV1

from invenio_app_ils.records.serializers.json import \
    MultipleCheckoutJSONSerializer
from invenio_app_ils.records.serializers.response import responsify
from invenio_app_ils.records.serializers.schemas.json import \
    CustomMultipleLoansSchemaJSONV1

json_v1 = JSONSerializer(RecordSchemaJSONV1, replace_refs=True)
"""JSON v1 serializer."""

json_v1_response = record_responsify(json_v1, 'application/json')
"""JSON response builder that uses the JSON v1 serializer."""

json_v1_multiple_checkout = MultipleCheckoutJSONSerializer(
    CustomMultipleLoansSchemaJSONV1)
"""JSON multiple checkout serializer."""

json_v1_multiple_checkout_response = responsify(
    json_v1_multiple_checkout, json_v1, 'application/json')
"""JSON response builder using JSON multiple checkout serializer."""
