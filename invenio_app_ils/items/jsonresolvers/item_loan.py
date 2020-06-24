# -*- coding: utf-8 -*-
#
# Copyright (C) 2018-2020 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""Resolve the Loan referenced in the Item."""

import jsonresolver
from invenio_circulation.api import get_loan_for_item
from werkzeug.routing import Rule

from invenio_app_ils.items.api import ITEM_PID_TYPE

# Note: there must be only one resolver per file,
# otherwise only the last one is registered


@jsonresolver.hookimpl
def jsonresolver_loader(url_map):
    """Resolve the referred Loan for an Item record."""
    from flask import current_app

    def loan_for_item_resolver(item_pid):
        """Return the loan for the given item."""
        loan = get_loan_for_item(dict(value=item_pid, type=ITEM_PID_TYPE))
        if not loan:
            return {}
        else:
            return {
                "loan_pid": loan["pid"],
                "patron_pid": loan["patron_pid"],
                "patron": loan["patron"],
                "document_pid": loan["document_pid"],
                "item_pid": loan.get("item_pid"),
                "state": loan["state"],
                "start_date": loan["start_date"],
                "end_date": loan["end_date"],
                "extension_count": loan.get("extension_count", 0),
                "is_overdue": loan.get("is_overdue", False),
            }

    url_map.add(
        Rule(
            "/api/resolver/items/<item_pid>/loan",
            endpoint=loan_for_item_resolver,
            host=current_app.config.get("JSONSCHEMAS_HOST"),
        )
    )
