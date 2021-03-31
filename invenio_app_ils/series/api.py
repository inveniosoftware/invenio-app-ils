# -*- coding: utf-8 -*-
#
# Copyright (C) 2020 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""Ils series API."""

from functools import partial

from flask import current_app
from invenio_pidstore.models import PIDStatus
from invenio_pidstore.providers.recordid_v2 import RecordIdProviderV2

from invenio_app_ils.fetchers import pid_fetcher
from invenio_app_ils.minters import pid_minter
from invenio_app_ils.records_relations.api import IlsRecordWithRelations

SERIES_PID_TYPE = "serid"
SERIES_PID_MINTER = "serid"
SERIES_PID_FETCHER = "serid"

SeriesIdProvider = type(
    "SeriesIdProvider",
    (RecordIdProviderV2,),
    dict(pid_type=SERIES_PID_TYPE, default_status=PIDStatus.REGISTERED),
)
series_pid_minter = partial(pid_minter, provider_cls=SeriesIdProvider)
series_pid_fetcher = partial(pid_fetcher, provider_cls=SeriesIdProvider)


class Series(IlsRecordWithRelations):
    """Series record class."""

    SERIES_TYPES = ["SERIAL", "PERIODICAL"]

    _pid_type = SERIES_PID_TYPE
    _schema = "series/series-v1.0.0.json"
    _relations_path = (
        "{scheme}://{host}/api/resolver/series/{series_pid}/relations"
    )

    MODE_OF_ISSUANCE = [
        "MULTIPART_MONOGRAPH",
        "SERIAL",
    ]

    @classmethod
    def build_resolver_fields(cls, data):
        """Build all resolver fields."""
        data.setdefault("relations", {})
        data["relations"] = {
            "$ref": cls._relations_path.format(
                scheme=current_app.config["JSONSCHEMAS_URL_SCHEME"],
                host=current_app.config["JSONSCHEMAS_HOST"],
                series_pid=data["pid"],
            )
        }

    @classmethod
    def create(cls, data, id_=None, **kwargs):
        """Create Series record."""
        cls.build_resolver_fields(data)
        return super().create(data, id_=id_, **kwargs)

    def update(self, *args, **kwargs):
        """Update Series record."""
        super().update(*args, **kwargs)
        self.build_resolver_fields(self)
