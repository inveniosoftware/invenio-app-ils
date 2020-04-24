# -*- coding: utf-8 -*-
#
# Copyright (C) 2018-2020 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""Literature JSON serializers."""

from invenio_records_rest.serializers.json import JSONSerializer

from .custom_fields import field_cover_metadata


class LiteratureJSONSerializer(JSONSerializer):
    """Serialize Literature."""

    def transform_record(self, pid, record, links_factory=None, **kwargs):
        """Transform record into an intermediate representation."""
        literature = super().transform_record(
            pid, record, links_factory=links_factory, **kwargs
        )
        field_cover_metadata(literature["metadata"])
        return literature

    def transform_search_hit(
        self, pid, record_hit, links_factory=None, **kwargs
    ):
        """Transform search result hit into an intermediate representation."""
        hit = super().transform_search_hit(
            pid, record_hit, links_factory=links_factory, **kwargs
        )
        field_cover_metadata(hit["metadata"])
        return hit
