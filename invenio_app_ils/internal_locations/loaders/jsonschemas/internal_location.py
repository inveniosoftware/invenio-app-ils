# -*- coding: utf-8 -*-
#
# Copyright (C) 2018 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""Internal Location schema for marshmallow loader."""

from invenio_records_rest.schemas import RecordMetadataSchemaJSONV1
from marshmallow import EXCLUDE, fields


class InternalLocationSchemaV1(RecordMetadataSchemaJSONV1):
    """Internal Location schema."""

    class Meta:
        """Meta attributes for the schema."""

        unknown = EXCLUDE

    location_pid = fields.Str(required=True)
    name = fields.Str(required=True)
    notes = fields.Str()
    physical_location = fields.Str()
