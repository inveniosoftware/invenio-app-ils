# -*- coding: utf-8 -*-
#
# Copyright (C) 2020 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""EItems schema for marshmallow loader."""

from invenio_records_rest.schemas import RecordMetadataSchemaJSONV1
from marshmallow import EXCLUDE, Schema, fields

from invenio_app_ils.documents.loaders.jsonschemas.document import \
    IdentifierSchema


class URLSchema(Schema):
    """URL schema."""

    class Meta:
        """Meta attributes for the schema."""

        unknown = EXCLUDE

    value = fields.URL(required=True)
    description = fields.Str()
    login_required = fields.Bool(missing=True)


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
    description = fields.Str()
    document_pid = fields.Str(required=True)  # TODO: validate
    files = fields.List(fields.Nested(FileSchema))
    internal_notes = fields.Str()
    identifiers = fields.List(fields.Nested(IdentifierSchema))
    open_access = fields.Bool(missing=True)
    urls = fields.List(fields.Nested(URLSchema))
