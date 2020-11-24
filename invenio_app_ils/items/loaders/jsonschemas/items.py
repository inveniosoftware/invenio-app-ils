# -*- coding: utf-8 -*-
#
# Copyright (C) 2018 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""Items schema for marshmallow loader."""

from invenio_records_rest.schemas import RecordMetadataSchemaJSONV1
from marshmallow import EXCLUDE, Schema, fields, pre_load, validate

from invenio_app_ils.items.api import Item
from invenio_app_ils.records.loaders.schemas.changed_by import (
    ChangedBySchema, set_changed_by)
from invenio_app_ils.records.loaders.schemas.price import PriceSchema


class ISBNSchema(Schema):
    """ISBN schema."""

    class Meta:
        """Meta attributes for the schema."""

        unknown = EXCLUDE

    description = fields.Str()
    value = fields.Str(required=True)


class ItemSchemaV1(RecordMetadataSchemaJSONV1):
    """Item schema."""

    class Meta:
        """Meta attributes for the schema."""

        unknown = EXCLUDE

    acquisition_pid = fields.Str()
    barcode = fields.Str()
    created_by = fields.Nested(ChangedBySchema)
    circulation_restriction = fields.Str(
        required=True, validate=validate.OneOf(Item.CIRCULATION_RESTRICTIONS)
    )
    description = fields.Str()
    document_pid = fields.Str(required=True)  # TODO: validate
    internal_location_pid = fields.Str(required=True)  # TODO: validate
    internal_notes = fields.Str()
    isbns = fields.List(fields.Nested(ISBNSchema))
    legacy_id = fields.Str()
    legacy_library_id = fields.Str()
    medium = fields.Str(required=True)
    number_of_pages = fields.Int()
    physical_description = fields.Str()
    price = fields.Nested(PriceSchema)
    shelf = fields.Str()
    status = fields.Str(required=True, validate=validate.OneOf(Item.STATUSES))

    @pre_load
    def set_changed_by(self, data, **kwargs):
        """Automatically set `created_by` and `updated_by`."""
        record = self.context.get("record")
        return set_changed_by(data, record)
