# -*- coding: utf-8 -*-
#
# Copyright (C) 2019-2020 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""BorrowingRequest schema for marshmallow loader."""

from invenio_circulation.records.loaders.schemas.json import DateString
from invenio_records_rest.schemas import RecordMetadataSchemaJSONV1
from marshmallow import EXCLUDE, Schema, fields, pre_load, validate

from invenio_app_ils.ill.api import BorrowingRequest
from invenio_app_ils.records.loaders.schemas.changed_by import ChangedBySchema, \
    set_changed_by


class PriceSchema(Schema):
    """Price schema."""

    class Meta:
        """Meta attributes for the schema."""

        unknown = EXCLUDE

    currency = fields.Str(required=True)
    value = fields.Number(required=True)


class PaymentSchema(Schema):
    """Payment schema."""

    class Meta:
        """Meta attributes for the schema."""

        unknown = EXCLUDE

    budget_code = fields.Str()
    debit_cost = fields.Nested(PriceSchema)
    debit_cost_main_currency = fields.Nested(PriceSchema)
    debit_date = DateString()
    debit_note = fields.Str()
    internal_purchase_requisition_id = fields.Str()
    mode = fields.Str(required=True)


class ExtensionSchema(Schema):
    """Extension schema."""

    class Meta:
        """Meta attributes for the schema."""

        unknown = EXCLUDE

    notes = fields.Str()
    request_date = DateString()
    status = fields.Str(required=True)  # TODO: validate


class BorrowingRequestSchemaV1(RecordMetadataSchemaJSONV1):
    """BorrowingRequest schema."""

    class Meta:
        """Meta attributes for the schema."""

        unknown = EXCLUDE

    cancel_reason = fields.Str()
    created_by = fields.Nested(ChangedBySchema)
    document_pid = fields.Str(required=True)
    expected_delivery_date = DateString()
    extension = fields.Nested(ExtensionSchema)
    library_pid = fields.Str(required=True)  # TODO: validate
    loan_end_date = DateString()
    notes = fields.Str()
    patron_pid = fields.Str(required=True)
    payment = fields.Nested(PaymentSchema)
    received_date = DateString()
    request_date = DateString()
    status = fields.Str(
        required=True, validate=validate.OneOf(BorrowingRequest.STATUSES)
    )
    total = fields.Nested(PriceSchema)
    total_main_currency = fields.Nested(PriceSchema)
    type = fields.Str(
        required=True, validate=validate.OneOf(BorrowingRequest.TYPES)
    )
    updated_by = fields.Nested(ChangedBySchema)

    @pre_load
    def set_changed_by(self, data, **kwargs):
        """Automatically set `created_by` and `updated_by`."""
        record = self.context.get("record")
        return set_changed_by(data, record)
