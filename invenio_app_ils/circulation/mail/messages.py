# -*- coding: utf-8 -*-
#
# Copyright (C) 2019 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""Circulation mail message objects."""

from flask import current_app
from invenio_circulation.api import get_available_item_by_doc_pid

from invenio_app_ils.mail.messages import BlockTemplatedMessage


class LoanMessage(BlockTemplatedMessage):
    """Loan message."""

    templates_base_dir = "invenio_app_ils_mail/circulation"

    default_templates = dict(
        request="request.html",
        request_no_items="request_no_items.html",
        checkout="checkout.html",
        checkin="checkin.html",
        extend="extend.html",
        cancel="cancel.html",
        overdue_reminder="overdue.html",
    )

    def __init__(self, trigger, message_ctx, **kwargs):
        """Create loan message based on the trigger."""
        self.trigger = trigger
        self.loan = message_ctx.get("loan", {})
        templates = dict(
            self.default_templates,
            **current_app.config["ILS_MAIL_LOAN_TEMPLATES"]
        )
        if not self.trigger or self.trigger not in templates:
            raise KeyError(
                "Invalid trigger argument `{0}` or not found in "
                "templates `{1}`.".format(self.trigger, list(templates.keys()))
            )

        sender = current_app.config["MAIL_NOTIFY_SENDER"]
        bcc = current_app.config["MAIL_NOTIFY_BCC"]
        cc = current_app.config["MAIL_NOTIFY_CC"]

        super(LoanMessage, self).__init__(
            template="{}/{}".format(
                self.templates_base_dir,
                templates[self.trigger_template]
            ),
            ctx=dict(**message_ctx, **kwargs),
            sender=kwargs.pop("sender", sender),
            cc=kwargs.pop("cc", cc),
            bcc=kwargs.pop("bcc", bcc),
            **kwargs
        )

    @property
    def trigger_template(self):
        """Get the template filename based on the trigger."""
        new_state = self.loan.get("state")
        document_pid = self.loan.get("document_pid")
        is_request = (
            new_state in current_app.config["CIRCULATION_STATES_LOAN_REQUEST"]
        )
        if (
            is_request
            and document_pid
            and not get_available_item_by_doc_pid(document_pid)
        ):
            return "request_no_items"
        return self.trigger
