# SPDX-FileCopyrightText: 2020 CERN.
# SPDX-License-Identifier: MIT

"""ILS document requests loaders."""

from invenio_app_ils.records.loaders import ils_marshmallow_loader

from .jsonschemas.document_request import DocumentRequestSchemaV1
from .jsonschemas.document_request_decline import DocumentRequestDeclineSchemaV1
from .jsonschemas.document_request_document import DocumentRequestDocumentSchemaV1
from .jsonschemas.document_request_provider import DocumentRequestProviderSchemaV1

document_request_loader = ils_marshmallow_loader(DocumentRequestSchemaV1)
document_request_document_loader = ils_marshmallow_loader(
    DocumentRequestDocumentSchemaV1
)
document_request_provider_loader = ils_marshmallow_loader(
    DocumentRequestProviderSchemaV1
)
document_request_decline_loader = ils_marshmallow_loader(DocumentRequestDeclineSchemaV1)
