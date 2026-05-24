# SPDX-FileCopyrightText: 2019 CERN.
# SPDX-License-Identifier: MIT

"""Invenio App ILS circulation Loan Checkout loader JSON schema."""

from invenio_circulation.records.loaders.schemas.json import LoanItemPIDSchemaV1
from marshmallow import fields

from .base import LoanBaseSchemaV1


class LoanSelfCheckoutSchemaV1(LoanBaseSchemaV1):
    """Loan self-checkout schema."""

    item_pid = fields.Nested(LoanItemPIDSchemaV1, required=True)
