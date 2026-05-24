# SPDX-FileCopyrightText: 2020 CERN.
# SPDX-License-Identifier: MIT

"""ILS items loaders."""

from invenio_app_ils.items.loaders.jsonschemas.items import ItemSchemaV1
from invenio_app_ils.records.loaders import ils_marshmallow_loader

item_loader = ils_marshmallow_loader(ItemSchemaV1)
