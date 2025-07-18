# -*- coding: utf-8 -*-
#
# Copyright (C) 2019 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify
# it under the terms of the MIT License; see LICENSE file for more details.

"""Invenio App ILS circulation Loan Request loader JSON schema."""

from datetime import timedelta

import arrow
from flask import current_app
from invenio_circulation.records.loaders.schemas.json import DateString
from marshmallow import (
    Schema,
    ValidationError,
    fields,
    post_load,
    validates,
    validates_schema,
)

from invenio_app_ils.proxies import current_app_ils

from .base import LoanBaseSchemaV1


def request_start_date_default():
    """Set default value for request_start_date field."""
    return arrow.get().utcnow().date().isoformat()


def request_expire_date_default():
    """Set default value for request_expire_date field."""
    duration_days = current_app.config["ILS_CIRCULATION_LOAN_REQUEST_DURATION_DAYS"]
    duration = timedelta(days=duration_days)
    now = arrow.get().utcnow()
    return (now + duration).date().isoformat()


def get_offset_duration(request_start_date, location_pid, working_days_to_offset):
    location = current_app_ils.location_record_cls.get_record_by_pid(location_pid)

    weekdays = location["opening_weekdays"]
    exceptions = location["opening_exceptions"]
    disabled = set()

    date = request_start_date
    max_date = request_start_date + timedelta(
        days=current_app.config["ILS_CIRCULATION_LOAN_REQUEST_DURATION_DAYS"]
    )
    # Calculate all disabled days that need to be skipped
    # Used in calculating non-closure days to offset in post-load checks
    while date <= max_date:
        date_iso = date.date().isoformat()
        is_open = weekdays[date.weekday()]["is_open"]

        for exception in exceptions:
            start_date = arrow.get(exception["start_date"])
            end_date = arrow.get(exception["end_date"])

            if start_date <= arrow.get(date.date()) <= end_date:
                is_open = exception["is_open"]

        if not is_open:
            disabled.add(date_iso)

        date += timedelta(days=1)

    total_offset_days = 0
    date = request_start_date
    while working_days_to_offset > 0:
        date_iso = date.date().isoformat()
        if date_iso not in disabled:
            disabled.add(date_iso)
            working_days_to_offset -= 1
        date += timedelta(days=1)
        total_offset_days += 1

    return timedelta(days=total_offset_days)


class LoanRequestDeliverySchemaV1(Schema):
    """Loan common delivery Schema."""

    class Meta:
        """Meta attributes for the schema."""

        from marshmallow import EXCLUDE

        unknown = EXCLUDE

    method = fields.Str(required=True)

    @validates("method")
    def validate_method(self, value, **kwargs):
        """Validate the delivery method."""
        delivery_methods = list(
            current_app.config["ILS_CIRCULATION_DELIVERY_METHODS"].keys()
        )
        if value not in delivery_methods:
            raise ValidationError("Invalid loan request delivery method.")


class LoanRequestSchemaV1(LoanBaseSchemaV1):
    """Loan request schema."""

    delivery = fields.Nested(LoanRequestDeliverySchemaV1)
    request_expire_date = DateString(load_default=request_expire_date_default)
    request_start_date = DateString(load_default=request_start_date_default)

    @validates_schema()
    def validates_schema(self, data, **kwargs):
        """Validate schema fields."""
        delivery = data.get("delivery")
        # if delivery methods is configured, it has to be a mandatory field
        if (
            current_app.config.get("ILS_CIRCULATION_DELIVERY_METHODS", {})
            and not delivery
        ):
            raise ValidationError("Delivery is required.", "delivery")

        if current_app.config["ILS_CIRCULATION_LOAN_REQUEST_OFFSET"] < 0:
            raise ValidationError(
                {
                    "ILS_CIRCULATION_LOAN_REQUEST_OFFSET": [
                        "The minimum days after which a loan can start cannot be negative."
                    ]
                }
            )

    @post_load()
    def postload_checks(self, data, **kwargs):
        """Validate dates values."""
        start = arrow.get(data["request_start_date"]).date()
        end = arrow.get(data["request_expire_date"]).date()
        duration_days = current_app.config["ILS_CIRCULATION_LOAN_REQUEST_DURATION_DAYS"]
        duration = timedelta(days=duration_days)

        loan_request_offset = current_app.config["ILS_CIRCULATION_LOAN_REQUEST_OFFSET"]
        offset_with_closures = get_offset_duration(
            arrow.get(data["request_start_date"]),
            data["transaction_location_pid"],
            loan_request_offset,
        )

        if end < start:
            raise ValidationError(
                {
                    "request_start_date": (
                        "The request start date cannot be after the end date."
                    ),
                    "request_end_date": (
                        "The request end date cannot be before the start date."
                    ),
                }
            )
        elif end - start > duration:
            message = "The request duration cannot be longer than {} days.".format(
                duration_days
            )
            raise ValidationError(
                {
                    "request_start_date": [message],
                    "request_expire_date": [message],
                }
            )
        elif end - start < offset_with_closures:
            message = "The requested start date must be at least {} non-closure days from today.".format(
                loan_request_offset
            )
            raise ValidationError(
                {
                    "request_start_date": [message],
                }
            )
        return data
