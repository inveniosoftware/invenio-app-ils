# SPDX-FileCopyrightText: 2020 CERN.
# SPDX-License-Identifier: MIT

"""ILS fetchers."""

from invenio_pidstore.fetchers import FetchedPID


def pid_fetcher(record_uuid, data, provider_cls, pid_field="pid"):
    """Generic ILS PID fetcher."""
    return FetchedPID(
        provider=provider_cls,
        pid_type=provider_cls.pid_type,
        pid_value=str(data[pid_field]),
    )
