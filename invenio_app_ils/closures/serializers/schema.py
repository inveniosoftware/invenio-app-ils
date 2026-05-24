# SPDX-FileCopyrightText: 2025-2025 CERN.
# SPDX-License-Identifier: MIT

"""Invenio App ILS Closures response schemas."""

from marshmallow import Schema, fields


class DateRangeSchema(Schema):
    """Schema for a single closure period."""

    start = fields.Date(required=True, description="Start date of the closure period.")
    end = fields.Date(required=True, description="End date of the closure period.")


class ClosurePeriodsV1(Schema):
    """Schema for a list of closure periods."""

    closure_periods = fields.List(
        fields.Nested(DateRangeSchema),
        required=True,
        description="List of closure date periods.",
    )
