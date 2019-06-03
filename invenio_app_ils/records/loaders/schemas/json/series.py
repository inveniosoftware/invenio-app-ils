# -*- coding: utf-8 -*-
#
# Copyright (C) 2018 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""Series schema for marshmallow loader."""

from invenio_records_rest.schemas.fields import PersistentIdentifier
from marshmallow import Schema, fields


class SeriesSchemaV1(Schema):
    """Series schema."""

    series_pid = PersistentIdentifier()
    mode_of_issuance = fields.Str()
    issn = fields.Str()
    title = fields.Str()
    authors = fields.Str()
