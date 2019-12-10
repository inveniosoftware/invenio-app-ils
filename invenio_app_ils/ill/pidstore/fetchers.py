# -*- coding: utf-8 -*-
#
# Copyright (C) 2019 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""ILL fetchers."""

from invenio_pidstore.fetchers import FetchedPID

from .pids import BORROWING_REQUEST_PID_TYPE, LIBRARY_PID_TYPE


def library_pid_fetcher(record_uuid, data):
    """Return Library PID fetcher."""
    return FetchedPID(
        provider=None,
        pid_type=LIBRARY_PID_TYPE,
        pid_value=str(data["pid"])
    )


def borrowing_request_pid_fetcher(record_uuid, data):
    """Return Borrowing Request PID fetcher."""
    return FetchedPID(
        provider=None,
        pid_type=BORROWING_REQUEST_PID_TYPE,
        pid_value=str(data["pid"])
    )
