# -*- coding: utf-8 -*-
#
# Copyright (C) 2018 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""Location schema for marshmallow loader."""

from invenio_records_rest.schemas import RecordMetadataSchemaJSONV1
from invenio_records_rest.schemas.fields import PersistentIdentifier
from marshmallow import fields


class LocationSchemaV1(RecordMetadataSchemaJSONV1):
    """Location schema."""

    pid = PersistentIdentifier()
    name = fields.Str(required=True)
    address = fields.Str()
    email = fields.Email()
    phone = fields.Str()
    notes = fields.Str()
