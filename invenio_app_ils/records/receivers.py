# -*- coding: utf-8 -*-
#
# Copyright (C) 2021 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""E-Item receivers."""

from invenio_records.signals import after_record_delete

from invenio_app_ils.records.listeners import record_delete_listener


def register_record_signals():
    """Register record signals."""
    after_record_delete.connect(record_delete_listener, weak=False)
