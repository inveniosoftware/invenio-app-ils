# -*- coding: utf-8 -*-
#
# Copyright (C) 2018-2020 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""Resolve the InternalLocation referenced in the Item."""

import jsonresolver
from werkzeug.routing import Rule

from invenio_app_ils.internal_locations.api import InternalLocation
from invenio_app_ils.items.api import Item
from invenio_app_ils.records.jsonresolvers.api import (
    get_field_value_for_record as get_field_value,
)
from invenio_app_ils.records.jsonresolvers.api import get_pid_or_default, pick

# Note: there must be only one resolver per file,
# otherwise only the last one is registered


@jsonresolver.hookimpl
def jsonresolver_loader(url_map):
    """Resolve the referred Internal Location for an Item record."""
    from flask import current_app

    @get_pid_or_default(default_value=dict())
    def get_internal_location(internal_location_pid):
        """Return the InternalLocation record."""
        internal_location = InternalLocation.get_record_by_pid(internal_location_pid)
        del internal_location["$schema"]
        if "notes" in internal_location:
            del internal_location["notes"]

        return internal_location

    def internal_location_resolver(item_pid):
        """Return the IntLoc record for the given Item or raise."""
        internal_loc_pid = get_field_value(Item, item_pid, "internal_location_pid")
        return get_internal_location(internal_loc_pid)

    url_map.add(
        Rule(
            "/api/resolver/items/<item_pid>/internal-location",
            endpoint=internal_location_resolver,
            host=current_app.config.get("JSONSCHEMAS_HOST"),
        )
    )
