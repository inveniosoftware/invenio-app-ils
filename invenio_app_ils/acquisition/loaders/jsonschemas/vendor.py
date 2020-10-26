# -*- coding: utf-8 -*-
#
# Copyright (C) 2019-2020 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""Vendor schema for marshmallow loader."""

from invenio_records_rest.schemas import RecordMetadataSchemaJSONV1
from marshmallow import EXCLUDE, fields


class VendorSchemaV1(RecordMetadataSchemaJSONV1):
    """Vendor schema."""

    class Meta:
        """Meta attributes for the schema."""

        unknown = EXCLUDE

    address = fields.Str()
    email = fields.Email()
    legacy_id = fields.Str()
    name = fields.Str(required=True)
    notes = fields.Str()
    phone = fields.Str()
