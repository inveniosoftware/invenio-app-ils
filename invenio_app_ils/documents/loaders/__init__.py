# -*- coding: utf-8 -*-
#
# Copyright (C) 2020 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""ILS document loaders."""

from invenio_app_ils.records.loaders import ils_marshmallow_loader

from .jsonschemas.document import DocumentSchemaV1

document_loader = ils_marshmallow_loader(DocumentSchemaV1)
