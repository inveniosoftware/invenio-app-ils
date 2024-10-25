# -*- coding: utf-8 -*-
#
# Copyright (C) 2019 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify
# it under the terms of the MIT License; see LICENSE file for more details.

"""Invenio App ILS circulation Loan Checkout loader JSON schema."""

from invenio_circulation.records.loaders.schemas.json import LoanItemPIDSchemaV1
from marshmallow import fields

from .base import LoanBaseSchemaV1


class LoanSelfCheckoutSchemaV1(LoanBaseSchemaV1):
    """Loan self-checkout schema."""

    item_pid = fields.Nested(LoanItemPIDSchemaV1, required=True)
