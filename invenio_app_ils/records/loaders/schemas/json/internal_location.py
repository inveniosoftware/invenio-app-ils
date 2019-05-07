# -*- coding: utf-8 -*-
#
# Copyright (C) 2018 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""Internal Location schema for marshmallow loader."""

from invenio_records_rest.schemas.fields import PersistentIdentifier
from marshmallow import Schema, fields

from invenio_app_ils.records.api import InternalLocation


class InternalLocationSchemaV1(Schema):
    """Internal Location schema."""

    def get_pid_field(self):
        """Return pid_field value."""
        return InternalLocation.pid_field

    pid = PersistentIdentifier()
    location_pid = fields.Str(required=True)
    legacy_id = fields.Str()
    name = fields.Str()
    physical_location = fields.Str()
    notes = fields.Str()
