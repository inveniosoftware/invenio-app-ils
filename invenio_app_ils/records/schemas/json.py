# SPDX-FileCopyrightText: 2019 CERN.
# SPDX-License-Identifier: MIT

"""Invenio App ILS schemas."""

from invenio_records_rest.schemas.json import RecordSchemaJSONV1
from marshmallow import fields


class ILSRecordSchemaJSONV1(RecordSchemaJSONV1):
    """Schema for records v1 in JSON."""

    class Meta:
        """Meta attributes for the schema."""

        from marshmallow import EXCLUDE

        unknown = EXCLUDE

    id = fields.Str(attribute="pid.pid_value")
    metadata = fields.Raw()
    links = fields.Raw()
    created = fields.Str()
    updated = fields.Str()
