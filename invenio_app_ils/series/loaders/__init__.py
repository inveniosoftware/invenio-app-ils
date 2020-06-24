# -*- coding: utf-8 -*-
#
# Copyright (C) 2020 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""ILS series loaders."""

from invenio_app_ils.records.loaders import ils_marshmallow_loader

from .jsonschemas.series import SeriesSchemaV1

series_loader = ils_marshmallow_loader(SeriesSchemaV1)
