# -*- coding: utf-8 -*-
#
# Copyright (C) 2019 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify
# it under the terms of the MIT License; see LICENSE file for more details.

"""Invenio App ILS circulation Loan Checkout loader JSON schema."""

import arrow
from flask import current_app
from invenio_circulation.records.loaders.schemas.json import (
    DateString,
    LoanItemPIDSchemaV1,
)
from marshmallow import ValidationError, fields, post_load, validates

from invenio_app_ils.permissions import check_permission

from .base import LoanBaseSchemaV1


class LoanCheckoutSchemaV1(LoanBaseSchemaV1):
    """Loan checkout schema."""

    item_pid = fields.Nested(LoanItemPIDSchemaV1, required=True)
    start_date = DateString()
    end_date = DateString()
    force = fields.Bool(load_default=False)

    @validates("force")
    def validate_force(self, value, **kwargs):
        """Validate that only librarian can perform a force checkout."""
        if value:
            # extra permission for force-checkout
            permission = current_app.config["ILS_VIEWS_PERMISSIONS_FACTORY"](
                "circulation-loan-force-checkout"
            )
            check_permission(permission)

    @post_load()
    def postload_checks(self, data, **kwargs):
        """Validate dates values."""
        if "end_date" in data and "start_date" not in data:
            raise ValidationError(
                "Start date is required when end date provided.",
                "start_date",
            )

        if "start_date" in data and "end_date" in data:
            start = arrow.get(data["start_date"]).date()
            end = arrow.get(data["end_date"]).date()
            if end < start:
                raise ValidationError(
                    {
                        "start_date": [
                            "The loan start date cannot be after the end date."
                        ],
                        "end_date": [
                            "The loan end date cannot" " be before the start date."
                        ],
                    }
                )

        return data
