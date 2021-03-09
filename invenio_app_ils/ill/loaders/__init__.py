# -*- coding: utf-8 -*-
#
# Copyright (C) 2019-2020 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""Invenio App ILS ILL loaders."""

from invenio_app_ils.records.loaders import ils_marshmallow_loader

from .jsonschemas.borrowing_request import BorrowingRequestSchemaV1
from .jsonschemas.patron_loan_actions import CreateLoanSchemaV1
from .jsonschemas.patron_loan_extension_actions import (
    AcceptExtensionSchemaV1,
    DeclineExtensionSchemaV1,
    RequestExtensionSchemaV1,
)

borrowing_request_loader = ils_marshmallow_loader(BorrowingRequestSchemaV1)
patron_loan_create_action_loader = ils_marshmallow_loader(CreateLoanSchemaV1)
patron_loan_extension_request_loader = ils_marshmallow_loader(
    RequestExtensionSchemaV1
)
patron_loan_extension_accept_loader = ils_marshmallow_loader(
    AcceptExtensionSchemaV1
)
patron_loan_extension_decline_loader = ils_marshmallow_loader(
    DeclineExtensionSchemaV1
)
