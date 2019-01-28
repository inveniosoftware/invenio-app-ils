# -*- coding: utf-8 -*-
#
# Copyright (C) 2018 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""Ils Records Items record resolver."""

import jsonresolver
from invenio_circulation.api import get_loan_for_item
from werkzeug.routing import Rule


@jsonresolver.hookimpl
def jsonresolver_loader(url_map):
    """Resolve the loan for item record."""
    from flask import current_app

    def _loan_for_item_resolver(pid_value):
        """Return the loan for the given item."""
        loan = get_loan_for_item(pid_value) or {}
        if loan.get("item"):
            del loan["item"]
        return loan

    url_map.add(
        Rule(
            "/api/resolver/circulation/items/<pid_value>/loan",
            endpoint=_loan_for_item_resolver,
            host=current_app.config.get("JSONSCHEMAS_HOST"),
        )
    )
