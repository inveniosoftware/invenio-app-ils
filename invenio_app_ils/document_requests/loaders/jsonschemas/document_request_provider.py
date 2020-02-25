# -*- coding: utf-8 -*-
#
# Copyright (C) 2020 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify
# it under the terms of the MIT License; see LICENSE file for more details.

"""Invenio App ILS Document Request Provider loader JSON schema."""

from invenio_records_rest.schemas import RecordMetadataSchemaJSONV1
from marshmallow import EXCLUDE, fields

from .document_request import PhysicalItemProviderSchema


class DocumentRequestProviderSchemaV1(RecordMetadataSchemaJSONV1):
    """Document Request Provider schema."""

    class Meta:
        """Meta attributes for the schema."""

        unknown = EXCLUDE

    physical_item_provider = fields.Nested(PhysicalItemProviderSchema)
