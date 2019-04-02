# -*- coding: utf-8 -*-
#
# Copyright (C) 2018-2019 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""Item schema for marshmallow loader."""

from invenio_records_rest.schemas import RecordMetadataSchemaJSONV1
from marshmallow import fields


class DocumentSchemaV1(RecordMetadataSchemaJSONV1):
    """Document schema."""

    document_pid = fields.Str(required=True)
    title = fields.Str()
    authors = fields.Str()
    circulation = fields.Str()
    keywords = fields.List(fields.Str())
