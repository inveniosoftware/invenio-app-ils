# -*- coding: utf-8 -*-
#
# Copyright (C) 2019 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""ILS mail message objects."""

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
