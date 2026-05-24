# SPDX-FileCopyrightText: 2020 CERN.
# SPDX-License-Identifier: MIT

"""Invenio App ILS Document Request Document loader JSON schema."""

from invenio_records_rest.schemas import RecordMetadataSchemaJSONV1
from marshmallow import EXCLUDE, fields


class DocumentRequestDocumentSchemaV1(RecordMetadataSchemaJSONV1):
    """Document Request Document schema."""

    class Meta:
        """Meta attributes for the schema."""

        unknown = EXCLUDE

    document_pid = fields.Str(required=True)
