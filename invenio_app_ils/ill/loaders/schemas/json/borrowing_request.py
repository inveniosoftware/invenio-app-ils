# -*- coding: utf-8 -*-
#
# Copyright (C) 2019 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""BorrowingRequest schema for marshmallow loader."""

from invenio_records_rest.schemas import RecordMetadataSchemaJSONV1
from marshmallow import EXCLUDE, fields


class BorrowingRequestSchemaV1(RecordMetadataSchemaJSONV1):
    """BorrowingRequest schema."""

    class Meta:
        """Meta attributes for the schema."""

        unknown = EXCLUDE

    cancel_reason = fields.Str()
    name = fields.Str(required=True)
    notes = fields.Str()
    library_pid = fields.Str(required=True)  # TODO: validate
    status = fields.Str(required=True)  # TODO: this should be an enum
