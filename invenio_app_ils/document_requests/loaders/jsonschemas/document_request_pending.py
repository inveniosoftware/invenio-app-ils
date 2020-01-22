# -*- coding: utf-8 -*-
#
# Copyright (C) 2020 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify
# it under the terms of the MIT License; see LICENSE file for more details.

"""Invenio App ILS Document Request Pending loader JSON schema."""

from invenio_records_rest.schemas import RecordMetadataSchemaJSONV1
from marshmallow import EXCLUDE, fields


class DocumentRequestPendingSchemaV1(RecordMetadataSchemaJSONV1):
    """Document Request Pending schema."""

    class Meta:
        """Meta attributes for the schema."""

        unknown = EXCLUDE

    remove_fields = fields.List(fields.Str())
