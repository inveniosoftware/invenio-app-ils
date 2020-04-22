# -*- coding: utf-8 -*-
#
# Copyright (C) 2019-2020 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""ILS APIs."""

from __future__ import absolute_import, print_function

from flask import current_app
from invenio_accounts.models import User


def get_default_location(item_pid):
    """Return default location."""
    return current_app.config["ILS_DEFAULT_LOCATION_PID"]


def patron_exists(patron_pid):
    """Return True if the Patron exists given a PID."""
    return User.query.filter_by(id=patron_pid).first() is not None
