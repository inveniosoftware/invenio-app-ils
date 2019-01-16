# -*- coding: utf-8 -*-
#
# Copyright (C) 2018 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""Ils Items resolver for circulation module."""

import jsonresolver
from invenio_app_ils.circulation.utils import circulation_item_retriever


@jsonresolver.route("/api/resolver/circulation/items/<pid_value>", host="127.0.0.1:5000")
def item_resolver(pid_value):
    """Return the item record given pid."""
    return circulation_item_retriever(pid_value)
