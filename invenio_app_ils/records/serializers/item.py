# -*- coding: utf-8 -*-
#
# Copyright (C) 2018 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""Ils serializers."""

from invenio_records_rest.serializers.json import JSONSerializer

from invenio_app_ils.permissions import circulation_status_permission


class ItemJSONSerializer(JSONSerializer):
    """Serialize and filter item circulation status."""

    FILTER_KEYS = [
        "loan_pid",
        "patron_pid",
        "start_date",
        "end_date",
        "extension_count",
        "request_expire_date",
    ]

    def transform_record(self, pid, record, links_factory=None, **kwargs):
        """Transform record into an intermediate representation."""
        item = super(ItemJSONSerializer, self).transform_record(
            pid,
            record,
            links_factory=links_factory,
            **kwargs
        )
        self.filter_circulation_status(item)
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
        self.filter_circulation_status(hit)
        return hit

    def filter_circulation_status(self, data):
        """Filter circulation status depending on user permissions."""
        if "circulation_status" in data["metadata"]:
            circulation_status = data["metadata"]["circulation_status"]
            patron_pid = circulation_status.get("patron_pid", None)
            if not patron_pid:
                return circulation_status

            allowed = circulation_status_permission(patron_pid).can()

            if not allowed:
                for key in self.FILTER_KEYS:
                    if key in circulation_status:
                        del circulation_status[key]

            data["metadata"]["circulation_status"] = circulation_status
