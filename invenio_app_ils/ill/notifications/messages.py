# -*- coding: utf-8 -*-
#
# Copyright (C) 2021 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""ILL notifications messages."""

import os

from flask import current_app

from invenio_app_ils.ill.api import BORROWING_REQUEST_PID_TYPE
from invenio_app_ils.notifications.messages import NotificationMsg


class NotificationILLMsg(NotificationMsg):
    """ILL message class to generate the msg content."""

    TEMPLATES_DIR = "invenio_app_ils_ill/notifications"

    DEFAULT_TEMPLATES = dict(
        extension_requested="patron_loan_extension_request.html",
        extension_accepted="patron_loan_extension_accept.html",
        extension_declined="patron_loan_extension_decline.html",
    )

    def __init__(self, record, action, msg_ctx, **kwargs):
        """Create message based on the record action."""
        self.record = record
        self.action = action

        templates = dict(
            self.DEFAULT_TEMPLATES,
            **current_app.config["ILS_ILL_NOTIFICATIONS_TEMPLATES"],
        )

        if not action or action not in templates:
            raise KeyError(
                "Invalid action argument `{0}` or not found in "
                "templates `{1}`.".format(action, list(templates.keys()))
            )

        tpl_filename = templates[action]
        tpl_path = os.path.join(self.TEMPLATES_DIR, tpl_filename)
        super().__init__(
            template=tpl_path,
            ctx=dict(brw_req=dict(record), **msg_ctx, **kwargs),
            **kwargs,
        )

    def to_dict(self):
        """Dump obj."""
        d = super().to_dict()
        d.update(
            pid_value=self.record["pid"],
            pid_type=BORROWING_REQUEST_PID_TYPE,
            action=self.action,
        )
        return d


def notification_ill_msg_builder(record, action, msg_ctx, **kwargs):
    """Factory builder to create a notification msg."""
    return NotificationILLMsg(record, action, msg_ctx, **kwargs)
