# -*- coding: utf-8 -*-
#
# Copyright (C) 2018 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""Acquisition fetchers."""

from invenio_pidstore.fetchers import FetchedPID

from .pids import ORDER_PID_TYPE, VENDOR_PID_TYPE


def vendor_pid_fetcher(record_uuid, data):
    """Return Vendor PID fetcher."""
    return FetchedPID(
        provider=None,
        pid_type=VENDOR_PID_TYPE,
        pid_value=str(data["pid"])
    )

def order_pid_fetcher(record_uuid, data):
    """Return Order PID fetcher."""
    return FetchedPID(
        provider=None,
        pid_type=ORDER_PID_TYPE,
        pid_value=str(data["pid"])
    )