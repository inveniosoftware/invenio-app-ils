# SPDX-FileCopyrightText: 2020 CERN.
# SPDX-License-Identifier: MIT

"""ILS document loaders."""

from invenio_app_ils.records.loaders import ils_marshmallow_loader

from .jsonschemas.document import DocumentSchemaV1

document_loader = ils_marshmallow_loader(DocumentSchemaV1)
