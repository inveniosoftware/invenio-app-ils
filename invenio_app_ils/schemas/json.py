# -*- coding: utf-8 -*-
#
# Copyright (C) 2019 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""Invenio App ILS schemas."""
from invenio_rest.serializer import BaseSchema
from marshmallow import fields


class ILSRecordSchemaJSONV1(BaseSchema):
    """Schema for records v1 in JSON."""

    id = fields.Str(attribute='pid.pid_value')
    metadata = fields.Raw()
    links = fields.Raw()
    created = fields.Str()
    updated = fields.Str()
