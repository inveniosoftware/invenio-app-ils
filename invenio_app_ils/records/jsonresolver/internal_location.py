# -*- coding: utf-8 -*-
#
# Copyright (C) 2018 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""Ils Internal Location record resolver."""

import jsonresolver
from invenio_pidstore.errors import PersistentIdentifierError
from werkzeug.routing import Rule

from ..api import InternalLocation


@jsonresolver.hookimpl
def jsonresolver_loader(url_map):
    """Resolve the internal location for item record."""
    from flask import current_app

    def _internal_location_resolver(internal_loc_pid):
        """Return the internal location for the given pid or raise exception."""
        internal_location = {}
        try:
            internal_location = InternalLocation.get_record_by_pid(
                internal_loc_pid
            )
        except PersistentIdentifierError as ex:
            current_app.logger.error(ex)
        return internal_location

    url_map.add(
        Rule(
            "/api/resolver/internal-locations/<internal_loc_pid>",
            endpoint=_internal_location_resolver,
            host=current_app.config.get("JSONSCHEMAS_HOST"),
        )
    )
