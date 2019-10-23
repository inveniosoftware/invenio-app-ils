# -*- coding: utf-8 -*-
#
# Copyright (C) 2018-2019 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""Document schema for marshmallow loader."""

from invenio_records_rest.schemas import RecordMetadataSchemaJSONV1
from marshmallow import fields, Schema


class IdentifierSchema(Schema):
    """Identifier schema."""

    class Meta:
        """Meta attributes for the schema."""

        from marshmallow import EXCLUDE
        unknown = EXCLUDE

    scheme = fields.Str(required=True)
    value = fields.Str(required=True)


class AffiliationSchema(Schema):
    """Affiliation schema."""

    class Meta:
        """Meta attributes for the schema."""

        from marshmallow import EXCLUDE
        unknown = EXCLUDE

    name = fields.Str(required=True)
    identifiers = fields.List(fields.Nested(IdentifierSchema))


class AuthorSchema(Schema):
    """Author schema."""

    class Meta:
        """Meta attributes for the schema."""

        from marshmallow import EXCLUDE
        unknown = EXCLUDE

    full_name = fields.Str(required=True)
    type = fields.Str()
    affiliations = fields.List(fields.Nested(AffiliationSchema))
    alternative_names = fields.List(fields.Str())
    identifiers = fields.List(fields.Nested(IdentifierSchema))
    roles = fields.List(fields.Str())


class UrlSchema(Schema):
    """URL schema."""

    class Meta:
        """Meta attributes for the schema."""

        from marshmallow import EXCLUDE
        unknown = EXCLUDE

    value = fields.URL(required=True)
    description = fields.Str()


class DocumentSchemaV1(RecordMetadataSchemaJSONV1):
    """Document schema."""

    class Meta:
        """Meta attributes for the schema."""

        from marshmallow import EXCLUDE
        unknown = EXCLUDE

    abstract = fields.Str()
    alternative_abstracts = fields.List(fields.Str())
    authors = fields.List(fields.Nested(AuthorSchema), required=True)
    curated = fields.Bool()
    document_type = fields.Str()
    edition = fields.Str()
    note = fields.Str()
    number_of_pages = fields.Str()
    source = fields.Str()
    table_of_content = fields.List(fields.Str())
    tag_pids = fields.List(fields.Str())
    title = fields.Str(required=True)
    urls = fields.List(fields.Nested(UrlSchema))
