# -*- coding: utf-8 -*-
#
# Copyright (C) 2018-2019 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""Resolve the Loan referenced in the Item."""

import jsonresolver
from invenio_circulation.api import get_loan_for_item
from werkzeug.routing import Rule

# Note: there must be only one resolver per file,
# otherwise only the last one is registered


@jsonresolver.hookimpl
def jsonresolver_loader(url_map):
    """Resolve the referred Loan for an Item record."""
    from flask import current_app

    def loan_for_item_resolver(item_pid):
        """Return the loan for the given item."""
        loan = get_loan_for_item(item_pid) or {}
        return {
            "loan_pid": loan.get("loan_pid"),
            "patron_pid": loan.get("patron_pid"),
            "document_pid": loan.get("document_pid"),
            "item_pid": loan.get("item_pid"),
            "state": loan.get("state"),
            "start_date": loan.get("start_date"),
            "end_date": loan.get("end_date"),
            "request_expire_date": loan.get("request_expire_date"),
            "extension_count": loan.get("extension_count"),
        }

    url_map.add(
        Rule(
            "/api/resolver/items/<item_pid>/loan",
            endpoint=loan_for_item_resolver,
            host=current_app.config.get("JSONSCHEMAS_HOST"),
        )
    )
