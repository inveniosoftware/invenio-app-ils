# -*- coding: utf-8 -*-
#
# Copyright (C) 2018 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""Circulation minters."""

from ..records.api import Document, EItem, InternalLocation, Item, Keyword, \
    Location, Series
from .providers import DocumentIdProvider, EItemIdProvider, \
    InternalLocationIdProvider, ItemIdProvider, KeywordIdProvider, \
    LocationIdProvider, SeriesIdProvider


def document_pid_minter(record_uuid, data):
    """Mint Document identifiers."""
    assert Document.pid_field not in data
    provider = DocumentIdProvider.create(
        object_type='rec',
        object_uuid=record_uuid,
    )
    data[Document.pid_field] = provider.pid.pid_value
    return provider.pid


def item_pid_minter(record_uuid, data):
    """Mint Item identifiers."""
    assert Item.pid_field not in data
    provider = ItemIdProvider.create(
        object_type='rec',
        object_uuid=record_uuid,
    )
    data[Item.pid_field] = provider.pid.pid_value
    return provider.pid


def eitem_pid_minter(record_uuid, data):
    """Mint EItem identifiers."""
    assert EItem.pid_field not in data
    provider = EItemIdProvider.create(
        object_type='rec',
        object_uuid=record_uuid,
    )
    data[EItem.pid_field] = provider.pid.pid_value
    return provider.pid


def location_pid_minter(record_uuid, data):
    """Mint location identifiers."""
    assert Location.pid_field not in data
    provider = LocationIdProvider.create(
        object_type='rec',
        object_uuid=record_uuid,
    )
    data[Location.pid_field] = provider.pid.pid_value
    return provider.pid


def internal_location_pid_minter(record_uuid, data):
    """Mint internal location identifiers."""
    assert InternalLocation.pid_field not in data
    provider = InternalLocationIdProvider.create(
        object_type='rec',
        object_uuid=record_uuid,
    )
    data[InternalLocation.pid_field] = provider.pid.pid_value
    return provider.pid


def keyword_pid_minter(record_uuid, data):
    """Mint keyword identifiers."""
    assert Keyword.pid_field not in data
    provider = KeywordIdProvider.create(
        object_type='rec',
        object_uuid=record_uuid,
    )
    data[Keyword.pid_field] = provider.pid.pid_value
    return provider.pid


def series_pid_minter(record_uuid, data):
    """Mint Series identifiers."""
    assert Series.pid_field not in data
    provider = SeriesIdProvider.create(
        object_type='rec',
        object_uuid=record_uuid,
    )
    data[Series.pid_field] = provider.pid.pid_value
    return provider.pid


def patron_pid_minter(record_uuid, data):
    """Dummy patron minter."""
    return None
