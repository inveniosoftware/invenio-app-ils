# -*- coding: utf-8 -*-
#
# Copyright (C) 2018-2019 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""Internal Locations related resolvers."""

import jsonresolver
from werkzeug.routing import Rule

from ...api import InternalLocation, Location
from ..resolver import get_field_value_for_record as get_field_value

# Note: there must be only one resolver per file,
# otherwise only the last one is registered


@jsonresolver.hookimpl
def jsonresolver_loader(url_map):
    """Resolve the referred Location for an Internal Location record."""
    from flask import current_app

    def location_resolver(internal_loc_pid):
        """Return the Location record for the given Internal Loc. or raise."""
        location_pid = get_field_value(InternalLocation, internal_loc_pid,
                                       Location.pid_field)
        location = Location.get_record_by_pid(location_pid)
        del location["$schema"]

        return location

    url_map.add(
        Rule(
            "/api/resolver/internal-locations/<internal_loc_pid>/location",
            endpoint=location_resolver,
            host=current_app.config.get("JSONSCHEMAS_HOST"),
        )
    )
