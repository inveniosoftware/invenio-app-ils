# -*- coding: utf-8 -*-
#
# Copyright (C) 2018 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""Internal Location schema for marshmallow loader."""
from invenio_records_rest.schemas import RecordMetadataSchemaJSONV1
from invenio_records_rest.schemas.fields import PersistentIdentifier
from marshmallow import EXCLUDE, fields


class InternalLocationSchemaV1(RecordMetadataSchemaJSONV1):
    """Internal Location schema."""

    class Meta:
        """Meta attributes for the schema."""

        unknown = EXCLUDE

    pid = PersistentIdentifier()
    name = fields.Str(required=True)
    location_pid = fields.Str(required=True)
    physical_location = fields.Str()
    notes = fields.Str()
