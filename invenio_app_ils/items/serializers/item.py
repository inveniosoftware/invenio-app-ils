# -*- coding: utf-8 -*-
#
# Copyright (C) 2018 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""ILS Item serializers."""

from invenio_records_rest.serializers.csv import CSVSerializer
from invenio_records_rest.serializers.json import JSONSerializer

from invenio_app_ils.literature.serializers.custom_fields import field_cover_metadata
from invenio_app_ils.permissions import patron_permission

FILTER_KEYS = [
    "loan_pid",
    "patron_pid",
    "start_date",
    "end_date",
    "extension_count",
]


def filter_circulation(data):
    """Filter circulation status depending on user permissions."""
    if "circulation" in data["metadata"]:
        circulation = data["metadata"]["circulation"]
        patron_pid = circulation.get("patron_pid", None)
        if not patron_pid:
            return circulation

        allowed = patron_permission(patron_pid).can()

        if not allowed:
            for key in FILTER_KEYS:
                if key in circulation:
                    del circulation[key]

        data["metadata"]["circulation"] = circulation


class ItemCSVSerializer(CSVSerializer):
    """Serialize and filter item circulation status."""

    def transform_record(self, pid, record, links_factory=None, **kwargs):
        """Transform record into an intermediate representation."""
        item = super().transform_record(
            pid, record, links_factory=links_factory, **kwargs
        )
        filter_circulation(item)
        field_cover_metadata(item.get("metadata", {}).get("document", {}))
        return item

    def transform_search_hit(self, pid, record_hit, links_factory=None, **kwargs):
        """Transform search result hit into an intermediate representation."""
        hit = super().transform_search_hit(
            pid, record_hit, links_factory=links_factory, **kwargs
        )
        filter_circulation(hit)
        field_cover_metadata(hit.get("metadata", {}).get("document", {}))
        return hit


class ItemJSONSerializer(JSONSerializer):
    """Serialize and filter item circulation status."""

    def transform_record(self, pid, record, links_factory=None, **kwargs):
        """Transform record into an intermediate representation."""
        item = super().transform_record(
            pid, record, links_factory=links_factory, **kwargs
        )
        filter_circulation(item)
        field_cover_metadata(item.get("metadata", {}).get("document", {}))
        return item

    def transform_search_hit(self, pid, record_hit, links_factory=None, **kwargs):
        """Transform search result hit into an intermediate representation."""
        hit = super().transform_search_hit(
            pid, record_hit, links_factory=links_factory, **kwargs
        )
        filter_circulation(hit)
        field_cover_metadata(hit.get("metadata", {}).get("document", {}))
        return hit
