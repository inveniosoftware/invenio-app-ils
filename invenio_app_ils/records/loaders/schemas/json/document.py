# -*- coding: utf-8 -*-
#
# Copyright (C) 2018-2019 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""Document schema for marshmallow loader."""

from invenio_records_rest.schemas import RecordMetadataSchemaJSONV1
from marshmallow import fields


class DocumentSchemaV1(RecordMetadataSchemaJSONV1):
    """Document schema."""

    authors = fields.Str()
    circulation = fields.Str()
    document_pid = fields.Str()
    keywords = fields.Str()
    tags = fields.List(fields.Str())
    title = fields.Str()
