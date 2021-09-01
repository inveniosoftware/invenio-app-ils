# -*- coding: utf-8 -*-
#
# Copyright (C) 2021 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""Notifications backends."""

from .mail import send as send_email


def notifications_backend_builder(**kwargs):
    """Factory builder to return a list of backend to use to send notif."""
    return [send_email]
