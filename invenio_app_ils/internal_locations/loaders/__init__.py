# SPDX-FileCopyrightText: 2020 CERN.
# SPDX-License-Identifier: MIT

"""ILS internal locations loaders."""

from invenio_app_ils.internal_locations.loaders.jsonschemas.internal_location import (  # noqa
    InternalLocationSchemaV1,
)
from invenio_app_ils.records.loaders import ils_marshmallow_loader

internal_location_loader = ils_marshmallow_loader(InternalLocationSchemaV1)
