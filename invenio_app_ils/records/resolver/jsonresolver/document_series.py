# -*- coding: utf-8 -*-
#
# Copyright (C) 2018-2019 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""Resolve the referred Series for a Document."""

import jsonresolver
from invenio_pidstore.errors import PIDDoesNotExistError
from werkzeug.routing import Rule

from ...api import Document, Series
from ..resolver import get_field_value_for_record as get_field_value

# Note: there must be only one resolver per file,
# otherwise only the last one is registered


@jsonresolver.hookimpl
def jsonresolver_loader(url_map):
    """Resolve the referred Series for a Document record."""
    from flask import current_app

    def series_resolver(document_pid):
        """Resolve the referred Series for a Document record."""
        try:
            series_objs = get_field_value(Document, document_pid,
                                           "series_objs")
            series = []
            for obj in series_objs:
                record = Series.get_record_by_pid(obj["pid"])
                keep_keys = ("series_pid", "mode_of_issuance", "issn", "title")
                for key in list(record):
                    if key not in keep_keys:
                        del record[key]
                record["volume"] = obj["volume"]
                series.append(record)
            return series
        except (KeyError, PIDDoesNotExistError):
            return {}

    url_map.add(
        Rule(
            "/api/resolver/documents/<document_pid>/series",
            endpoint=series_resolver,
            host=current_app.config.get("JSONSCHEMAS_HOST"),
        )
    )
