# -*- coding: utf-8 -*-
#
# Copyright (C) 2018 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""Circulation minters."""

from ..config import _DOCUMENT_PID_TYPE, _ITEM_PID_TYPE, _LOCATION_PID_TYPE
from .providers import DocumentIdProvider, ItemIdProvider, LocationIdProvider


def document_pid_minter(record_uuid, data):
    """Mint DOCUMENT identifiers."""
    assert _DOCUMENT_PID_TYPE not in data
    provider = DocumentIdProvider.create(
        object_type='rec',
        object_uuid=record_uuid,
    )
    data[_DOCUMENT_PID_TYPE] = provider.pid.pid_value
    return provider.pid


def item_pid_minter(record_uuid, data):
    """Mint item identifiers."""
    assert _ITEM_PID_TYPE not in data
    provider = ItemIdProvider.create(
        object_type='rec',
        object_uuid=record_uuid,
    )
    data[_ITEM_PID_TYPE] = provider.pid.pid_value
    return provider.pid


def location_pid_minter(record_uuid, data):
    """Mint location identifiers."""
    assert _LOCATION_PID_TYPE not in data
    provider = LocationIdProvider.create(
        object_type='rec',
        object_uuid=record_uuid,
    )
    data[_LOCATION_PID_TYPE] = provider.pid.pid_value
    return provider.pid
