# -*- coding: utf-8 -*-
#
# Copyright (C) 2018 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""Series schema for marshmallow loader."""

from flask_login import current_user
from invenio_records_rest.schemas import RecordMetadataSchemaJSONV1
from invenio_records_rest.schemas.fields import PersistentIdentifier
from marshmallow import EXCLUDE, Schema, fields, pre_load, validate

from invenio_app_ils.documents.loaders.jsonschemas.document import AlternativeTitleSchema, \
    IdentifierSchema, InternalNoteSchema, UrlSchema
from invenio_app_ils.records.api import Series


class AccessUrlSchema(Schema):
    """Access urls schema."""

    class Meta:
        """Meta attributes for the schema."""

        unknown = EXCLUDE

    access_restriction = fields.Str()
    open_access = fields.Bool()
    description = fields.Str()
    value = fields.URL()


class ChangeBySchema(Schema):
    """Change by schema."""

    class Meta:
        """Meta attributes for the schema."""

        unknown = EXCLUDE

    type = fields.Str(required=True, validate=validate.OneOf(Series.CURATOR_TYPES))
    value = fields.Str()


class SeriesSchemaV1(RecordMetadataSchemaJSONV1):
    """Series schema."""

    class Meta:
        """Meta attributes for the schema."""

        unknown = EXCLUDE

    abbreviated_title = fields.Str()
    abstract = fields.Str()
    access_urls = fields.Nested(AccessUrlSchema, many=True)
    alternative_titles = fields.Nested(AlternativeTitleSchema, many=True)
    authors = fields.List(fields.Str())
    created_by = fields.Nested(ChangeBySchema)
    edition = fields.Str()
    identifiers = fields.Nested(IdentifierSchema, many=True)
    internal_notes = fields.Nested(InternalNoteSchema, many=True)
    isbn = fields.List(fields.Str())
    issn = fields.Str()
    languages = fields.List(fields.Str())
    mode_of_issuance = fields.Str(required=True)
    note = fields.Str()
    pid = PersistentIdentifier()
    publisher = fields.Str()
    title = fields.Str(required=True)
    updated_by = fields.Nested(ChangeBySchema)
    urls = fields.Nested(UrlSchema, many=True)

    @pre_load
    def add_created_by(self, data, **kwargs):
        """Automatically add the `created_by`."""
        record = self.context.get("record")

        if record:
            # updating
            if "created_by" in record:
                data["created_by"] = record["created_by"]
            data["updated_by"] = {"type": "user_id", "value": str(current_user.id)}
        else:
            # creating
            data["created_by"] = {"type": "user_id", "value": str(current_user.id)}

        return data
