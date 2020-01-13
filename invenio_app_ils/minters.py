# -*- coding: utf-8 -*-
#
# Copyright (C) 2020 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""ILS minters."""


def pid_minter(record_uuid, data, provider_cls):
    """Generic ILS PID minter."""
    provider = provider_cls.create(object_type="rec", object_uuid=record_uuid)
    data["pid"] = provider.pid.pid_value
    return provider.pid


def dummy_pid_minter(record_uuid, data):
    """Dummy minter."""
    return None
