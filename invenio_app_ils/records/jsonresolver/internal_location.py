# -*- coding: utf-8 -*-
#
# Copyright (C) 2018 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""Ils Internal Location record resolver."""

import jsonresolver
from flask import current_app
from invenio_pidstore.errors import PersistentIdentifierError

from ..api import InternalLocation


@jsonresolver.route(
    "/api/resolver/internal-locations/<pid_value>", host="127.0.0.1:5000"
)
def internal_location_resolver(pid_value):
    """Return the internal location for the given pid or raise exception."""
    internal_location = {}
    try:
        internal_location = InternalLocation.get_record_by_pid(pid_value)
    except PersistentIdentifierError as ex:
        current_app.logger.error(ex)
    return internal_location
