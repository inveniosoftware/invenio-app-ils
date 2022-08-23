# -*- coding: utf-8 -*-
#
# Copyright (C) 2020 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""Ils Locations API."""

from functools import partial

from invenio_pidstore.models import PIDStatus
from invenio_pidstore.providers.recordid_v2 import RecordIdProviderV2

from invenio_app_ils.errors import RecordHasReferencesError
from invenio_app_ils.fetchers import pid_fetcher
from invenio_app_ils.minters import pid_minter
from invenio_app_ils.proxies import current_app_ils
from invenio_app_ils.records.api import IlsRecord

LOCATION_PID_TYPE = "locid"
LOCATION_PID_MINTER = "locid"
LOCATION_PID_FETCHER = "locid"

LocationIdProvider = type(
    "LocationIdProvider",
    (RecordIdProviderV2,),
    dict(pid_type=LOCATION_PID_TYPE, default_status=PIDStatus.REGISTERED),
)
location_pid_minter = partial(pid_minter, provider_cls=LocationIdProvider)
location_pid_fetcher = partial(pid_fetcher, provider_cls=LocationIdProvider)


class Location(IlsRecord):
    """Location record class."""

    _pid_type = LOCATION_PID_TYPE
    _schema = "locations/location-v1.0.0.json"

    @classmethod
    def create(cls, data, id_=None, **kwargs):
        """Create Location record."""
        return super().create(data, id_=id_, **kwargs)

    def delete(self, **kwargs):
        """Delete Location record."""
        iloc_search = current_app_ils.internal_location_search_cls()
        iloc_search_res = iloc_search.search_by_location_pid(location_pid=self["pid"])
        if iloc_search_res.count():
            raise RecordHasReferencesError(
                record_type="Location",
                record_id=self["pid"],
                ref_type="Internal Location",
                ref_ids=sorted([res["pid"] for res in iloc_search_res.scan()]),
            )
        rec = super().delete(**kwargs)

        try:
            # invalidate cached property
            del current_app_ils.get_default_location_pid
        except (AttributeError, KeyError):
            pass

        return rec
