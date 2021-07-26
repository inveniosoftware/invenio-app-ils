# -*- coding: utf-8 -*-
#
# Copyright (C) 2020 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""EItems schema for marshmallow loader."""

from invenio_records_rest.schemas import RecordMetadataSchemaJSONV1
from marshmallow import EXCLUDE, Schema, fields, pre_load

from invenio_app_ils.documents.loaders.jsonschemas.document import (
    IdentifierSchema,
)
from invenio_app_ils.records.loaders.schemas.changed_by import (
    ChangedBySchema,
    set_changed_by,
)


class URLSchema(Schema):
    """URL schema."""

    class Meta:
        """Meta attributes for the schema."""

        unknown = EXCLUDE

    description = fields.Str()
    login_required = fields.Bool(missing=True)
    value = fields.URL(required=True)


class FileSchema(Schema):
    """File schema."""

    class Meta:
        """Meta attributes for the schema."""

        unknown = EXCLUDE

    bucket = fields.Str()
    checksum = fields.Str()
    file_id = fields.Str()
    key = fields.Str()
    size = fields.Int()
    version_id = fields.Str()


class EItemSchemaV1(RecordMetadataSchemaJSONV1):
    """EItem schema."""

    class Meta:
        """Meta attributes for the schema."""

        unknown = EXCLUDE

    bucket_id = fields.Str()
    created_by = fields.Nested(ChangedBySchema)
    description = fields.Str()
    document_pid = fields.Str(required=True)
    files = fields.List(fields.Nested(FileSchema))
    identifiers = fields.List(fields.Nested(IdentifierSchema))
    internal_notes = fields.Str()
    open_access = fields.Bool(missing=True)
    source = fields.Str()
    urls = fields.List(fields.Nested(URLSchema))

    @pre_load
    def set_changed_by(self, data, **kwargs):
        """Automatically set `created_by` and `updated_by`."""
        record = self.context.get("record")
        return set_changed_by(data, record)
