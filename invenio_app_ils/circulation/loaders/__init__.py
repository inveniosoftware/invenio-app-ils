# SPDX-FileCopyrightText: 2019 CERN.
# SPDX-License-Identifier: MIT

"""Invenio App ILS circulation loaders."""

from invenio_app_ils.records.loaders import ils_marshmallow_loader

from .schemas.json.bulk_extend import BulkExtendLoansSchemaV1
from .schemas.json.loan_checkout import LoanCheckoutSchemaV1
from .schemas.json.loan_request import LoanRequestSchemaV1
from .schemas.json.loan_self_checkout import LoanSelfCheckoutSchemaV1
from .schemas.json.loan_update_dates import LoanUpdateDatesSchemaV1

loan_request_loader = ils_marshmallow_loader(LoanRequestSchemaV1)
loan_checkout_loader = ils_marshmallow_loader(LoanCheckoutSchemaV1)
loan_self_checkout_loader = ils_marshmallow_loader(LoanSelfCheckoutSchemaV1)
loan_update_dates_loader = ils_marshmallow_loader(LoanUpdateDatesSchemaV1)
loans_bulk_update_loader = ils_marshmallow_loader(BulkExtendLoansSchemaV1)
