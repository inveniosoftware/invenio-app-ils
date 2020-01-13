# -*- coding: utf-8 -*-
#
# Copyright (C) 2018 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""ILS minters."""

from .providers import EItemIdProvider, InternalLocationIdProvider, \
    ItemIdProvider, LocationIdProvider, SeriesIdProvider


def item_pid_minter(record_uuid, data):
    """Mint Item identifiers."""
    assert "pid" not in data
    provider = ItemIdProvider.create(
        object_type='rec',
        object_uuid=record_uuid,
    )
    data["pid"] = provider.pid.pid_value
    return provider.pid


def eitem_pid_minter(record_uuid, data):
    """Mint EItem identifiers."""
    assert "pid" not in data
    provider = EItemIdProvider.create(
        object_type='rec',
        object_uuid=record_uuid,
    )
    data["pid"] = provider.pid.pid_value
    return provider.pid


def location_pid_minter(record_uuid, data):
    """Mint location identifiers."""
    assert "pid" not in data
    provider = LocationIdProvider.create(
        object_type='rec',
        object_uuid=record_uuid,
    )
    data["pid"] = provider.pid.pid_value
    return provider.pid


def internal_location_pid_minter(record_uuid, data):
    """Mint internal location identifiers."""
    assert "pid" not in data
    provider = InternalLocationIdProvider.create(
        object_type='rec',
        object_uuid=record_uuid,
    )
    data["pid"] = provider.pid.pid_value
    return provider.pid


def series_pid_minter(record_uuid, data):
    """Mint Series identifiers."""
    assert "pid" not in data
    provider = SeriesIdProvider.create(
        object_type='rec',
        object_uuid=record_uuid,
    )
    data["pid"] = provider.pid.pid_value
    return provider.pid


def patron_pid_minter(record_uuid, data):
    """Dummy patron minter."""
    return None


def vocabulary_pid_minter(record_uuid, data):
    """Dummy vocabulary minter."""
    return None
