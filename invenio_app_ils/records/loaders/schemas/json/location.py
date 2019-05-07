# -*- coding: utf-8 -*-
#
# Copyright (C) 2018 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""Location schema for marshmallow loader."""

from invenio_records_rest.schemas.fields import PersistentIdentifier
from marshmallow import Schema, fields

from invenio_app_ils.records.api import Location


class LocationSchemaV1(Schema):
    """Location schema."""

    def get_pid_field(self):
        """Return pid_field value."""
        return Location.pid_field

    pid = PersistentIdentifier()
    name = fields.Str(required=True)
    email = fields.Email()
    address = fields.Str()
    phone = fields.Str()
    notes = fields.Str()
