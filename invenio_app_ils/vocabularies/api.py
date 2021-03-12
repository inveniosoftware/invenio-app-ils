# -*- coding: utf-8 -*-
#
# Copyright (C) 2019 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""Vocabularies API module."""

from functools import partial

from flask import current_app
from invenio_pidstore.models import PIDStatus
from invenio_pidstore.providers.recordid_v2 import RecordIdProviderV2
from invenio_records_rest.utils import obj_or_import_string
from invenio_search import current_search

from invenio_app_ils.fetchers import pid_fetcher
from invenio_app_ils.proxies import current_app_ils

# hardcoded values for vocabularies that are not customizable via JSON files
VOCABULARY_TYPE_LANGUAGE = "language"
VOCABULARY_TYPE_COUNTRY = "country"
VOCABULARY_TYPE_LICENSE = "license"

VOCABULARY_PID_TYPE = "vocid"
VOCABULARY_PID_MINTER = "vocid"
VOCABULARY_PID_FETCHER = "vocid"

VocabularyIdProvider = type(
    "VocabularyIdProvider",
    (RecordIdProviderV2,),
    dict(pid_type=VOCABULARY_PID_TYPE, default_status=PIDStatus.REGISTERED),
)
vocabulary_pid_minter = None
vocabulary_pid_fetcher = partial(
    pid_fetcher, provider_cls=VocabularyIdProvider, pid_field="id"
)


class Vocabulary(dict):
    """Vocabulary record class."""

    _index = "vocabularies-vocabulary-v1.0.0"
    _doc_type = "vocabulary-v1.0.0"
    _schema = "vocabularies/vocabulary-v1.0.0.json"

    def __init__(self, type, key, text, data=None):
        """Create a `Vocabulary` instance.

        Vocabulary instances are not stored in the database
        but are indexed in ElasticSearch.
        """
        self.type = type
        self.key = key
        self.text = text
        self.data = data or {}

        # Needed by the indexer
        self.id = "{}-{}".format(type, key).lower()
        self.revision_id = 1

    def dumps(self):
        """Return python representation of vocabulary metadata."""
        return {
            "id": self.id,
            "type": self.type,
            "key": self.key,
            "text": self.text,
            "data": self.data,
        }

    def __repr__(self):
        """Representation of a vocabulary."""
        return "Vocabulary(id={}, key={}, type={}, text={!r}, data={})".format(
            self.id, self.key, self.type, self.text, self.data
        )


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
    search = current_app_ils.vocabulary_search_cls()
    if key is None:
        results = search.search_by_type(type)
    else:
        results = search.search_by_type_and_key(type, key)

    count = results.count()
    if force:
        results.delete()
        current_search.flush_and_refresh(index=search.Meta.index)

    return count
