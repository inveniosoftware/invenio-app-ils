# -*- coding: utf-8 -*-
#
# Copyright (C) 2018-2019 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""Ils marshmallow schemas module."""
from invenio_records_rest.schemas import RecordSchemaJSONV1
from marshmallow import Schema, fields


class MultipleCheckoutErrorSchemaJSONV1(Schema):
    """Schema for handling multiple checkout response."""

    item_barcode = fields.Str()
    error_msg = fields.Str()
    error_code = fields.Str()


class CustomMultipleLoansSchemaJSONV1(Schema):
    """Schema for list of records v1 in JSON."""

    loans = fields.List(fields.Nested(RecordSchemaJSONV1))
    errors = fields.List(fields.Nested(MultipleCheckoutErrorSchemaJSONV1))
