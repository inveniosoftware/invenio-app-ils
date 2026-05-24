# SPDX-FileCopyrightText: 2025-2025 CERN.
# SPDX-License-Identifier: MIT

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
