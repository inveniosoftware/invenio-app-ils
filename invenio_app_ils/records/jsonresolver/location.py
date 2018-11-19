# -*- coding: utf-8 -*-
#
# Copyright (C) 2018 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""Ils Location record resolver."""

import jsonresolver
from flask import current_app
from invenio_pidstore.errors import PersistentIdentifierError

from ..api import Location


@jsonresolver.route(
    "/api/resolver/locations/<pid_value>", host="ils.mydomain.org"
)
def location_resolver(pid_value):
    """Return the location record for the given pid or raise exception."""
    location = {}
    try:
        location = Location.get_record_by_pid(pid_value)
    except PersistentIdentifierError as ex:
        current_app.logger.error(ex)
    return location
