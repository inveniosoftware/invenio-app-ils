# -*- coding: utf-8 -*-
#
# Copyright (C) 2020 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""Price schema for marshmallow loader."""

from marshmallow import EXCLUDE, Schema, fields


class PriceSchema(Schema):
    """Price schema."""

    class Meta:
        """Meta attributes for the schema."""

        unknown = EXCLUDE

    currency = fields.Str(required=True)
    value = fields.Number(required=True)
