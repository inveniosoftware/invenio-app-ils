# -*- coding: utf-8 -*-
#
# Copyright (C) 2020 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""Ils Internal Locations API."""

from functools import partial

from flask import current_app
from invenio_pidstore.models import PIDStatus
from invenio_pidstore.providers.recordid_v2 import RecordIdProviderV2

from invenio_app_ils.errors import RecordHasReferencesError
from invenio_app_ils.fetchers import pid_fetcher
from invenio_app_ils.minters import pid_minter
from invenio_app_ils.proxies import current_app_ils
from invenio_app_ils.records.api import IlsRecord

INTERNAL_LOCATION_PID_TYPE = "ilocid"
INTERNAL_LOCATION_PID_MINTER = "ilocid"
INTERNAL_LOCATION_PID_FETCHER = "ilocid"

InternalLocationIdProvider = type(
    "InternalLocationIdProvider",
    (RecordIdProviderV2,),
    dict(pid_type=INTERNAL_LOCATION_PID_TYPE, default_status=PIDStatus.REGISTERED),
)
internal_location_pid_minter = partial(pid_minter, provider_cls=InternalLocationIdProvider)
internal_location_pid_fetcher = partial(pid_fetcher, provider_cls=InternalLocationIdProvider)


class InternalLocation(IlsRecord):
    """Internal Location record class."""

    _pid_type = INTERNAL_LOCATION_PID_TYPE
    _schema = "internal_locations/internal_location-v1.0.0.json"
    _location_resolver_path = (
        "{scheme}://{host}/api/resolver/"
        "internal-locations/{internal_location_pid}/location"
    )

    @classmethod
    def build_resolver_fields(cls, data):
        """Build all resolver fields."""
        data["location"] = {
            "$ref": cls._location_resolver_path.format(
                scheme=current_app.config["JSONSCHEMAS_URL_SCHEME"],
                host=current_app.config["JSONSCHEMAS_HOST"],
                internal_location_pid=data["pid"],
            )
        }

    @classmethod
    def create(cls, data, id_=None, **kwargs):
        """Create Internal Location record."""
        cls.build_resolver_fields(data)
        return super().create(data, id_=id_, **kwargs)

    def update(self, *args, **kwargs):
        """Update InternalLocation data."""
        super().update(*args, **kwargs)
        self.build_resolver_fields(self)

    def delete(self, **kwargs):
        """Delete Location record."""
        item_search = current_app_ils.item_search_cls()
        item_search_res = item_search.search_by_internal_location_pid(
            internal_location_pid=self["pid"]
        )

        if item_search_res.count():
            raise RecordHasReferencesError(
                record_type="Internal Location",
                record_id=self["pid"],
                ref_type="Item",
                ref_ids=sorted([res["pid"] for res in item_search_res.scan()]),
            )
        return super().delete(**kwargs)
