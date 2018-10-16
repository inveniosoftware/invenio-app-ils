# -*- coding: utf-8 -*-
#
# Copyright (C) 2018 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""Ils Records Items record resolver."""

import jsonresolver
from invenio_circulation.api import get_loan_for_item


@jsonresolver.route('/api/circulation/items/<pid_value>/loan',
                    host='ils.mydomain.org')
def loan_for_item_resolver(pid_value):
    """Return the circulation status for the given item."""
    return get_loan_for_item(pid_value) or {}
