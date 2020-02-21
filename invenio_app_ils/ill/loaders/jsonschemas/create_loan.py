# -*- coding: utf-8 -*-
#
# Copyright (C) 2020 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""Schema for Borrowing Request create loan action for marshmallow loader."""

import arrow
from flask_babelex import lazy_gettext as _
from invenio_circulation.records.loaders.schemas.json import DateString
from invenio_records_rest.schemas import RecordMetadataSchemaJSONV1
from marshmallow import EXCLUDE, ValidationError, validates


class CreateLoanSchemaV1(RecordMetadataSchemaJSONV1):
    """Schema for Borrowing Request create loan action."""

    class Meta:
        """Meta attributes for the schema."""

        unknown = EXCLUDE

    loan_end_date = DateString(required=True)

    @validates("loan_end_date")
    def validate_loan_end_date(self, value, **kwargs):
        """Validate loan_end_date field."""
        if arrow.get(value) < arrow.now():
            raise ValidationError(
                _("The loan end date cannot be in the past."),
                field_names=["loan_end_date"],
            )
