# -*- coding: utf-8 -*-
#
# Copyright (C) 2018-2019 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""Item related resolvers."""

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
        # remove the `item` field to avoid circular dependencies
        if loan.get("item"):
            del loan["item"]
        if loan.get("$schema"):
            del loan["$schema"]
        return loan

    url_map.add(
        Rule(
            "/api/resolver/circulation/items/<item_pid>/loan",
            endpoint=loan_for_item_resolver,
            host=current_app.config.get("JSONSCHEMAS_HOST"),
        )
    )
