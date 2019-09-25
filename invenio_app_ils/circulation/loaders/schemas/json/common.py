# -*- coding: utf-8 -*-
#
# Copyright (C) 2019 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify
# it under the terms of the MIT License; see LICENSE file for more details.

"""Invenio App ILS circulation common loader JSON schema."""

from invenio_records_rest.schemas import RecordMetadataSchemaJSONV1
from marshmallow import fields


class LoanCommonSchemaV1(RecordMetadataSchemaJSONV1):
    """Loan common schema."""

    class Meta:
        """Meta attributes for the schema."""

        from marshmallow import EXCLUDE
        unknown = EXCLUDE

    def get_pid_field(self):
        """Return pid_field value."""
        return "pid"

    document_pid = fields.Str(required=True)
    item_pid = fields.Str()
    patron_pid = fields.Str(required=True)
    pickup_location_pid = fields.Str()
    transaction_location_pid = fields.Str(required=True)
    transaction_user_pid = fields.Str(required=True)

