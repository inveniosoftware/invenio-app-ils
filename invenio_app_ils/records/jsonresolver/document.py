# -*- coding: utf-8 -*-
#
# Copyright (C) 2018 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""Ils Records Items record document resolver."""

import jsonresolver
from invenio_circulation.api import get_loan_for_item

from invenio_app_ils.records.api import Document


@jsonresolver.route(
    "/api/resolver/items/document/<pid_value>", host="127.0.0.1:5000"
)
def document_for_item_resolver(pid_value):
    """Return the document for the given item."""
    return Document.get_record_by_pid(pid_value) or {}
