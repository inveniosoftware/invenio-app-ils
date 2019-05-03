# -*- coding: utf-8 -*-
#
# Copyright (C) 2018-2019 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""Invenio App ILS loaders."""

from invenio_records_rest.loaders import marshmallow_loader

from .schemas.json.document import DocumentSchemaV1
from .schemas.json.internal_location import InternalLocationSchemaV1
from .schemas.json.items import EItemSchemaV1, ItemSchemaV1
from .schemas.json.keyword import KeywordSchemaV1
from .schemas.json.location import LocationSchemaV1
from .schemas.json.series import SeriesSchemaV1

document_loader = marshmallow_loader(DocumentSchemaV1)
item_loader = marshmallow_loader(ItemSchemaV1)
eitem_loader = marshmallow_loader(EItemSchemaV1)
location_loader = marshmallow_loader(LocationSchemaV1)
internal_location_loader = marshmallow_loader(InternalLocationSchemaV1)
keyword_loader = marshmallow_loader(KeywordSchemaV1)
series_loader = marshmallow_loader(SeriesSchemaV1)
