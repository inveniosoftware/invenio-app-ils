# -*- coding: utf-8 -*-
#
# Copyright (C) 2019 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""Invenio App ILS ILL loaders."""

from invenio_records_rest.loaders import marshmallow_loader

from .schemas.json.borrowing_request import BorrowingRequestSchemaV1
from .schemas.json.library import LibrarySchemaV1

borrowing_request_loader = marshmallow_loader(BorrowingRequestSchemaV1)
library_loader = marshmallow_loader(LibrarySchemaV1)
