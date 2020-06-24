# -*- coding: utf-8 -*-
#
# Copyright (C) 2019 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""Vocabulary JSON source module."""

import json

from flask import current_app

from ..api import VOCABULARY_PID_TYPE, validate_vocabulary
from .base import VocabularySource


class JSONVocabularySource(VocabularySource):
    """Vocabulary source loading data from a JSON file."""

    def __init__(self, filename):
        """Initialize JSON vocabulary source."""
        super().__init__(source_type="json")
        self.filename = filename

    @validate_vocabulary
    def load(self):
        """Load vocabularies from JSON file."""
        vocabularies = []
        cfg = current_app.config["RECORDS_REST_ENDPOINTS"][VOCABULARY_PID_TYPE]
        Vocabulary = cfg["record_class"]
        with open(self.filename, 'r') as f:
            for obj in json.load(f):
                vocabulary = Vocabulary(**obj)
                vocabularies.append(vocabulary)
        return vocabularies
