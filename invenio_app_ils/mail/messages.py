# -*- coding: utf-8 -*-
#
# Copyright (C) 2019 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""Circulation mail message objects."""

import uuid

from flask import current_app
from flask_mail import Message
from jinja2.exceptions import TemplateError

from invenio_app_ils.jsonresolver.api import pick


class BlockTemplatedMessage(Message):
    """Templated message using Jinja2 blocks."""

    def __init__(self, template, ctx={}, **kwargs):
        """Build message body and HTML based on the provided template.

        The template needs to provide two blocks: subject and body. An optional
        html block can also be provided for HTML rendered emails.

        :param template: Path to the template file.
        :param ctx: A mapping containing additional information passed to the
            template.
        :param **kwargs: Named arguments as defined in
            :class:`flask_mail.Message`.
        """
        self.template = template
        self.ctx = ctx
        self.id = str(uuid.uuid4())
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
        return "".join(lines).strip()

    def dump(self):
        """Dump email data."""
        data = pick(
            self.__dict__,
            "attachments", "bcc", "cc", "date", "extra_headers", "id",
            "mail_options", "msgId", "recipients", "reply_to", "sender",
            "subject", "template"
        )
        data["msg_cls"] = self.__class__.__name__
        return data


class DocumentRequestMessage(BlockTemplatedMessage):
    """Document request status change message."""

    TEMPLATES_DIR = "invenio_app_ils_mail/document_request"

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
