# SPDX-FileCopyrightText: 2019-2020 CERN.
# SPDX-License-Identifier: MIT

"""Invenio App ILS acquisition loaders."""

from invenio_app_ils.records.loaders import ils_marshmallow_loader

from .jsonschemas.order import OrderSchemaV1

order_loader = ils_marshmallow_loader(OrderSchemaV1)
