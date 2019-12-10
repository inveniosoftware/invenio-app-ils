# -*- coding: utf-8 -*-
#
# Copyright (C) 2019 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""Library schema for marshmallow loader."""

from invenio_records_rest.schemas import RecordMetadataSchemaJSONV1
from marshmallow import EXCLUDE, fields


class LibrarySchemaV1(RecordMetadataSchemaJSONV1):
    """Library schema."""

    class Meta:
        """Meta attributes for the schema."""

        unknown = EXCLUDE

    name = fields.Str(required=True)
    notes = fields.Str()
