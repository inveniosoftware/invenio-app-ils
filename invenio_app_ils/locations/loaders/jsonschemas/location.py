# -*- coding: utf-8 -*-
#
# Copyright (C) 2018 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""Location schema for marshmallow loader."""

import time

from invenio_records_rest.schemas import RecordMetadataSchemaJSONV1
from invenio_records_rest.schemas.fields import DateString
from marshmallow import (
    EXCLUDE,
    Schema,
    ValidationError,
    fields,
    post_load,
    validates,
    validates_schema,
)

_WEEKDAY_NAMES = [
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "sunday",
]
_WEEKDAY_INDICES = {weekday_name: i for i, weekday_name in enumerate(_WEEKDAY_NAMES)}


def validate_time(value):
    """Checks that a string is a valid HH:MM time."""
    try:
        time.strptime(value, "%H:%M")
    except ValueError:
        raise ValidationError("Invalid time format.")
    if len(value) != 5:
        raise ValidationError("Invalid time format, numbers must be padded.")


class OpeningHoursSchema(Schema):
    """Opening hours."""

    class Meta:
        """Meta attributes for the schema."""

        unknown = EXCLUDE

    end_time = fields.Str(required=True, validate=validate_time)
    start_time = fields.Str(required=True, validate=validate_time)

    @validates_schema
    def validate_times(self, data, **kwargs):
        """Validate time period."""
        if data["end_time"] < data["start_time"]:
            raise ValidationError(
                {
                    "start_time": ["Start time cannot happen after end time."],
                    "end_time": ["End time cannot happen before start time."],
                }
            )
        return data


class OpeningWeekdaySchema(Schema):
    """Opening weekday."""

    class Meta:
        """Meta attributes for the schema."""

        unknown = EXCLUDE

    is_open = fields.Bool(required=True)
    times = fields.List(fields.Nested(OpeningHoursSchema))
    weekday = fields.Str(required=True)

    @validates("weekday")
    def validate_weekday_name(self, value, **kwargs):
        """Validate weekday."""
        if value not in _WEEKDAY_NAMES:
            raise ValidationError("Illegal weekday name.", "weekday")

    @post_load
    def validate_times(self, data, **kwargs):
        """Validate times."""
        if data["is_open"]:
            if "times" not in data:
                raise ValidationError(
                    "Time periods must be defined on an opened weekday.",
                    "times",
                )
            times = data["times"]
            if len(times) == 0:
                raise ValidationError(
                    "At least one time period must be defined.", "times"
                )
            if len(times) > 2:
                raise ValidationError(
                    "At most two time periods can be defined.", "times"
                )
            times.sort(key=lambda period: period["start_time"])
            previous = None
            for current in times:
                if previous and previous["end_time"] >= current["start_time"]:
                    raise ValidationError("Time periods must not overlap.", "times")
                previous = current
        else:
            if "times" in data:
                raise ValidationError(
                    "Time periods cannot be defined on a closed weekday.",
                    "times",
                )
        return data


class OpeningExceptionSchema(Schema):
    """Opening exception."""

    class Meta:
        """Meta attributes for the schema."""

        unknown = EXCLUDE

    end_date = DateString(required=True)
    is_open = fields.Bool(required=True)
    start_date = DateString(required=True)
    title = fields.Str()

    @validates_schema
    def validate_dates(self, data, **kwargs):
        """Validate dates."""
        if data["end_date"] < data["start_date"]:
            raise ValidationError(
                {
                    "start_date": ["Start date cannot happen after end date."],
                    "end_date": ["End date cannot happen before start date."],
                }
            )
        return data


class LocationSchemaV1(RecordMetadataSchemaJSONV1):
    """Location schema."""

    address = fields.Str()
    email = fields.Email()
    name = fields.Str(required=True)
    notes = fields.Str()
    opening_exceptions = fields.List(fields.Nested(OpeningExceptionSchema))
    opening_weekdays = fields.List(fields.Nested(OpeningWeekdaySchema), required=True)
    phone = fields.Str()

    @post_load
    def postload_checks(self, data, **kwargs):
        """Sort exceptions and validate record."""
        weekdays = data["opening_weekdays"]
        new_weekdays = [None for _ in _WEEKDAY_NAMES]

        exists_open = False
        for weekday in weekdays:
            name = weekday["weekday"]
            exists_open = exists_open or weekday["is_open"]
            index = _WEEKDAY_INDICES[name]
            if new_weekdays[index]:
                raise ValidationError(
                    "There are two distinct configurations for the " "same weekday.",
                    "opening_weekdays",
                )
            new_weekdays[index] = weekday
        if len(weekdays) != len(new_weekdays):
            raise ValidationError(
                "A weekday configuration is missing.", "opening_weekdays"
            )
        if not exists_open:
            raise ValidationError(
                "At least one weekday must be declared as open.",
                "opening_weekdays",
            )

        exceptions = data.get("opening_exceptions", [])
        exceptions.sort(key=lambda ex: ex["start_date"])
        previous = None
        for exception in exceptions:
            if previous:
                if previous["end_date"] >= exception["start_date"]:
                    raise ValidationError(
                        "Exceptions must not overlap.", "opening_exceptions"
                    )
            previous = exception

        return data
