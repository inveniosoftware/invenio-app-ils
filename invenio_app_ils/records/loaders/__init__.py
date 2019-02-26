# -*- coding: utf-8 -*-
#
# Copyright (C) 2018-2019 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""Invenio App ILS loaders."""

from .schemas.json.document import DocumentSchemaV1
from .schemas.json.item import ItemSchemaV1
from .schemas.json.location import LocationSchemaV1
from .schemas.json.internal_location import InternalLocationSchemaV1
from invenio_records_rest.loaders import marshmallow_loader

document_loader = marshmallow_loader(DocumentSchemaV1)
item_loader = marshmallow_loader(ItemSchemaV1)
location_loader = marshmallow_loader(LocationSchemaV1)
internal_location_loader = marshmallow_loader(InternalLocationSchemaV1)
