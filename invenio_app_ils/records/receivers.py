# SPDX-FileCopyrightText: 2021 CERN.
# SPDX-License-Identifier: MIT

"""E-Item receivers."""

from invenio_records.signals import after_record_delete

from invenio_app_ils.records.listeners import record_delete_listener


def register_record_signals():
    """Register record signals."""
    after_record_delete.connect(record_delete_listener, weak=False)
