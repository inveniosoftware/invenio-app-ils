# SPDX-FileCopyrightText: 2020 CERN.
# SPDX-License-Identifier: MIT

"""ILS Locations loaders."""

from invenio_app_ils.locations.loaders.jsonschemas.location import LocationSchemaV1
from invenio_app_ils.records.loaders import ils_marshmallow_loader

location_loader = ils_marshmallow_loader(LocationSchemaV1)
