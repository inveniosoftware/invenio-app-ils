# -*- coding: utf-8 -*-
#
# Copyright (C) 2019 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""ILS mail tasks."""

import json

from celery import shared_task
from celery.utils.log import get_task_logger
from flask import current_app
from invenio_mail.tasks import send_email

celery_logger = get_task_logger(__name__)


def send_ils_email(message, name="ils_mail"):
    """Send an email async with Invenio-Mail and log success / errors.

    :param message: BlockTemplatedMessage mail message.
    :param name: The name used in the log message.
    """
    message.recipients = get_recipients(message.recipients)

    full_data = message.__dict__
    dump = message.dump()
    log_msg = dict(
        name=name,
        action="before_send",
        message_id=dump["id"],
        data=dump
    )
    celery_logger.debug(json.dumps(log_msg, sort_keys=True))
    send_email.apply_async(
        (full_data,),
        link=log_successful_mail.s(dump),
        link_error=log_error_mail.s(data=dump)
    )


def get_recipients(recipients):
    """Return test recipients when ILS_MAIL_ENABLE_TEST_RECIPIENTS is True."""
    if current_app.config["ILS_MAIL_ENABLE_TEST_RECIPIENTS"]:
        return current_app.config["ILS_MAIL_NOTIFY_TEST_RECIPIENTS"]
    return recipients


@shared_task
def log_successful_mail(_, data):
    """Log successful email task."""
    log_msg = dict(
        name="ils_mail",
        action="success",
        message_id=data["id"],
        data=data,
    )
    celery_logger.info(json.dumps(log_msg, sort_keys=True))


@shared_task
def log_error_mail(request, exc, traceback, data, **kwargs):
    """Log error when sending email task."""
    error = dict(
        name="ils_mail",
        action="error",
        message_id=data["id"],
        task_id=request.get("id"),
        task=request.get("task"),
        exception=repr(exc),
        data=data,
    )
    celery_logger.exception(
        json.dumps(error, sort_keys=True),
        exc_info=exc
    )
