# -*- coding: utf-8 -*-
#
# Copyright (C) 2019-2020 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""Invenio App ILS ILL loaders."""

from invenio_app_ils.records.loaders import ils_marshmallow_loader

from .jsonschemas.borrowing_request import BorrowingRequestSchemaV1
from .jsonschemas.create_loan import CreateLoanSchemaV1
from .jsonschemas.library import LibrarySchemaV1

borrowing_request_loader = ils_marshmallow_loader(BorrowingRequestSchemaV1)
create_loan_loader = ils_marshmallow_loader(CreateLoanSchemaV1)
library_loader = ils_marshmallow_loader(LibrarySchemaV1)
