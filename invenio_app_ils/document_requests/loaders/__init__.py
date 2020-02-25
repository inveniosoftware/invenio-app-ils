# -*- coding: utf-8 -*-
#
# Copyright (C) 2020 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""ILS document requests loaders."""

from invenio_app_ils.records.loaders import ils_marshmallow_loader

from .jsonschemas.document_request import DocumentRequestSchemaV1
from .jsonschemas.document_request_document import \
    DocumentRequestDocumentSchemaV1
from .jsonschemas.document_request_provider import \
    DocumentRequestProviderSchemaV1
from .jsonschemas.document_request_reject import DocumentRequestRejectSchemaV1

document_request_loader = ils_marshmallow_loader(DocumentRequestSchemaV1)
document_request_document_loader = ils_marshmallow_loader(DocumentRequestDocumentSchemaV1)
document_request_provider_loader = ils_marshmallow_loader(DocumentRequestProviderSchemaV1)
document_request_reject_loader = ils_marshmallow_loader(DocumentRequestRejectSchemaV1)
