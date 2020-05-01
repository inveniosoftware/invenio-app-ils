# -*- coding: utf-8 -*-
#
# Copyright (C) 2018-2020 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""Series schema for marshmallow loader."""

from invenio_records_rest.schemas import RecordMetadataSchemaJSONV1
from invenio_records_rest.schemas.fields import PersistentIdentifier
from marshmallow import EXCLUDE, Schema, fields, pre_load

from invenio_app_ils.documents.loaders.jsonschemas.document import AlternativeTitleSchema, \
    IdentifierSchema, InternalNoteSchema, UrlSchema
from invenio_app_ils.records.loaders.schemas.changed_by import ChangedBySchema, \
    set_changed_by
from invenio_app_ils.records.loaders.schemas.preserve_cover_metadata import \
    preserve_cover_metadata


class AccessUrlSchema(Schema):
    """Access urls schema."""

    class Meta:
        """Meta attributes for the schema."""

        unknown = EXCLUDE

    access_restriction = fields.Str()
    description = fields.Str()
    open_access = fields.Bool()
    value = fields.URL()


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
    cover_metadata = fields.Dict()
    created_by = fields.Nested(ChangedBySchema)
    edition = fields.Str()
    identifiers = fields.Nested(IdentifierSchema, many=True)
    internal_notes = fields.Nested(InternalNoteSchema, many=True)
    isbn = fields.List(fields.Str())
    issn = fields.Str()
    languages = fields.List(fields.Str())
    mode_of_issuance = fields.Str(required=True)
    note = fields.Str()
    pid = PersistentIdentifier()
    publication_year = fields.Str()
    publisher = fields.Str()
    title = fields.Str(required=True)
    updated_by = fields.Nested(ChangedBySchema)
    urls = fields.Nested(UrlSchema, many=True)

    @pre_load
    def preload_fields(self, data, **kwargs):
        """Automatically inject system fields."""
        record = self.context.get("record")
        data.update(set_changed_by(data, record))
        data.update(preserve_cover_metadata(data, record))
        return data
