# -*- coding: utf-8 -*-
#
# Copyright (C) 2020 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""ILS internal locations loaders."""

from invenio_app_ils.internal_locations.loaders.jsonschemas.internal_location import \
    InternalLocationSchemaV1
from invenio_app_ils.records.loaders import ils_marshmallow_loader

internal_location_loader = ils_marshmallow_loader(InternalLocationSchemaV1)
