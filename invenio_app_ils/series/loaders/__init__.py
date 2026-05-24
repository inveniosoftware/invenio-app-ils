# SPDX-FileCopyrightText: 2020 CERN.
# SPDX-License-Identifier: MIT

"""ILS series loaders."""

from invenio_app_ils.records.loaders import ils_marshmallow_loader

from .jsonschemas.series import SeriesSchemaV1

series_loader = ils_marshmallow_loader(SeriesSchemaV1)
