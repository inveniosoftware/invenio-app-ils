# -*- coding: utf-8 -*-
#
# Copyright (C) 2020 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""Document requests mail message objects."""
import os

from flask import current_app

from invenio_app_ils.mail.messages import BlockTemplatedMessage


class DocumentRequestMessage(BlockTemplatedMessage):
    """Document request message."""

    TEMPLATES_DIR = "invenio_app_ils_document_requests/mail"

    DEFAULT_TEMPLATES = dict(
        request_accepted="document_request_accept.html",
        request_rejected_user_cancel="document_request_reject_user_cancel.html",
        request_rejected_in_catalog="document_request_reject_in_catalog.html",
        request_rejected_not_found="document_request_reject_not_found.html",
    )

    def __init__(self, request, action=None, message_ctx={}, **kwargs):
        """Create an e-mail message based on the new doc request record."""
        self.request = request

        templates = dict(
            self.DEFAULT_TEMPLATES,
            **current_app.config["ILS_DOCUMENT_REQUEST_MAIL_TEMPLATES"]
        )

        if not action:
            raise NotImplementedError

        if action == "request_rejected":
            reject_reason = request.get("reject_reason", "")
            action = "{}_{}".format(action, reject_reason.lower())

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
        data["document_request_pid"] = self.request["pid"]
        return data
