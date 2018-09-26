# -*- coding: utf-8 -*-
#
# Copyright (C) 2018 CERN.
# Copyright (C) 2018 RERO.
#
# Invenio-Circulation is free software; you can redistribute it and/or modify
# it under the terms of the MIT License; see LICENSE file for more details.

"""Search utilities."""

import re
from flask import abort, g, request
from elasticsearch_dsl.query import Bool, Q
from invenio_circulation.search import LoansSearch
from invenio_app_ils.permissions import librarian_permission_factory
from invenio_search.api import RecordsSearch, DefaultFilter


def loan_permission_filter():
    """Filter list of results."""

    #if not logged in abort
    if not g.identity.id:
        abort(403)

    # Send empty query for admins
    if librarian_permission_factory().allows(g.identity):
        return Q()

    if request:
        query = request.args.get('q')
        if query and 'patron_pid' in query:
            match = re.match(r"patron_pid:(?P<patron_pid>\d)", query)
            if match:
                pid = match.group("patron_pid")
                if pid == str(g.identity.id):
                    return Q()
                else:
                    abort(403)
    return []


class IlsLoansSearch(LoansSearch):
    """RecordsSearch for borrowed documents."""

    class Meta:
        """Search only on loans index."""

        index = "loans"
        doc_types = None
        default_filter = DefaultFilter(loan_permission_filter)
