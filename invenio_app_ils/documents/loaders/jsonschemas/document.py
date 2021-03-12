# -*- coding: utf-8 -*-
#
# Copyright (C) 2018-2020 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""Document schema for marshmallow loader."""

from flask import current_app
from invenio_records_rest.schemas import RecordMetadataSchemaJSONV1
from marshmallow import EXCLUDE, Schema, fields, pre_load, validate

from invenio_app_ils.documents.api import Document
from invenio_app_ils.records.loaders.schemas.changed_by import (
    ChangedBySchema,
    set_changed_by,
)
from invenio_app_ils.records.loaders.schemas.preserve_cover_metadata import (
    preserve_cover_metadata,
)


class IdentifierSchema(Schema):
    """Identifier schema."""

    class Meta:
        """Meta attributes for the schema."""

        unknown = EXCLUDE

    material = fields.Str()
    scheme = fields.Str(required=True)
    value = fields.Str(required=True)


class AffiliationSchema(Schema):
    """Affiliation schema."""

    class Meta:
        """Meta attributes for the schema."""

        unknown = EXCLUDE

    identifiers = fields.List(fields.Nested(IdentifierSchema))
    name = fields.Str(required=True)


class AuthorSchema(Schema):
    """Author schema."""

    class Meta:
        """Meta attributes for the schema."""

        unknown = EXCLUDE

    affiliations = fields.List(fields.Nested(AffiliationSchema))
    alternative_names = fields.List(fields.Str())
    full_name = fields.Str(required=True)
    identifiers = fields.List(fields.Nested(IdentifierSchema))
    roles = fields.List(fields.Str())
    type = fields.Str()


class UrlSchema(Schema):
    """URL schema."""

    class Meta:
        """Meta attributes for the schema."""

        unknown = EXCLUDE

    description = fields.Str()
    value = fields.URL(required=True)
    meta = fields.Str()


class AlternativeTitleSchema(Schema):
    """Alternative title schema."""

    class Meta:
        """Meta attributes for the schema."""

        unknown = EXCLUDE

    language = fields.Str()
    type = fields.Str()
    value = fields.Str(required=True)


class ConferenceInfoSchema(Schema):
    """Conference info schema."""

    class Meta:
        """Meta attributes for the schema."""

        unknown = EXCLUDE

    acronym = fields.Str()
    country = fields.Str()
    dates = fields.Str()
    identifiers = fields.List(fields.Nested(IdentifierSchema))
    place = fields.Str(required=True)
    series = fields.Str()
    title = fields.Str(required=True)
    year = fields.Int()


class CopyrightsSchema(Schema):
    """Copyright schema."""

    class Meta:
        """Meta attributes for the schema."""

        unknown = EXCLUDE

    holder = fields.Str()
    material = fields.Str()
    statement = fields.Str()
    url = fields.Str()
    year = fields.Int()


class ImprintSchema(Schema):
    """Imprint schema."""

    class Meta:
        """Meta attributes for the schema."""

        unknown = EXCLUDE

    date = fields.Str()
    place = fields.Str()
    publisher = fields.Str()
    reprint = fields.Str()


class InternalNoteSchema(Schema):
    """Internal note schema."""

    class Meta:
        """Meta attributes for the schema."""

        unknown = EXCLUDE

    field = fields.Str()
    user = fields.Str()
    value = fields.Str(required=True)


class KeywordSchema(Schema):
    """Keyword schema."""

    class Meta:
        """Meta attributes for the schema."""

        unknown = EXCLUDE

    source = fields.Str()
    value = fields.Str()


class SubjectSchema(Schema):
    """Subject schema."""

    class Meta:
        """Meta attributes for the schema."""

        unknown = EXCLUDE

    scheme = fields.Str(required=True)
    value = fields.Str(required=True)


class PublicationInfoSchema(Schema):
    """Publication info schema."""

    class Meta:
        """Meta attributes for the schema."""

        unknown = EXCLUDE

    artid = fields.Str()
    journal_issue = fields.Str()
    journal_title = fields.Str()
    journal_volume = fields.Str()
    note = fields.Str()
    pages = fields.Str()
    year = fields.Int()


class OpenDefinitionLicenseSchema(Schema):
    """Open definition license."""

    class Meta:
        """Meta attributes for the schema."""

        unknown = EXCLUDE

    id = fields.Str(required=True)


class LicenseSchema(Schema):
    """License schema."""

    class Meta:
        """Meta attributes for the schema."""

        unknown = EXCLUDE

    internal_notes = fields.Str()
    license = fields.Nested(OpenDefinitionLicenseSchema, required=True)
    material = fields.Str()


class DocumentSchemaV1(RecordMetadataSchemaJSONV1):
    """Document schema."""

    class Meta:
        """Meta attributes for the schema."""

        unknown = EXCLUDE

    abstract = fields.Str()
    alternative_abstracts = fields.List(fields.Str())
    alternative_identifiers = fields.List(fields.Nested(IdentifierSchema))
    alternative_titles = fields.List(fields.Nested(AlternativeTitleSchema))
    authors = fields.List(fields.Nested(AuthorSchema), required=True)
    conference_info = fields.List(fields.Nested(ConferenceInfoSchema))
    copyrights = fields.List(fields.Nested(CopyrightsSchema))
    cover_metadata = fields.Dict()
    created_by = fields.Nested(ChangedBySchema)
    curated = fields.Bool()
    document_type = fields.Str(
        required=True, validate=validate.OneOf(Document.DOCUMENT_TYPES)
    )
    edition = fields.Str()
    extensions = fields.Method("dump_extensions", "load_extensions")
    identifiers = fields.List(fields.Nested(IdentifierSchema))
    imprint = fields.Nested(ImprintSchema)
    internal_notes = fields.List(fields.Nested(InternalNoteSchema))
    keywords = fields.List(fields.Nested(KeywordSchema))
    languages = fields.List(fields.Str())
    licenses = fields.List(fields.Nested(LicenseSchema))
    note = fields.Str()
    number_of_pages = fields.Str()
    other_authors = fields.Bool()
    physical_description = fields.Str()
    publication_info = fields.List(fields.Nested(PublicationInfoSchema))
    publication_year = fields.Str(required=True)
    restricted = fields.Bool(missing=False)
    source = fields.Str()
    subjects = fields.List(fields.Nested(SubjectSchema))
    table_of_content = fields.List(fields.Str())
    tags = fields.List(fields.Str())
    title = fields.Str(required=True)
    updated_by = fields.Nested(ChangedBySchema)
    urls = fields.List(fields.Nested(UrlSchema))

    def dump_extensions(self, obj):
        """Dumps the extensions value.

        :params obj: content of the object's 'extensions' field
        """
        try:
            extensions_config = getattr(
                current_app.extensions["invenio-app-ils"],
                "document_metadata_extensions",
            )
        except AttributeError:
            return {}
        ExtensionSchema = extensions_config.to_schema()
        return ExtensionSchema().dump(obj)

    def load_extensions(self, value):
        """Loads the 'extensions' field.

        :params value: content of the input's 'extensions' field
        """
        try:
            extensions_config = getattr(
                current_app.extensions["invenio-app-ils"],
                "document_metadata_extensions",
            )
        except AttributeError:
            return {}
        ExtensionSchema = extensions_config.to_schema()
        return ExtensionSchema().load(value)

    @pre_load
    def preload_fields(self, data, **kwargs):
        """Automatically inject system fields."""
        record = self.context.get("record")
        data.update(set_changed_by(data, record))
        data.update(preserve_cover_metadata(data, record))
        return data
