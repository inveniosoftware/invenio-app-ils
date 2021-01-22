# -*- coding: utf-8 -*-
#
# Copyright (C) 2020 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""Schema for Borrowing Request accept extension action."""

import arrow
from invenio_circulation.records.loaders.schemas.json import DateString
from invenio_rest.serializer import BaseSchema as InvenioBaseSchema
from marshmallow import EXCLUDE, ValidationError, fields, pre_load, validates

from invenio_app_ils.circulation.loaders.schemas.json.base import (
    transaction_location_pid_validator,
)
from invenio_app_ils.ill.api import BorrowingRequest


def validate_statuses(record):
    """Validate that the extension action can be performed."""
    if record["status"] != "ON_LOAN":
        raise ValidationError(
            "This interlibrary loan is currently not on loan."
        )

    ext_status = (
        record.get("patron_loan", {}).get("extension", {}).get("status")
    )
    # status = None is valid, no extension requested yet
    has_status = ext_status is not None
    is_valid = ext_status in BorrowingRequest.EXTENSION_STATUSES
    if has_status and not is_valid:
        # should never happen, a status that is not in the valid ones
        raise ValidationError(
            "The current extension status ({}) is invalid.".format(ext_status)
        )
    return ext_status


class RequestExtensionSchemaV1(InvenioBaseSchema):
    """Schema for Borrowing Request request extension action."""

    class Meta:
        """Meta attributes for the schema."""

        unknown = EXCLUDE

    @pre_load
    def validate_action(self, data=None, **kwargs):
        """Validate action."""
        no_payload = data is None
        if no_payload:
            # marshmallow needs a default empty payload
            data = {}
        record = self.context["record"]
        ext_status = validate_statuses(record)
        if ext_status == "PENDING":
            raise ValidationError(
                "An extension for this interlibrary loan has already been "
                "requested."
            )
        elif ext_status == "DECLINED":
            raise ValidationError(
                "Cannot request an extension for this interlibrary loan "
                "because the most recent extension request has been declined."
            )
        return data


class AcceptExtensionSchemaV1(InvenioBaseSchema):
    """Schema for Borrowing Request accept extension action."""

    class Meta:
        """Meta attributes for the schema."""

        unknown = EXCLUDE

    loan_end_date = DateString(required=True)
    transaction_location_pid = fields.Str(required=True)

    @pre_load
    def validate_action(self, data, **kwargs):
        """Validate action."""
        record = self.context["record"]
        ext_status = validate_statuses(record)
        if ext_status != "PENDING":
            raise ValidationError(
                "There is no extension request for this interlibrary loan."
            )
        return data

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


class DeclineExtensionSchemaV1(InvenioBaseSchema):
    """Schema for Borrowing Request decline extension action."""

    class Meta:
        """Meta attributes for the schema."""

        unknown = EXCLUDE

    @pre_load
    def validate_action(self, data=None, **kwargs):
        """Validate action."""
        no_payload = data is None
        if no_payload:
            # marshmallow needs a default empty payload
            data = {}
        record = self.context["record"]
        ext_status = validate_statuses(record)
        if ext_status != "PENDING":
            raise ValidationError(
                "There is no extension request for this interlibrary loan."
            )
        return data
