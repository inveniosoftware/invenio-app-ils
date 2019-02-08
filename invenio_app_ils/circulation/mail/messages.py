# -*- coding: utf-8 -*-
#
# Copyright (C) 2019 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""Circulation mail message objects."""

from flask import current_app
from flask_mail import Message
from invenio_circulation.api import get_available_item_by_doc_pid
from jinja2.exceptions import TemplateError


class BlockTemplatedMessage(Message):
    """Templated message using Jinja2 blocks."""

    def __init__(self, template, ctx={}, **kwargs):
        """Build message body and HTML based on the provided template.

        The template needs to provide two blocks: subject and body. An optional
        html block can also be provided for HTML rendered emails.

        :param template: Path to the template file.
        :param ctx: A mapping containing additional information passed to the
            template.
        :param **kwargs: Keyword arguments as defined in
            :class:`flask_mail.Message`.
        """
        self.template = template
        self.ctx = ctx
        tmpl = current_app.jinja_env.get_template(template)
        kwargs["subject"] = self.render_block(tmpl, "subject")
        kwargs["body"] = self.render_block(tmpl, "body")
        try:
            kwargs["html"] = self.render_block(tmpl, "html")
        except TemplateError:
            kwargs["html"] = kwargs["body"]
        super(BlockTemplatedMessage, self).__init__(**kwargs)

    def render_block(self, template, block_name):
        """Return a Jinja2 block as a string."""
        new_context = template.new_context
        if block_name not in template.blocks:
            raise TemplateError("No block with name '{}'".format(block_name))
        lines = template.blocks[block_name](new_context(vars=self.ctx))
        return "\n".join(lines).strip()


class LoanMessage(BlockTemplatedMessage):
    """Loader for loan messages."""

    default_templates = dict(
        request="invenio_app_ils_mail/request.html",
        request_no_items="invenio_app_ils_mail/request_no_items.html",
        checkout="invenio_app_ils_mail/checkout.html",
        checkin="invenio_app_ils_mail/checkin.html",
        extend="invenio_app_ils_mail/extend.html",
        cancel="invenio_app_ils_mail/cancel.html"
    )

    def __init__(self, prev_loan, loan, trigger, **kwargs):
        """Create loan message based on the trigger."""
        self.prev_loan = prev_loan
        self.loan = loan
        self.trigger = trigger

        templates = dict(self.default_templates,
                         **current_app.config["LOAN_MAIL_TEMPLATES"])
        sender = current_app.config["MAIL_NOTIFY_SENDER"]
        bcc = current_app.config["MAIL_NOTIFY_BCC"]
        cc = current_app.config["MAIL_NOTIFY_CC"]

        super(LoanMessage, self).__init__(
            template=templates[self.trigger_template],
            ctx=dict(
                trigger=trigger,
                prev_loan=prev_loan,
                loan=loan,
                **kwargs
            ),
            sender=kwargs.pop("sender", sender),
            cc=kwargs.pop("cc", cc),
            bcc=kwargs.pop("bcc", bcc),
            **kwargs
        )

    @property
    def trigger_template(self):
        """Get the template filename based on the trigger."""
        if self.trigger == "request":
            if not get_available_item_by_doc_pid(self.loan["document_pid"]):
                return "request_no_items"
        return self.trigger
