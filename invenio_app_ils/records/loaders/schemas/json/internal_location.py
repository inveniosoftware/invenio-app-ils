# -*- coding: utf-8 -*-
#
# Copyright (C) 2018 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""Internal Location schema for marshmallow loader."""
from invenio_records_rest.schemas import RecordSchemaJSONV1
from invenio_records_rest.schemas.fields import PersistentIdentifier
from marshmallow import fields


class InternalLocationSchemaV1(RecordSchemaJSONV1):
    """Internal Location schema."""

    pid = PersistentIdentifier()
    location_pid = fields.Str(required=True)
    legacy_id = fields.Str()
    name = fields.Str()
    physical_location = fields.Str()
    notes = fields.Str()
