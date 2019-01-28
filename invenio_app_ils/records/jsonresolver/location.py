# -*- coding: utf-8 -*-
#
# Copyright (C) 2018 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""Ils Location record resolver."""

import jsonresolver
from invenio_pidstore.errors import PersistentIdentifierError
from werkzeug.routing import Rule

from ..api import Location


@jsonresolver.hookimpl
def jsonresolver_loader(url_map):
    """Resolve the location for internal location record."""
    from flask import current_app


    def _location_resolver(loc_pid):
        """Return the location record for the given pid or raise exception."""
        location = {}
        try:
            location = Location.get_record_by_pid(loc_pid)
        except PersistentIdentifierError as ex:
            current_app.logger.error(ex)
        return location

    url_map.add(
        Rule(
            "/api/resolver/locations/<loc_pid>",
            endpoint=_location_resolver,
            host=current_app.config.get("JSONSCHEMAS_HOST"),
        )
    )
