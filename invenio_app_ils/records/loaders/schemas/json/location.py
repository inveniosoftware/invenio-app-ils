# -*- coding: utf-8 -*-
#
# Copyright (C) 2018 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""Location schema for marshmallow loader."""


from marshmallow import Schema, fields


class LocationSchemaV1(Schema):
    """Location schema."""

    name = fields.Str(required=True)
    email = fields.Email()
    address = fields.Str()
    phone = fields.Str()
    notes = fields.Str()
