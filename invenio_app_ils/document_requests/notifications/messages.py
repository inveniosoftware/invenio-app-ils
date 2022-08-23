# -*- coding: utf-8 -*-
#
# Copyright (C) 2021 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""Document requests notifications messages."""

import os

from flask import current_app

from invenio_app_ils.document_requests.api import DOCUMENT_REQUEST_PID_TYPE
from invenio_app_ils.notifications.messages import NotificationMsg


class NotificationDocumentRequestMsg(NotificationMsg):
    """Document request message class to generate the msg content."""

    TEMPLATES_DIR = "invenio_app_ils_document_requests/notifications"

    DEFAULT_TEMPLATES = dict(
        request_accepted="document_request_accept.html",
        request_declined_user_cancel="document_request_decline_user_cancel.html",  # noqa
        request_declined_in_catalog="document_request_decline_in_catalog.html",
        request_declined_not_found="document_request_decline_not_found.html",
        request_declined_other="document_request_decline_other.html",
    )

    def __init__(self, request, action, msg_ctx, **kwargs):
        """Create message based on the record action."""
        self.request = request
        self.action = action

        templates = dict(
            self.DEFAULT_TEMPLATES,
            **current_app.config["ILS_NOTIFICATIONS_TEMPLATES_DOCUMENT_REQUEST"],
        )

        if not action:
            raise NotImplementedError

        if action == "request_declined":
            decline_reason = request.get("decline_reason", "")
            action = "{}_{}".format(action, decline_reason.lower())

        if action not in templates:
            raise KeyError(
                "Invalid action argument `{0}` or not found in "
                "templates `{1}`.".format(action, list(templates.keys()))
            )

        tpl_filename = templates[action]
        tpl_path = os.path.join(self.TEMPLATES_DIR, tpl_filename)
        super().__init__(
            template=tpl_path,
            ctx=dict(request=dict(request), **msg_ctx, **kwargs),
            **kwargs,
        )

    def to_dict(self):
        """Dump obj."""
        d = super().to_dict()
        d.update(
            pid_value=self.request["pid"],
            pid_type=DOCUMENT_REQUEST_PID_TYPE,
            action=self.action,
        )
        return d


def notification_document_request_msg_builder(record, action, msq_extra_ctx, **kwargs):
    """Factory builder to create a notification msg."""
    return NotificationDocumentRequestMsg(record, action, msq_extra_ctx, **kwargs)
