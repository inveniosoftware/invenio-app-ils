# -*- coding: utf-8 -*-
#
# Copyright (C) 2018 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""Internal Location schema for marshmallow loader."""


from marshmallow import Schema, fields


class InternalLocationSchemaV1(Schema):
    """Internal Location schema."""

    location_pid = fields.String(required=True)
    legacy_id = fields.Str()
    name = fields.Str()
    physical_location = fields.Str()
    notes = fields.Str()
