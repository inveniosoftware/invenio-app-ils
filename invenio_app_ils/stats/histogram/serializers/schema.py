# -*- coding: utf-8 -*-
#
# This file is part of Invenio.
# Copyright (C) 2025-2025 CERN.
#
# Invenio is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""Invenio App ILS histogram stats serializers schema."""

from marshmallow import Schema, fields


class BucketSchema(Schema):
    """Schema for a single histogram bucket."""

    doc_count = fields.Int(required=True)
    key = fields.Dict(keys=fields.String(), values=fields.String())

    metrics = fields.Dict(
        keys=fields.String(),
        values=fields.Float(),
    )


class HistogramStatsV1(Schema):
    """Schema for a stats histogram response."""

    buckets = fields.List(
        fields.Nested(BucketSchema),
        required=True,
        description="Statistics buckets.",
    )
