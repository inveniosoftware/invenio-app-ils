# -*- coding: utf-8 -*-
#
# Copyright (C) 2021 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""Mail backend."""
from celery import shared_task
from flask import current_app
from flask_mail import Message
from invenio_mail.tasks import send_email


@shared_task
def send(patrons, msg, **kwargs):
    """Send an email async with Invenio-Mail and log success / errors.

    :param patrons: List of Patron objects.
    :param msg: A NotificationMsg object.
    :param kwargs: extra arguments.
    """
    kwargs["recipients"] = get_recipients(patrons)
    kwargs["subject"] = msg["title"]
    kwargs["body"] = msg["body_plain"]
    kwargs["html"] = msg["body_html"]
    kwargs.setdefault("sender", current_app.config["MAIL_NOTIFY_SENDER"])
    kwargs.setdefault("cc", current_app.config["MAIL_NOTIFY_CC"])
    kwargs.setdefault("bcc", current_app.config["MAIL_NOTIFY_BCC"])
    message = Message(**kwargs)
    full_data = message.__dict__

    send_email(full_data)


def get_recipients(patrons):
    """Return test recipients only if activated."""
    if current_app.config["ILS_MAIL_ENABLE_TEST_RECIPIENTS"]:
        return current_app.config["ILS_MAIL_NOTIFY_TEST_RECIPIENTS"]
    return [patron["email"] for patron in patrons]
