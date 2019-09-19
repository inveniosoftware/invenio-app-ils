# -*- coding: utf-8 -*-
#
# Copyright (C) 2018 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""Ils serializers."""

from invenio_records_rest.serializers.json import JSONSerializer

from invenio_app_ils.permissions import circulation_permission


class ItemJSONSerializer(JSONSerializer):
    """Serialize and filter item circulation status."""

    FILTER_KEYS = [
        "loan_pid",
        "patron_pid",
        "start_date",
        "end_date",
        "extension_count",
    ]

    def transform_record(self, pid, record, links_factory=None, **kwargs):
        """Transform record into an intermediate representation."""
        item = super(ItemJSONSerializer, self).transform_record(
            pid,
            record,
            links_factory=links_factory,
            **kwargs
        )
        self.filter_circulation(item)
        return item

    def transform_search_hit(self, pid, record_hit, links_factory=None,
                             **kwargs):
        """Transform search result hit into an intermediate representation."""
        hit = super(ItemJSONSerializer, self).transform_search_hit(
            pid,
            record_hit,
            links_factory=links_factory,
            **kwargs
        )
        self.filter_circulation(hit)
        return hit

    def filter_circulation(self, data):
        """Filter circulation status depending on user permissions."""
        if "circulation" in data["metadata"]:
            circulation = data["metadata"]["circulation"]
            patron_pid = circulation.get("patron_pid", None)
            if not patron_pid:
                return circulation

            allowed = circulation_permission(patron_pid).can()

            if not allowed:
                for key in self.FILTER_KEYS:
                    if key in circulation:
                        del circulation[key]

            data["metadata"]["circulation"] = circulation
