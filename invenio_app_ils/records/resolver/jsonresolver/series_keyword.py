# -*- coding: utf-8 -*-
#
# Copyright (C) 2019 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""Resolve the Keyword referenced in the Series."""

import jsonresolver
from werkzeug.routing import Rule

from ...api import Keyword, Series
from ..resolver import get_field_value_for_record as get_field_value

# Note: there must be only one resolver per file,
# otherwise only the last one is registered


@jsonresolver.hookimpl
def jsonresolver_loader(url_map):
    """Resolve the referred Keywords for a Series record."""
    from flask import current_app

    def keywords_resolver(series_pid):
        """Return the Keyword records for the given Keyword or raise."""
        keyword_pids = get_field_value(Series, series_pid, "keyword_pids")

        keywords = []
        for keyword_pid in keyword_pids:
            keyword = Keyword.get_record_by_pid(keyword_pid)
            del keyword["$schema"]

            keywords.append(keyword)

        return keywords

    url_map.add(
        Rule(
            "/api/resolver/series/<series_pid>/keywords",
            endpoint=keywords_resolver,
            host=current_app.config.get("JSONSCHEMAS_HOST"),
        )
    )
