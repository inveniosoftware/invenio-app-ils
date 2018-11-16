# -*- coding: utf-8 -*-
#
# Copyright (C) 2018 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""Item schema for marshmallow loader."""

from invenio_records_rest.schemas.fields import PersistentIdentifier
from marshmallow import Schema, fields


class ItemSchemaV1(Schema):
    """Internal Location schema."""

    pid = PersistentIdentifier()
    document_pid = fields.Str(required=True)
    internal_location_pid = fields.Str(required=True)
    legacy_id = fields.Str()
    legacy_library_id = fields.Str()
    circulation_restriction = fields.Str()
    barcode = fields.Str()
    shelf = fields.Str()
    description = fields.Str()
    medium = fields.Str()
    status = fields.Str()
