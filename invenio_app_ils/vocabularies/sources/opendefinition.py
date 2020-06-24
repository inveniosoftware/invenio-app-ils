# -*- coding: utf-8 -*-
#
# Copyright (C) 2019 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""Vocabulary Invenio-OpenDefinition source module."""

from flask import current_app
from invenio_opendefinition import current_opendefinition

from ..api import VOCABULARY_PID_TYPE, validate_vocabulary
from .base import VocabularySource


class OpenDefinitionVocabularySource(VocabularySource):
    """Vocabulary source loading data from a JSON file."""

    def __init__(self, loader, path=None, status_whitelist=None):
        """Initialize JSON vocabulary source."""
        super().__init__(source_type="json")
        self.loader = loader
        self.path = path
        self.status_whitelist = status_whitelist

    @validate_vocabulary
    def load(self):
        """Load vocabularies from JSON file."""
        if self.loader not in current_opendefinition.loaders:
            raise KeyError('Loader {} does not exist'.format(self.loader))

        vocabularies = []
        cfg = current_app.config["RECORDS_REST_ENDPOINTS"][VOCABULARY_PID_TYPE]
        Vocabulary = cfg["record_class"]
        licenses = current_opendefinition.loaders[self.loader](self.path)
        for _license in licenses.values():
            data = {
                "loader": self.loader,
            }
            if "url" in _license:
                data["url"] = _license["url"]
            if "maintainer" in _license:
                data["maintainer"] = _license["maintainer"]
            if "status" in _license:
                status = _license["status"]
                if self.status_whitelist is not None and \
                        status not in self.status_whitelist:
                    continue
                data["status"] = _license["status"]

            vocabulary = Vocabulary(
                type="license",
                key=_license["id"],
                text="{} ({})".format(_license["title"], _license["id"]),
                data=data
            )
            vocabularies.append(vocabulary)
        return vocabularies
