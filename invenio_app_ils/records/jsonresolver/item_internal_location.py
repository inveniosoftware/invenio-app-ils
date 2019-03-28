# -*- coding: utf-8 -*-
#
# Copyright (C) 2018-2019 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""Item related resolvers."""

import jsonresolver
from werkzeug.routing import Rule

from ..api import InternalLocation, Item
from .resolver import get_field_value_for_record as get_field_value

# Note: there must be only one resolver per file,
# otherwise only the last one is registered


@jsonresolver.hookimpl
def jsonresolver_loader(url_map):
    """Resolve the referred Internal Location for an Item record."""
    from flask import current_app

    def get_internal_location(internal_location_pid):
        """Return the Internal Location record."""
        internal_location = InternalLocation.get_record_by_pid(
            internal_location_pid
        )

        return internal_location

    def internal_location_resolver(item_pid):
        """Return the Internal Location record for the given Item or raise."""
        internal_loc_pid = get_field_value(Item, item_pid,
                                           InternalLocation.pid_field)
        return get_internal_location(internal_loc_pid)

    url_map.add(
        Rule(
            "/api/resolver/items/<item_pid>/internal-location",
            endpoint=internal_location_resolver,
            host=current_app.config.get("JSONSCHEMAS_HOST"),
        )
    )
