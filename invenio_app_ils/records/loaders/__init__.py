# -*- coding: utf-8 -*-
#
# Copyright (C) 2018-2019 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""Invenio App ILS loaders."""

from invenio_records_rest.loaders import marshmallow_loader
from invenio_records_rest.loaders.marshmallow import MarshmallowErrors

from .schemas.json.internal_location import InternalLocationSchemaV1
from .schemas.json.items import EItemSchemaV1, ItemSchemaV1
from .schemas.json.location import LocationSchemaV1
from .schemas.json.series import SeriesSchemaV1


def ils_marshmallow_loader(schema_class):
    """Marshmallow loader for JSON requests."""
    def json_loader():
        try:
            return marshmallow_loader(schema_class)()
        except MarshmallowErrors as me:
            for error in me.errors:
                parent_path = [str(x) for x in error['parents']]
                error['field'] = '.'.join([*parent_path, error['field']])
            raise me

    return json_loader


eitem_loader = ils_marshmallow_loader(EItemSchemaV1)
internal_location_loader = ils_marshmallow_loader(InternalLocationSchemaV1)
item_loader = ils_marshmallow_loader(ItemSchemaV1)
location_loader = ils_marshmallow_loader(LocationSchemaV1)
series_loader = ils_marshmallow_loader(SeriesSchemaV1)
