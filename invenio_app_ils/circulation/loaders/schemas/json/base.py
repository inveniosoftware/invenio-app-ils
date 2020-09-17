# -*- coding: utf-8 -*-
#
# Copyright (C) 2019-2020 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify
# it under the terms of the MIT License; see LICENSE file for more details.

"""Invenio App ILS circulation base loader JSON schema."""

from flask import current_app
from invenio_rest.serializer import BaseSchema as InvenioBaseSchema
from marshmallow import ValidationError, fields, validates


def transaction_location_pid_validator(value):
    """Validate transaction_location_pid field."""
    transaction_location_is_valid = current_app.config[
        "CIRCULATION_TRANSACTION_LOCATION_VALIDATOR"
    ]
    if not transaction_location_is_valid(value):
        raise ValidationError(
            "The loan `transaction_location_pid` is not valid.",
            "transaction_location_pid",
        )


class LoanBaseSchemaV1(InvenioBaseSchema):
    """Loan common schema."""

    class Meta:
        """Meta attributes for the schema."""

        from marshmallow import EXCLUDE

        unknown = EXCLUDE

    document_pid = fields.Str(required=True)
    patron_pid = fields.Str(required=True)
    pickup_location_pid = fields.Str()
    transaction_location_pid = fields.Str(required=True)

    @validates("transaction_location_pid")
    def validate_transaction_location_pid(self, value, **kwargs):
        """Validate transaction_location_pid field."""
        transaction_location_pid_validator(value)
