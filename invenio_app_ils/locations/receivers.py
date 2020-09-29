# -*- coding: utf-8 -*-
#
# Copyright (C) 2020 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""Location receivers."""

from invenio_records.signals import after_record_update

from invenio_app_ils.closures.tasks import notify_location_updated
from invenio_app_ils.proxies import current_app_ils


def register_location_signals():
    """Register location signals."""
    after_record_update.connect(record_update_listener, weak=False)


def record_update_listener(sender, *args, **kwargs):
    """Listens for record updates (not insertions)."""
    record = kwargs['record']
    if isinstance(record, current_app_ils.location_record_cls):
        notify_location_updated(record['pid'])
