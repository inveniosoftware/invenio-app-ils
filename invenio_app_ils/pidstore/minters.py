# -*- coding: utf-8 -*-
#
# Copyright (C) 2018 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""Circulation minters."""

from .providers import DocumentIdProvider, EItemIdProvider, \
    InternalLocationIdProvider, ItemIdProvider, LocationIdProvider, \
    SeriesIdProvider, TagIdProvider


def document_pid_minter(record_uuid, data):
    """Mint Document identifiers."""
    assert "pid" not in data
    provider = DocumentIdProvider.create(
        object_type='rec',
        object_uuid=record_uuid,
    )
    data["pid"] = provider.pid.pid_value
    return provider.pid


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


def tag_pid_minter(record_uuid, data):
    """Mint tag identifiers."""
    assert "pid" not in data
    provider = TagIdProvider.create(
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
