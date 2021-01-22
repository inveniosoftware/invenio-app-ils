# -*- coding: utf-8 -*-
#
# Copyright (C) 2020 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""ILS Document APIs."""

from functools import partial

from invenio_pidstore.models import PIDStatus
from invenio_pidstore.providers.recordid_v2 import RecordIdProviderV2

from invenio_app_ils.fetchers import pid_fetcher
from invenio_app_ils.minters import dummy_pid_minter

LITERATURE_PID_TYPE = "litid"
LITERATURE_PID_MINTER = "litid"
LITERATURE_PID_FETCHER = "litid"

LiteratureIdProvider = type(
    "DocumentIdProvider",
    (RecordIdProviderV2,),
    dict(pid_type=LITERATURE_PID_TYPE, default_status=PIDStatus.REGISTERED),
)
literature_pid_minter = dummy_pid_minter
literature_pid_fetcher = partial(
    pid_fetcher, provider_cls=LiteratureIdProvider
)
