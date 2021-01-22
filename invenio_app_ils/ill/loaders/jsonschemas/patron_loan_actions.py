# -*- coding: utf-8 -*-
#
# Copyright (C) 2020 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""Schema for Borrowing Request create loan action for marshmallow loader."""

import arrow
from invenio_circulation.records.loaders.schemas.json import DateString
from invenio_rest.serializer import BaseSchema as InvenioBaseSchema
from marshmallow import (
    EXCLUDE,
    ValidationError,
    fields,
    post_load,
    pre_load,
    validates,
)

from invenio_app_ils.circulation.loaders.schemas.json.base import (
    transaction_location_pid_validator,
)


class CreateLoanSchemaV1(InvenioBaseSchema):
    """Schema for Borrowing Request create loan action."""

    class Meta:
        """Meta attributes for the schema."""

        unknown = EXCLUDE

    loan_start_date = DateString(required=True)
    loan_end_date = DateString(required=True)
    transaction_location_pid = fields.Str(required=True)

    @pre_load
    def validate_statuses(self, data, **kwargs):
        """Validate status and that the loan does not exist yet."""
        record = self.context["record"]
        if record["status"] != "REQUESTED":
            raise ValidationError(
                "A loan can be created only when the borrowing request is in "
                "requested status."
            )

        loan_pid = record.get("patron_loan", {}).get("pid")
        if loan_pid:
            raise ValidationError(
                "This borrowing request {} has already a loan ({}).".format(
                    record["pid"], loan_pid
                )
            )
        return data

    @validates("loan_start_date")
    def validate_loan_start_date(self, value, **kwargs):
        """Validate loan_start_date field."""
        if arrow.get(value).date() < arrow.now().date():
            raise ValidationError(
                "The loan start date cannot be in the past.",
                "loan_start_date",
            )

    @validates("loan_end_date")
    def validate_loan_end_date(self, value, **kwargs):
        """Validate loan_end_date field."""
        if arrow.get(value).date() < arrow.now().date():
            raise ValidationError(
                "The loan end date cannot be in the past.",
                "loan_end_date",
            )

    @validates("transaction_location_pid")
    def validate_transaction_location_pid(self, value, **kwargs):
        """Validate transaction_location_pid field."""
        transaction_location_pid_validator(value)

    @post_load
    def postload_checks(self, data, **kwargs):
        """Validate dates values."""
        start = arrow.get(data["loan_start_date"]).date()
        end = arrow.get(data["loan_end_date"]).date()
        if end < start:
            raise ValidationError(
                {
                    "loan_start_date": [
                        "The loan start date cannot be after the end date."
                    ],
                    "loan_end_date": [
                        "The loan end date cannot be before the start date."
                    ],
                }
            )

        return data
