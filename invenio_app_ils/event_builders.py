# -*- coding: utf-8 -*-
#
# Copyright (C) 2019 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""ILS event builders."""

from __future__ import absolute_import, print_function


def eitem_event_builder(event, sender_app, obj=None, **kwargs):
    """Add eitem metadata to the event."""
    record = kwargs["record"]
    event.update(dict(
        eitem_pid=record["pid"],
        document_pid=record.get("document_pid")
    ))
    return event
