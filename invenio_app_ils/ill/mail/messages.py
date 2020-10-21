# -*- coding: utf-8 -*-
#
# Copyright (C) 2020 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""ILL mail message."""
import os

from flask import current_app

from invenio_app_ils.mail.messages import BlockTemplatedMessage


class ILLMessage(BlockTemplatedMessage):
    """ILL message message."""

    TEMPLATES_DIR = "invenio_app_ils_ill/mail"

    DEFAULT_TEMPLATES = dict(
        extension_requested="patron_loan_extension_request.html",
        extension_accepted="patron_loan_extension_accept.html",
        extension_declined="patron_loan_extension_decline.html",
    )

    def __init__(self, record, action=None, message_ctx={}, **kwargs):
        """Create a ILL message based on the borrowing request record."""
        self.record = record

        templates = dict(
            self.DEFAULT_TEMPLATES,
            **current_app.config["ILS_ILL_MAIL_TEMPLATES"]
        )

        if not action:
            raise NotImplementedError

        if action not in templates:
            raise KeyError(
                "Invalid action argument `{0}` or not found in "
                "templates `{1}`.".format(action, list(templates.keys()))
            )

        super().__init__(
            template=os.path.join(self.TEMPLATES_DIR, templates[action]),
            ctx=dict(brw_req=dict(record), **message_ctx, **kwargs),
            **kwargs
        )

    def dump(self):
        """Dump borrowing request email data."""
        data = super().dump()
        data["borrowing_request_pid"] = self.record["pid"]
        return data
