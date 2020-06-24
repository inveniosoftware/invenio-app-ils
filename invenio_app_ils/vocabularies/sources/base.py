# -*- coding: utf-8 -*-
#
# Copyright (C) 2019 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""Vocabulary base source module."""

from abc import ABCMeta, abstractmethod

from flask import current_app
from invenio_jsonschemas import current_jsonschemas
from jsonschema import validate as validate_schema

from invenio_app_ils.errors import VocabularyError


class VocabularySource(metaclass=ABCMeta):
    """Vocabulary source."""

    def __init__(self, source_type):
        """Initialize vocabulary source."""
        self.source_type = source_type

    @staticmethod
    def validate(vocabulary):
        """Validate vocabulary."""
        from invenio_app_ils.vocabularies.api import Vocabulary
        if not isinstance(vocabulary, Vocabulary):
            raise VocabularyError(
                "{} is not a vocabulary".format(vocabulary))

        # Validate vocabulary type
        if vocabulary.type not in current_app.config["ILS_VOCABULARIES"]:
            raise VocabularyError(
                "Invalid vocabulary type: {}".format(vocabulary.type))

        # JSONSchema validation
        schema = current_jsonschemas.get_schema(vocabulary._schema)
        data = vocabulary.dumps()
        validate_schema(data, schema)

    @abstractmethod
    def load(self):
        """Load data from vocabulary source."""
        pass
