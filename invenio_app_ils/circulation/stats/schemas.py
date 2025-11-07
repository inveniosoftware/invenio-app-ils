# -*- coding: utf-8 -*-
#
# Copyright (C) 2025 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""Marshmallow schemas for loan statistics validation."""

import json
import re

from marshmallow import (
    Schema,
    ValidationError,
    fields,
    pre_load,
    validate,
    validates_schema,
)

from invenio_app_ils.errors import InvalidParameterError

_OS_VALID_FIELD_NAME_PATTERN = re.compile(r"^[A-Za-z0-9_.]+$")
_OS_NATIVE_AGGREGATE_FUNCTION_TYPES = {"avg", "sum", "min", "max"}
_VALID_AGGREGATE_FUNCTION_TYPES = _OS_NATIVE_AGGREGATE_FUNCTION_TYPES.union({"median"})
_VALID_DATE_INTERVALS = {"1d", "1w", "1M", "1q", "1y"}


def validate_field_name(field_name):
    """Validate a field name for search to prevent injection attacks.

    :param field_name: The field name to validate
    :raises InvalidParameterError: If field name is invalid or potentially malicious
    """
    if not _OS_VALID_FIELD_NAME_PATTERN.match(field_name):
        raise InvalidParameterError(
            description=(
                f"Invalid field name '{field_name}'. "
                "Field names may contain only alphanumeric characters, underscores, "
                "and dots."
            )
        )


class SecureFieldNameField(fields.String):
    """Marshmallow field that validates field names to prevent injection attacks."""

    def _deserialize(self, value, attr, data, **kwargs):
        """Deserialize and validate field name."""

        field_name = super()._deserialize(value, attr, data, **kwargs)
        validate_field_name(field_name)
        return field_name


class GroupByItemSchema(Schema):
    field = SecureFieldNameField(required=True)
    interval = fields.String(validate=validate.OneOf(_VALID_DATE_INTERVALS))

    @validates_schema
    def validate_date_fields(self, data, **kwargs):
        """Validate that date fields have an interval and non-date fields do not."""

        date_fields = self.context["date_fields"]
        field = data.get("field")
        interval = data.get("interval")
        if field in date_fields and not interval:
            raise ValidationError(
                {"interval": ["Interval is required for date fields."]}
            )
        if field not in date_fields and interval is not None:
            raise ValidationError(
                {"interval": ["Interval must not be provided for non-date fields."]}
            )


class MetricItemSchema(Schema):
    """Schema for validating a single metric item."""

    field = SecureFieldNameField(required=True)
    aggregation = fields.String(
        required=True, validate=validate.OneOf(_VALID_AGGREGATE_FUNCTION_TYPES)
    )


class HistogramParamsSchema(Schema):
    """Schema for validating the query string parameters for the histogram endpoint"""

    metrics = fields.List(fields.Nested(MetricItemSchema), required=False)
    group_by = fields.List(
        fields.Nested(GroupByItemSchema), required=True, validate=validate.Length(min=1)
    )
    q = fields.String()

    def __init__(self, date_fields, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.context = {"date_fields": set(date_fields)}

    @pre_load
    def parse_query_string(self, data, **kwargs):
        """Parse the metrics and group_by parameters from JSON strings."""

        try:
            for key in ("metrics", "group_by"):
                # default value as the field "metrics" is not required
                data[key] = json.loads(data.get(key, "[]"))
        except Exception as e:
            raise ValidationError from e
        return data
