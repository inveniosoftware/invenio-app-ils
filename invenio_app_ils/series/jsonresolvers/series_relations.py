# -*- coding: utf-8 -*-
#
# Copyright (C) 2019 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""Resolve the relations referenced in the Series."""

import jsonresolver
from werkzeug.routing import Rule

from invenio_app_ils.records.jsonresolvers.api import get_pid_or_default
from invenio_app_ils.series.api import Series

# Note: there must be only one resolver per file,
# otherwise only the last one is registered


@jsonresolver.hookimpl
def jsonresolver_loader(url_map):
    """Resolve the relations of a Series record."""
    from flask import current_app

    @get_pid_or_default(default_value=dict())
    def relations_resolver(series_pid):
        """Resolve record relations."""
        series = Series.get_record_by_pid(series_pid)
        return series.relations

    url_map.add(
        Rule(
            "/api/resolver/series/<series_pid>/relations",
            endpoint=relations_resolver,
            host=current_app.config.get("JSONSCHEMAS_HOST"),
        )
    )
