# -*- coding: utf-8 -*-
#
# Copyright (C) 2018 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""Items schema for marshmallow loader."""

from invenio_records_rest.schemas import RecordMetadataSchemaJSONV1
from marshmallow import fields

from invenio_app_ils.records.api import EItem, Item


class ItemSchemaV1(RecordMetadataSchemaJSONV1):
    """Item schema."""

    def get_pid_field(self):
        """Return pid_field value."""
        return Item.pid_field

    document_pid = fields.Str(required=True)  # TODO: validate
    internal_location_pid = fields.Str(required=True)  # TODO: validate
    legacy_id = fields.Str()
    legacy_library_id = fields.Str()
    circulation_restriction = fields.Str()  # TODO: this should be an enum
    barcode = fields.Str()
    shelf = fields.Str()
    description = fields.Str()
    _internal_notes = fields.Str()
    medium = fields.Str()  # TODO: this should be an enum
    status = fields.Str()  # TODO: this should be an enum


class EItemSchemaV1(RecordMetadataSchemaJSONV1):
    """EItem schema."""

    def get_pid_field(self):
        """Return pid_field value."""
        return EItem.pid_field

    document_pid = fields.Str(required=True)  # TODO: validate
    description = fields.Str()
    _internal_notes = fields.Str()
    open_access = fields.Bool(default=True)
