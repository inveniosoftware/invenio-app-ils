# -*- coding: utf-8 -*-
#
# Copyright (C) 2019 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify
# it under the terms of the MIT License; see LICENSE file for more details.

"""Invenio App ILS circulation loaders."""

from invenio_app_ils.records.loaders import ils_marshmallow_loader

from .schemas.json.bulk_extend import BulkExtendLoansSchemaV1
from .schemas.json.loan_checkout import LoanCheckoutSchemaV1
from .schemas.json.loan_request import LoanRequestSchemaV1
from .schemas.json.loan_update_dates import LoanUpdateDatesSchemaV1

loan_request_loader = ils_marshmallow_loader(LoanRequestSchemaV1)
loan_checkout_loader = ils_marshmallow_loader(LoanCheckoutSchemaV1)
loan_update_dates_loader = ils_marshmallow_loader(LoanUpdateDatesSchemaV1)
loans_bulk_update_loader = ils_marshmallow_loader(BulkExtendLoansSchemaV1)
