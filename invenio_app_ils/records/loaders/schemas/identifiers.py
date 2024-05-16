# -*- coding: utf-8 -*-
#
# Copyright (C) 2024 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""Identifiers schema for marshmallow loader."""

from marshmallow import EXCLUDE, Schema, fields


class IdentifierSchema(Schema):
    """Identifier schema."""

    class Meta:
        """Meta attributes for the schema."""

        unknown = EXCLUDE

    material = fields.Str()
    scheme = fields.Str(required=True)
    value = fields.Str(required=True)
