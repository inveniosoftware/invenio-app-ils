# SPDX-FileCopyrightText: 2021 CERN.
# SPDX-License-Identifier: MIT

"""Notifications backends."""

from .mail import send as send_email


def notifications_backend_builder(**kwargs):
    """Factory builder to return a list of backend to use to send notif."""
    return [send_email]
