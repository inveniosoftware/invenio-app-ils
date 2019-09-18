# -*- coding: utf-8 -*-
#
# Copyright (C) 2019 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""Keyword schema for marshmallow loader."""

from marshmallow import Schema, fields


class TagSchemaV1(Schema):
    """Keyword schema."""

    pid = fields.Str(required=True)
    name = fields.Str(required=True)
    provenance = fields.Str()
