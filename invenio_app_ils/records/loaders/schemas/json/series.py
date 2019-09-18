# -*- coding: utf-8 -*-
#
# Copyright (C) 2018 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""Series schema for marshmallow loader."""

from invenio_records_rest.schemas import RecordMetadataSchemaJSONV1
from invenio_records_rest.schemas.fields import PersistentIdentifier
from marshmallow import Schema, fields


class SeriesSchemaV1(RecordMetadataSchemaJSONV1):
    """Series schema."""

    class Meta:
        """Meta attributes for the schema."""

        from marshmallow import EXCLUDE
        unknown = EXCLUDE

    title = fields.Str(required=True)
    mode_of_issuance = fields.Str(required=True)
    pid = PersistentIdentifier()
    issn = fields.Str()
    isbn = fields.List(fields.Str())
    authors = fields.List(fields.Str())
    abstract = fields.Str()
    edition = fields.Str()
    languages = fields.List(fields.Str())
