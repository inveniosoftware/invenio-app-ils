# -*- coding: utf-8 -*-
#
# Copyright (C) 2020 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""Document requests mail message objects."""
import os

from flask import current_app

from invenio_app_ils.document_requests.api import DOCUMENT_REQUEST_PID_TYPE
from invenio_app_ils.mail.messages import BlockTemplatedMessage


class DocumentRequestMessage(BlockTemplatedMessage):
    """Document request message."""

    TEMPLATES_DIR = "invenio_app_ils_document_requests/mail"

    DEFAULT_TEMPLATES = dict(
        request_accepted="document_request_accept.html",
        request_declined_user_cancel="document_request_decline_user_cancel.html",  # noqa
        request_declined_in_catalog="document_request_decline_in_catalog.html",
        request_declined_not_found="document_request_decline_not_found.html",
        request_declined_other="document_request_decline_other.html"
    )

    def __init__(self, request, action=None, message_ctx={}, **kwargs):
        """Create an e-mail message based on the new doc request record."""
        self.request = request
        self.action = action

        templates = dict(
            self.DEFAULT_TEMPLATES,
            **current_app.config["ILS_DOCUMENT_REQUEST_MAIL_TEMPLATES"]
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

        super().__init__(
            template=os.path.join(self.TEMPLATES_DIR, templates[action]),
            ctx=dict(request=dict(request), **message_ctx, **kwargs),
            **kwargs
        )

    def dump(self):
        """Dump document request email data."""
        data = super().dump()
        data["pid_value"] = self.request["pid"]
        data["pid_type"] = DOCUMENT_REQUEST_PID_TYPE
        data["action"] = self.action
        return data
