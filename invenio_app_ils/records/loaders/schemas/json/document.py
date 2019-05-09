# -*- coding: utf-8 -*-
#
# Copyright (C) 2018-2019 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""Document schema for marshmallow loader."""

from invenio_records_rest.schemas import RecordMetadataSchemaJSONV1
from marshmallow import fields

from invenio_app_ils.records.api import Document


class DocumentSchemaV1(RecordMetadataSchemaJSONV1):
    """Document schema."""

    def get_pid_field(self):
        """Return pid_field value."""
        return Document.pid_field

    document_pid = fields.Str()
    title = fields.Str()
    authors = fields.Str()
    circulation = fields.Str()
    keywords = fields.List(fields.Str())
