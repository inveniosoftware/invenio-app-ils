# -*- coding: utf-8 -*-
#
# Copyright (C) 2020 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""ILS fetchers."""

from invenio_pidstore.fetchers import FetchedPID


def pid_fetcher(record_uuid, data, provider_cls, pid_field="pid"):
    """Generic ILS PID fetcher."""
    return FetchedPID(
        provider=provider_cls,
        pid_type=provider_cls.pid_type,
        pid_value=str(data[pid_field]),
    )
