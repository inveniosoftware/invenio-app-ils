# -*- coding: utf-8 -*-
#
# Copyright (C) 2020 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""Document requests mail message objects."""

from flask import current_app

from invenio_app_ils.mail.messages import BlockTemplatedMessage


class DocumentRequestMessage(BlockTemplatedMessage):
    """Document request message."""

    TEMPLATES_DIR = "invenio_app_ils_document_requests/mail"

    DEFAULT_TEMPLATES = dict(
        accepted="state_accepted.html",
        pending="state_pending.html",
        rejected_user_cancel="state_rejected_user_cancel.html",
        rejected_in_catalog="state_rejected_in_catalog.html",
        rejected_not_found="state_rejected_not_found.html",
    )

    def __init__(self, request, **kwargs):
        """Create a document request message based on the request record."""
        self.request = request

        sender = current_app.config["MAIL_NOTIFY_SENDER"]
        bcc = current_app.config["MAIL_NOTIFY_BCC"]
        cc = current_app.config["MAIL_NOTIFY_CC"]

        state = request["state"]
        reject_reason = request.get("reject_reason", "")

        name = state.lower()
        if state == "REJECTED":
            name = "{}_{}".format(state.lower(), reject_reason.lower())

        templates = dict(
            self.DEFAULT_TEMPLATES,
            **current_app.config["ILS_MAIL_DOCUMENT_REQUEST_TEMPLATES"]
        )

        super().__init__(
            template="{}/{}".format(self.TEMPLATES_DIR, templates[name]),
            ctx=dict(request=dict(request)),
            sender=kwargs.pop("sender", sender),
            cc=kwargs.pop("cc", cc),
            bcc=kwargs.pop("bcc", bcc),
            **kwargs
        )

    def dump(self):
        """Dump document request email data."""
        data = super().dump()
        data["document_request_pid"] = self.request["pid"]
        return data
