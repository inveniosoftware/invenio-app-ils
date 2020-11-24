# -*- coding: utf-8 -*-
#
# Copyright (C) 2018-2019 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""Internal Locations related resolvers."""

import jsonresolver
from werkzeug.routing import Rule

from invenio_app_ils.internal_locations.api import InternalLocation
from invenio_app_ils.locations.api import Location
from invenio_app_ils.records.jsonresolvers.api import \
    get_field_value_for_record as get_field_value
from invenio_app_ils.records.jsonresolvers.api import get_pid_or_default, pick

# Note: there must be only one resolver per file,
# otherwise only the last one is registered


@jsonresolver.hookimpl
def jsonresolver_loader(url_map):
    """Resolve the referred Location for an Internal Location record."""
    from flask import current_app

    @get_pid_or_default(default_value=dict())
    def location_resolver(internal_loc_pid):
        """Return the Location record for the given Internal Loc. or raise."""
        location_pid = get_field_value(
            InternalLocation, internal_loc_pid, "location_pid"
        )
        location = Location.get_record_by_pid(location_pid)

        return pick(
            location,
            "name",
            "opening_exceptions",
            "opening_weekdays",
            "pid",
        )

    url_map.add(
        Rule(
            "/api/resolver/internal-locations/<internal_loc_pid>/location",
            endpoint=location_resolver,
            host=current_app.config.get("JSONSCHEMAS_HOST"),
        )
    )
