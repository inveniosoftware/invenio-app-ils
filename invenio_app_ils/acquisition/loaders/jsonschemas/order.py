# -*- coding: utf-8 -*-
#
# Copyright (C) 2019-2020 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""Order schema for marshmallow loader."""

from invenio_circulation.records.loaders.schemas.json import DateString
from invenio_records_rest.schemas import RecordMetadataSchemaJSONV1
from marshmallow import EXCLUDE, Schema, fields, pre_load, validate

from invenio_app_ils.acquisition.api import Order
from invenio_app_ils.records.loaders.schemas.changed_by import (
    ChangedBySchema,
    set_changed_by,
)
from invenio_app_ils.records.loaders.schemas.price import PriceSchema


class OrderLineSchema(Schema):
    """Order line schema."""

    class Meta:
        """Meta attributes for the schema."""

        unknown = EXCLUDE

    budget_code = fields.Str()
    copies_ordered = fields.Int(required=True)
    copies_received = fields.Int()
    document_pid = fields.Str(required=True)
    inter_departmental_transaction_id = fields.Str()
    is_donation = fields.Bool()
    is_patron_suggestion = fields.Bool()
    medium = fields.Str(required=True)
    notes = fields.Str()
    patron_pid = fields.Str()
    payment_mode = fields.Str()
    purchase_type = fields.Str()
    recipient = fields.Str(required=True)
    total_price = fields.Nested(PriceSchema)
    unit_price = fields.Nested(PriceSchema)


class PaymentSchema(Schema):
    """Payment schema."""

    class Meta:
        """Meta attributes for the schema."""

        unknown = EXCLUDE

    debit_cost = fields.Nested(PriceSchema)
    debit_cost_main_currency = fields.Nested(PriceSchema)
    debit_date = DateString()
    debit_note = fields.Str()
    internal_purchase_requisition_id = fields.Str()
    mode = fields.Str()


class OrderSchemaV1(RecordMetadataSchemaJSONV1):
    """Order schema."""

    class Meta:
        """Meta attributes for the schema."""

        unknown = EXCLUDE

    cancel_reason = fields.Str()
    created_by = fields.Nested(ChangedBySchema)
    expected_delivery_date = DateString()
    funds = fields.List(fields.Str())
    grand_total = fields.Nested(PriceSchema)
    grand_total_main_currency = fields.Nested(PriceSchema)
    legacy_id = fields.Str()
    notes = fields.Str()
    order_date = DateString()
    order_lines = fields.List(fields.Nested(OrderLineSchema), required=True)
    payment = fields.Nested(PaymentSchema)
    received_date = DateString()
    status = fields.Str(required=True, validate=validate.OneOf(Order.STATUSES))
    updated_by = fields.Nested(ChangedBySchema)
    provider_pid = fields.Str(required=True)

    @pre_load
    def set_changed_by(self, data, **kwargs):
        """Automatically set `created_by` and `updated_by`."""
        record = self.context.get("record")
        return set_changed_by(data, record)
