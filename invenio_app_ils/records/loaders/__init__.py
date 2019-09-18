# -*- coding: utf-8 -*-
#
# Copyright (C) 2018-2019 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""Invenio App ILS loaders."""

from invenio_records_rest.loaders import marshmallow_loader

from .schemas.json.document import DocumentSchemaV1
from .schemas.json.document_request import DocumentRequestSchemaV1
from .schemas.json.internal_location import InternalLocationSchemaV1
from .schemas.json.items import EItemSchemaV1, ItemSchemaV1
from .schemas.json.location import LocationSchemaV1
from .schemas.json.series import SeriesSchemaV1
from .schemas.json.tag import TagSchemaV1

document_loader = marshmallow_loader(DocumentSchemaV1)
document_request_loader = marshmallow_loader(DocumentRequestSchemaV1)
eitem_loader = marshmallow_loader(EItemSchemaV1)
internal_location_loader = marshmallow_loader(InternalLocationSchemaV1)
item_loader = marshmallow_loader(ItemSchemaV1)
location_loader = marshmallow_loader(LocationSchemaV1)
series_loader = marshmallow_loader(SeriesSchemaV1)
tag_loader = marshmallow_loader(TagSchemaV1)
