# -*- coding: utf-8 -*-
#
# Copyright (C) 2021 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""Notifications messages."""
import os
import uuid

from flask import current_app
from jinja2 import TemplateError


class NotificationMsg:
    """Generate the notification message with params."""

    TEMPLATES_BASE_DIR = "invenio_app_ils/notifications"

    def __init__(self, template, ctx=None, **kwargs):
        """Build message body and HTML based on the provided template.

        The template needs to provide two blocks: title and body. An optional
        html block can also be provided for HTML rendered msgs.

        :param template: Path to the template file.
        :param ctx: A dict of params to be injected in the template.
        :param **kwargs: extra arguments.
        """
        self.template = template
        self.id = str(uuid.uuid4())

        ctx = ctx or {}
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
        self.title = self.render_block(tmpl, "title").strip()
        self.body_plain = self.render_block(tmpl, "body_plain")
        try:
            self.body_html = self.render_block(tmpl, "body_html")
        except TemplateError:
            self.body_html = self.body_plain

        footer_template = current_app.config.get("ILS_NOTIFICATIONS_TEMPLATES", {}).get(
            "footer"
        )
        if footer_template:
            path = os.path.join(self.TEMPLATES_BASE_DIR, footer_template)
            footer_tmpl = current_app.jinja_env.get_template(path)
            footer_plain = self.render_block(footer_tmpl, "footer_plain")
            try:
                footer_html = self.render_block(footer_tmpl, "footer_html")
            except TemplateError:
                footer_html = footer_plain
            self.body_plain += footer_plain
            self.body_html += footer_html

        self.body_plain = self.body_plain.strip()
        self.body_html = self.body_html.strip()

    def render_block(self, template, block_name):
        """Return a Jinja2 block as a string."""
        new_context = template.new_context
        if block_name not in template.blocks:
            raise TemplateError("No block with name '{}'".format(block_name))
        lines = template.blocks[block_name](new_context(vars=self.ctx))
        return "".join(lines)

    def to_dict(self):
        """Dump obj."""
        return dict(
            id=self.id,
            title=self.title,
            body_plain=self.body_plain,
            body_html=self.body_html,
            msg_cls=self.__class__.__name__,
        )


def notification_msg_builder(template, ctx, **kwargs):
    """Factory builder to create a notification msg."""
    return NotificationMsg(template, ctx, **kwargs)
