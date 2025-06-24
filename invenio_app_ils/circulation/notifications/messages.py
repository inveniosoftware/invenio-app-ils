# -*- coding: utf-8 -*-
#
# Copyright (C) 2021-2025 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""Circulation notifications messages."""

import os

from flask import current_app
from invenio_circulation.api import get_available_item_by_doc_pid
from invenio_circulation.pidstore.pids import CIRCULATION_LOAN_PID_TYPE

from invenio_app_ils.notifications.messages import NotificationMsg


class NotificationLoanMsg(NotificationMsg):
    """Loan message class to generate the msg content."""

    TEMPLATES_DIR = "invenio_app_ils_circulation/notifications"

    DEFAULT_TEMPLATES = dict(
        request="request.html",
        request_no_items="request_no_items.html",
        checkout="checkout.html",
        self_checkout="self_checkout.html",
        checkin="checkin.html",
        extend="extend.html",
        cancel="cancel.html",
        update_dates="update_dates.html",
        overdue_reminder="overdue_reminder.html",
        expiring_reminder="will_expire_in_reminder.html",
        bulk_extend="bulk_extend.html",
    )

    def __init__(self, loan, action, msg_ctx, **kwargs):
        """Create message based on the record action."""
        self.loan = loan
        self.action = action
        tpl_path = self.get_templates_path(action)

        super().__init__(
            template=tpl_path,
            ctx=dict(loan=dict(loan), **msg_ctx, **kwargs),
            **kwargs,
        )

    def get_templates_path(self, action):
        """Get path of the messages template."""
        templates = dict(
            self.DEFAULT_TEMPLATES,
            **current_app.config["ILS_NOTIFICATIONS_TEMPLATES_CIRCULATION"],
        )

        if not action or action not in templates:
            raise KeyError(
                "Invalid loan action argument `{0}` or not found in "
                "templates `{1}`.".format(action, list(templates.keys()))
            )

        tpl_name = self.get_template_name(action)
        tpl_filename = templates[tpl_name]
        tpl_path = os.path.join(self.TEMPLATES_DIR, tpl_filename)
        return tpl_path

    def get_template_name(self, action):
        """Get the template filename based on the loan action."""
        new_state = self.loan["state"]
        document_pid = self.loan.get("document_pid")
        is_request = new_state in current_app.config["CIRCULATION_STATES_LOAN_REQUEST"]
        if (
            is_request
            and document_pid
            and not get_available_item_by_doc_pid(document_pid)
        ):
            return "request_no_items"
        return action

    def to_dict(self):
        """Dump obj."""
        d = super().to_dict()
        d.update(
            pid_value=self.loan["pid"],
            pid_type=CIRCULATION_LOAN_PID_TYPE,
            action=self.action,
        )
        return d


class NotificationBulkExtendLoanMsg(NotificationLoanMsg):
    """Adapt notification message for bulk extend action."""

    def __init__(self, action, msg_ctx, **kwargs):
        """Constructor."""
        super().__init__({}, action, msg_ctx, **kwargs)

    def get_template_name(self, action):
        """Get template name."""
        return action

    def to_dict(self):
        """Translate message to dict."""
        d = super(NotificationLoanMsg, self).to_dict()
        d.update(
            pid_type=CIRCULATION_LOAN_PID_TYPE,
            action=self.action,
        )
        return d


def notification_loan_msg_builder(loan, action, msg_ctx, **kwargs):
    """Factory builder to create a notification msg."""
    if action == "bulk_extend":
        return NotificationBulkExtendLoanMsg(action, msg_ctx, **kwargs)
    return NotificationLoanMsg(loan, action, msg_ctx, **kwargs)
