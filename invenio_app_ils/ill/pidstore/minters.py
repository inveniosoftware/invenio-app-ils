# -*- coding: utf-8 -*-
#
# Copyright (C) 2019 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""ILL minters."""

from .providers import BorrowingRequestIdProvider, LibraryIdProvider


def library_pid_minter(record_uuid, data):
    """Mint Library identifiers."""
    assert "pid" not in data
    provider = LibraryIdProvider.create(
        object_type='rec',
        object_uuid=record_uuid,
    )
    data["pid"] = provider.pid.pid_value
    return provider.pid


def borrowing_request_pid_minter(record_uuid, data):
    """Mint Borrowing Request identifiers."""
    assert "pid" not in data
    provider = BorrowingRequestIdProvider.create(
        object_type='rec',
        object_uuid=record_uuid,
    )
    data["pid"] = provider.pid.pid_value
    return provider.pid
