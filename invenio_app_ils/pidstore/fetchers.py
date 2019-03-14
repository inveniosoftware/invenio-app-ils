# -*- coding: utf-8 -*-
#
# Copyright (C) 2018 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""Circulation fetchers."""

from invenio_pidstore.fetchers import FetchedPID

from ..records.api import Document, InternalLocation, Item, Keyword, Location

from .pids import (  # isort:skip
    DOCUMENT_PID_TYPE,
    INTERNAL_LOCATION_PID_TYPE,
    ITEM_PID_TYPE,
    KEYWORD_PID_TYPE,
    LOCATION_PID_TYPE
)


def document_pid_fetcher(record_uuid, data):
    """Return Document PID fetcher."""
    return FetchedPID(
        provider=None,
        pid_type=DOCUMENT_PID_TYPE,
        pid_value=str(data[Document.pid_field])
    )


def item_pid_fetcher(record_uuid, data):
    """Return Item PID fetcher."""
    return FetchedPID(
        provider=None,
        pid_type=ITEM_PID_TYPE,
        pid_value=str(data[Item.pid_field])
    )


def location_pid_fetcher(record_uuid, data):
    """Return Location PID fetcher."""
    return FetchedPID(
        provider=None,
        pid_type=LOCATION_PID_TYPE,
        pid_value=str(data[Location.pid_field])
    )


def internal_location_pid_fetcher(record_uuid, data):
    """Return Internal location PID fetcher."""
    return FetchedPID(
        provider=None,
        pid_type=INTERNAL_LOCATION_PID_TYPE,
        pid_value=str(data[InternalLocation.pid_field])
    )


def keyword_pid_fetcher(record_uuid, data):
    """Return Keyword PID fetcher."""
    return FetchedPID(
        provider=None,
        pid_type=KEYWORD_PID_TYPE,
        pid_value=str(data[Keyword.pid_field])
    )
