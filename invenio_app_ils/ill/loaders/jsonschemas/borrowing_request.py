# -*- coding: utf-8 -*-
#
# Copyright (C) 2019-2020 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""BorrowingRequest schema for marshmallow loader."""

from copy import deepcopy

from flask import has_request_context
from invenio_circulation.records.loaders.schemas.json import DateString
from invenio_records_rest.schemas import RecordMetadataSchemaJSONV1
from marshmallow import EXCLUDE, Schema, fields, post_load, pre_load, validate

from invenio_app_ils.ill.api import BorrowingRequest
from invenio_app_ils.records.loaders.schemas.changed_by import (
    ChangedBySchema, set_changed_by)
from invenio_app_ils.records.loaders.schemas.price import PriceSchema


def preserve_patron_loan(data, prev_record=None):
    """Preserve `patron_loan` system field."""
    if not has_request_context():
        return data

    if prev_record and "patron_loan" in prev_record:
        data["patron_loan"] = deepcopy(prev_record["patron_loan"])
    return data


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


class BorrowingRequestSchemaV1(RecordMetadataSchemaJSONV1):
    """BorrowingRequest schema."""

    class Meta:
        """Meta attributes for the schema."""

        unknown = EXCLUDE

    cancel_reason = fields.Str()
    created_by = fields.Nested(ChangedBySchema)
    document_pid = fields.Str(required=True)
    due_date = DateString()
    expected_delivery_date = DateString()
    legacy_id = fields.Str()
    library_pid = fields.Str(required=True)  # TODO: validate
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

    @post_load
    def preserve_patron_loan(self, data, **kwargs):
        """Preserve `patron_loan` system field."""
        record = self.context.get("record")
        return preserve_patron_loan(data, record)
