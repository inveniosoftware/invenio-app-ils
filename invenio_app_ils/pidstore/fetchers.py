# -*- coding: utf-8 -*-
#
# Copyright (C) 2018 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""ILS fetchers."""

from invenio_pidstore.fetchers import FetchedPID

from .pids import (  # isort:skip
    EITEM_PID_TYPE,
    INTERNAL_LOCATION_PID_TYPE,
    ITEM_PID_TYPE,
    LOCATION_PID_TYPE,
    PATRON_PID_TYPE,
    SERIES_PID_TYPE,
    VOCABULARY_PID_TYPE,
)


def item_pid_fetcher(record_uuid, data):
    """Return Item PID fetcher."""
    return FetchedPID(
        provider=None,
        pid_type=ITEM_PID_TYPE,
        pid_value=str(data["pid"])
    )


def eitem_pid_fetcher(record_uuid, data):
    """Return EItem PID fetcher."""
    return FetchedPID(
        provider=None,
        pid_type=EITEM_PID_TYPE,
        pid_value=str(data["pid"])
    )


def location_pid_fetcher(record_uuid, data):
    """Return Location PID fetcher."""
    return FetchedPID(
        provider=None,
        pid_type=LOCATION_PID_TYPE,
        pid_value=str(data["pid"])
    )


def internal_location_pid_fetcher(record_uuid, data):
    """Return InternalLocation PID fetcher."""
    return FetchedPID(
        provider=None,
        pid_type=INTERNAL_LOCATION_PID_TYPE,
        pid_value=str(data["pid"])
    )


def series_pid_fetcher(record_uuid, data):
    """Return Series PID fetcher."""
    return FetchedPID(
        provider=None,
        pid_type=SERIES_PID_TYPE,
        pid_value=str(data["pid"])
    )


def patron_pid_fetcher(record_uuid, data):
    """Dummy patron fetcher."""
    return FetchedPID(
        provider=None,
        pid_type=PATRON_PID_TYPE,
        pid_value=str(data['id']),
    )


def vocabulary_pid_fetcher(record_uuid, data):
    """Dummy vocabulary fetcher."""
    return FetchedPID(
        provider=None,
        pid_type=VOCABULARY_PID_TYPE,
        pid_value=str(data['id']),
    )
