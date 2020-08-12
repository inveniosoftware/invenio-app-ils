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

    templates_base_dir = "invenio_app_ils_circulation/mail"

    default_templates = dict(
        request="request.html",
        request_no_items="request_no_items.html",
        checkout="checkout.html",
        checkin="checkin.html",
        extend="extend.html",
        cancel="cancel.html",
        overdue_reminder="overdue_reminder.html",
        expiring_reminder="will_expire_in_reminder.html",
    )

    def __init__(self, loan, action, message_ctx, **kwargs):
        """Create loan message based on the loan action."""
        self.loan = loan

        templates = dict(
            self.default_templates,
            **current_app.config["ILS_CIRCULATION_MAIL_TEMPLATES"],
        )

        if not action or action not in templates:
            raise KeyError(
                "Invalid loan action argument `{0}` or not found in "
                "templates `{1}`.".format(action, list(templates.keys()))
            )

        name = self.get_template_name(action)
        super(LoanMessage, self).__init__(
            template="{}/{}".format(self.templates_base_dir, templates[name]),
            ctx=dict(loan=dict(loan), **message_ctx, **kwargs),
            **kwargs,
        )

    def get_template_name(self, action):
        """Get the template filename based on the loan action."""
        new_state = self.loan["state"]
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
        return action

    def dump(self):
        """Dump loan email data."""
        data = super().dump()
        data["loan_pid"] = self.loan["pid"]
        return data


class LoanListMessage(BlockTemplatedMessage):
    """Loan List message."""

    templates_base_dir = "invenio_app_ils_circulation/mail"
    default_templates = dict(
        active_loans="active_loans.html",
        librarian_footer="librarian_footer.html",
    )

    def __init__(
        self,
        patron,
        loans,
        message_ctx,
        template="active_loans",
        footer_template="librarian_footer",
        **kwargs,
    ):
        """Create loan message based on the loan action."""
        templates = dict(
            self.default_templates,
            **current_app.config["ILS_CIRCULATION_MAIL_TEMPLATES"],
        )

        super(LoanListMessage, self).__init__(
            template="{}/{}".format(
                self.templates_base_dir, templates[template]
            ),
            footer_template="{}/{}".format(
                self.templates_base_dir, templates[footer_template]
            ),
            ctx=dict(patron=patron, loans=loans, **message_ctx, **kwargs),
            **kwargs,
        )
