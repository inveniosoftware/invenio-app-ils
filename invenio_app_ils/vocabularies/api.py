# -*- coding: utf-8 -*-
#
# Copyright (C) 2019 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""Vocabularies API module."""

from flask import current_app
from invenio_records_rest.utils import obj_or_import_string
from invenio_search import current_search

from invenio_app_ils.pidstore.pids import VOCABULARY_PID_TYPE


def validate_vocabulary(f):
    """Decorator to validate vocabulary schema."""
    def inner(self):
        vocabularies = f(self)
        for vocabulary in vocabularies:
            self.validate(vocabulary)
        return vocabularies
    return inner


def load_vocabularies(source_name, *args, **kwargs):
    """Load vocabularies from a vocabulary source."""
    source_name = current_app.config["ILS_VOCABULARY_SOURCES"][source_name]
    source = obj_or_import_string(source_name)(*args, **kwargs)
    return source.load()


def delete_vocabulary_from_index(type, force=False, key=None):
    """Delete vocabulary from index given a type and optionally a key."""
    cfg = current_app.config["RECORDS_REST_ENDPOINTS"][VOCABULARY_PID_TYPE]
    search = cfg["search_class"]()
    if key is None:
        results = search.search_by_type(type)
    else:
        results = search.search_by_type_and_key(type, key)

    count = results.count()
    if force:
        results.delete()
        current_search.flush_and_refresh(index=search.Meta.index)

    return count
