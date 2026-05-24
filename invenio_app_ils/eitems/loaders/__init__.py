# SPDX-FileCopyrightText: 2020 CERN.
# SPDX-License-Identifier: MIT

"""ILS eitems loaders."""

from invenio_app_ils.records.loaders import ils_marshmallow_loader

from .jsonschemas.eitems import EItemSchemaV1

eitem_loader = ils_marshmallow_loader(EItemSchemaV1)
