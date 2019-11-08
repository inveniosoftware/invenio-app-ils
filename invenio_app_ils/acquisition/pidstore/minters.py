# -*- coding: utf-8 -*-
#
# Copyright (C) 2018 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""Acquisition minters."""

from .providers import VendorIdProvider


def vendor_pid_minter(record_uuid, data):
    """Mint Vendor identifiers."""
    assert "pid" not in data
    provider = VendorIdProvider.create(
        object_type='rec',
        object_uuid=record_uuid,
    )
    data["pid"] = provider.pid.pid_value
    return provider.pid
