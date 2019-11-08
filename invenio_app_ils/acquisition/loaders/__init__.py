# -*- coding: utf-8 -*-
#
# Copyright (C) 2019 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""Invenio App ILS acquisition loaders."""

from invenio_app_ils.records.loaders import ils_marshmallow_loader

from .schemas.json.order import OrderSchemaV1
from .schemas.json.vendor import VendorSchemaV1

order_loader = ils_marshmallow_loader(OrderSchemaV1)
vendor_loader = ils_marshmallow_loader(VendorSchemaV1)
