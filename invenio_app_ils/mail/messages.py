# -*- coding: utf-8 -*-
#
# Copyright (C) 2020 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""ILS mail message objects."""

import os
import uuid

from flask import current_app
from flask_mail import Message
from jinja2.exceptions import TemplateError

from invenio_app_ils.proxies import current_app_ils
from invenio_app_ils.records.jsonresolvers.api import pick


class BlockTemplatedMessage(Message):
    """Templated message using Jinja2 blocks."""

    GLOBAL_MAIL_TEMPLATES_BASE_DIR = "invenio_app_ils/mail/"

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
        self.id = str(uuid.uuid4())

        ctx.update(
            dict(
                spa_routes=dict(
                    HOST=current_app.config["SPA_HOST"],
                    PATHS=current_app.config["SPA_PATHS"],
                )
            )
        )
        self.ctx = ctx

        tmpl = current_app.jinja_env.get_template(template)
        kwargs["subject"] = self.render_block(tmpl, "subject").strip()
        kwargs["body"] = self.render_block(tmpl, "body_plain")
        try:
            kwargs["html"] = self.render_block(tmpl, "body_html")
        except TemplateError:
            kwargs["html"] = kwargs["body"]

        footer_template = current_app.config.get(
            "ILS_GLOBAL_MAIL_TEMPLATES", {}
        ).get("footer")
        if footer_template:
            footer_tmpl = current_app.jinja_env.get_template(
                os.path.join(
                    self.GLOBAL_MAIL_TEMPLATES_BASE_DIR, footer_template
                )
            )
            footer_plain = self.render_block(footer_tmpl, "footer_plain")
            try:
                footer_html = self.render_block(footer_tmpl, "footer_html")
            except TemplateError:
                footer_html = footer_plain
            kwargs["body"] += footer_plain
            kwargs["html"] += footer_html

        kwargs["body"] = kwargs["body"].strip()
        kwargs["html"] = kwargs["html"].strip()

        kwargs.setdefault("sender", current_app.config["MAIL_NOTIFY_SENDER"])
        kwargs.setdefault("cc", current_app.config["MAIL_NOTIFY_CC"])
        kwargs.setdefault("bcc", current_app.config["MAIL_NOTIFY_BCC"])

        super().__init__(**kwargs)

    def render_block(self, template, block_name):
        """Return a Jinja2 block as a string."""
        new_context = template.new_context
        if block_name not in template.blocks:
            raise TemplateError("No block with name '{}'".format(block_name))
        lines = template.blocks[block_name](new_context(vars=self.ctx))
        return "".join(lines)

    def dump(self):
        """Dump email data."""
        data = pick(
            self.__dict__,
            "attachments",
            "bcc",
            "cc",
            "date",
            "extra_headers",
            "id",
            "mail_options",
            "msgId",
            "recipients",
            "reply_to",
            "sender",
            "subject",
            "template",
        )
        data["msg_cls"] = self.__class__.__name__
        return data


def get_common_message_ctx(record):
    """Get common context for emails."""
    Patron = current_app_ils.patron_cls
    patron = Patron.get_patron(record["patron_pid"])

    message_ctx = dict(patron=patron)

    if "document_pid" in record:
        Document = current_app_ils.document_record_cls
        document = Document.get_record_by_pid(record["document_pid"])

        # create the string "title (edition - year)"
        edition = document.get("edition", "")
        year = document.get("publication_year", "")
        edition_year = " - ".join(filter(None, [edition, year]))
        full_title = (
            "{0} ({1})".format(document["title"], edition_year)
            if edition_year
            else document["title"]
        )
        message_ctx["document"] = dict(
            title=document["title"],
            edition=edition,
            publication_year=year,
            full_title=full_title,
        )

    return message_ctx
