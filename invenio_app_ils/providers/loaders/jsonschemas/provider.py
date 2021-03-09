# -*- coding: utf-8 -*-
#
# Copyright (C) 2019-2021 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""Provider schema for marshmallow loader."""

from invenio_records_rest.schemas import RecordMetadataSchemaJSONV1
from marshmallow import EXCLUDE, fields


class ProviderSchemaV1(RecordMetadataSchemaJSONV1):
    """Provider schema."""

    class Meta:
        """Meta attributes for the schema."""

        unknown = EXCLUDE

    address = fields.Str()
    email = fields.Email()
    legacy_ids = fields.List(fields.Str())
    name = fields.Str(required=True)
    notes = fields.Str()
    phone = fields.Str()
    type = fields.Str(required=True)
