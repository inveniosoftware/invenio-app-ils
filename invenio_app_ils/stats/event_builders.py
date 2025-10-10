# -*- coding: utf-8 -*-
#
# This file is part of Invenio.
# Copyright (C) 2025 CERN.
#
# Invenio is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details

"""ILS stats event builders."""

import datetime

from flask import g, has_request_context
from flask_login import current_user

from invenio_app_ils.permissions import backoffice_permission
from invenio_app_ils.records.api import IlsRecord


def ils_record_changed_event_builder(
    event, sender_app, method=None, record=None, **kwargs
):
    """Build an event for ILS record changes."""

    if not method:
        raise ValueError("Method must be provided to the event builder.")
    if not record:
        raise ValueError("Record must be provided to the event builder.")
    if not isinstance(record, IlsRecord):
        return None

    # We have to get the pid_type directly through the private accessor,
    # as the pid might not be registered directly after the record creation.
    pid_type = record._pid_type

    event_data = {
        "timestamp": datetime.datetime.now().isoformat(),
        "pid_type": pid_type,
        "method": method,
    }

    event.update(event_data)
    return event


def add_librarian_user_id_to_event(event, sender_app, **kwargs):
    """Add the user_id of the librarian performing the action to the event."""

    user_id = None
    if (
        current_user
        and current_user.is_authenticated
        and has_request_context()
        and backoffice_permission().allows(g.identity)
    ):
        user_id = current_user.get_id()

    event.update({"user_id": user_id})

    return event


def add_record_pid_to_event(event, sender_app, record=None, **kwargs):
    """Add the record pid to the event."""
    if not record:
        raise ValueError("Record must be provided to the event builder.")
    if not isinstance(record, IlsRecord):
        return event

    # We have to get the pid directly from the record,
    # as the pid might not be registered directly after the record creation.
    pid_value = record['pid']
    event.update({"pid_value": pid_value})

    return event