# -*- coding: utf-8 -*-
#
# Copyright (C) 2018 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""Helpers for tests."""

from __future__ import absolute_import, print_function

from invenio_db import db
from invenio_pidstore.models import PersistentIdentifier, PIDStatus


def mint_record_pid(pid_type, record):
    """Mint the given PID for the given record."""
    PersistentIdentifier.create(
        pid_type=pid_type,
        pid_value=record[pid_type],
        object_type='rec',
        object_uuid=record.id,
        status=PIDStatus.REGISTERED
    )
    db.session.commit()
