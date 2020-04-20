# -*- coding: utf-8 -*-
#
# Copyright (C) 2018-2020 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""Literature serializers."""

from flask import current_app
from invenio_records_rest.serializers.json import JSONSerializer


class LiteratureJSONSerializer(JSONSerializer):
    """Serialize literature."""

    def transform_record(self, pid, record, links_factory=None, **kwargs):
        """Transform record into an intermediate representation."""
        literature = super().transform_record(
            pid,
            record,
            links_factory=links_factory,
            **kwargs
        )
        literature = self.build_cover_urls(literature)
        return literature

    def transform_search_hit(self, pid, record_hit, links_factory=None,
                             **kwargs):
        """Transform search result hit into an intermediate representation."""
        hit = super().transform_search_hit(
            pid,
            record_hit,
            links_factory=links_factory,
            **kwargs
        )
        hit = self.build_cover_urls(hit)
        return hit

    def build_cover_urls(self, literature):
        """Build cover urls for literature."""
        url_builder = current_app.config.get(
            "ILS_LITERATURE_COVER_URLS_BUILDER")

        cover_urls = url_builder(literature["metadata"])
        literature["metadata"]["cover_urls"] = cover_urls
        return literature
