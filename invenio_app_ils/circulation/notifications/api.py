# -*- coding: utf-8 -*-
#
# Copyright (C) 2021-2025 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""Circulation notifications APIs."""

from flask import current_app
from invenio_records_rest.utils import obj_or_import_string

from invenio_app_ils.notifications.api import build_common_msg_ctx, send_notification
from invenio_app_ils.patrons.api import Patron


def _build_circulation_msg_ctx():
    """Return a dict with extra circulation ctx to pass to jinja templates."""
    return dict(
        circulation_delivery_methods=current_app.config[
            "ILS_CIRCULATION_DELIVERY_METHODS"
        ]
    )


def send_loan_notification(loan, action, msg_extra_ctx=None, **kwargs):
    """Send notification to patron about a loan action."""
    _filter = current_app.config["ILS_CIRCULATION_NOTIFICATIONS_FILTER"]
    if _filter and _filter(loan, action, **kwargs) is False:
        return

    msg_ctx = msg_extra_ctx or {}
    msg_ctx.update(build_common_msg_ctx(loan))
    msg_ctx.update(_build_circulation_msg_ctx())

    func_or_path = current_app.config["ILS_CIRCULATION_NOTIFICATIONS_MSG_BUILDER"]
    builder = obj_or_import_string(func_or_path)
    msg = builder(loan, action, msg_ctx, **kwargs)

    patron = msg_ctx["patron"]
    patrons = [patron]

    send_notification(patrons, msg, **kwargs)


def send_loan_overdue_reminder_notification(
    loan, days_ago, is_manually_triggered=False
):
    """Send loan overdue notification."""
    send_loan_notification(
        action="overdue_reminder",
        loan=loan,
        is_manually_triggered=is_manually_triggered,
        msg_extra_ctx=dict(days_ago=days_ago),
    )


def send_expiring_loan_reminder_notification(loan, expiring_in_days):
    """Send reminder notification."""
    send_loan_notification(
        action="expiring_reminder",
        loan=loan,
        msg_extra_ctx=dict(expiring_in_days=expiring_in_days),
    )


def send_dates_updated_notification(loan):
    """Send reminder notification."""
    send_loan_notification(
        action="update_dates",
        loan=loan,
    )


def send_bulk_extend_notification(
    extended_loans,
    not_extended_loans,
    patron_pid,
    action="bulk_extend",
    msg_extra_ctx=None,
    **kwargs
):
    """Send notification to patron about bulk extend action."""
    _filter = current_app.config["ILS_CIRCULATION_NOTIFICATIONS_FILTER"]
    if _filter and _filter({}, action, **kwargs) is False:
        return

    msg_ctx = msg_extra_ctx or {}
    msg_ctx["patron"] = Patron.get_patron(patron_pid)
    extended_loans_ctx, not_extended_loans_ctx = [], []
    for loan in extended_loans:
        context = {"loan": loan}
        context.update(build_common_msg_ctx(loan))
        extended_loans_ctx.append(context)
    for loan in not_extended_loans:
        context = {"loan": loan}
        context.update(build_common_msg_ctx(loan))
        not_extended_loans_ctx.append(context)

    msg_ctx.update(
        extended_loans=extended_loans_ctx, not_extended_loans_ctx=not_extended_loans_ctx
    )
    msg_ctx.update(_build_circulation_msg_ctx())

    func_or_path = current_app.config["ILS_CIRCULATION_NOTIFICATIONS_MSG_BUILDER"]
    builder = obj_or_import_string(func_or_path)
    msg = builder({}, action, msg_ctx, **kwargs)

    patron = msg_ctx["patron"]
    patrons = [patron]

    send_notification(patrons, msg, **kwargs)


def circulation_filter_notifications(record, action, **kwargs):
    """Filter notifications to be sent."""
    return True
