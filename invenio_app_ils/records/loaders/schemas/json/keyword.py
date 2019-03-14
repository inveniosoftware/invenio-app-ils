# -*- coding: utf-8 -*-
#
# Copyright (C) 2019 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""Keyword schema for marshmallow loader."""

from invenio_records_rest.schemas.fields import PersistentIdentifier
from marshmallow import Schema, fields


class KeywordSchemaV1(Schema):
    """Keyword schema."""

    pid = PersistentIdentifier()
    name = fields.Str()
    provenance = fields.Str()
