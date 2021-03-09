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
from invenio_accounts.models import User
from invenio_mail.tasks import send_email
from sqlalchemy.orm.exc import NoResultFound

from invenio_app_ils.mail.models import EmailLog

celery_logger = get_task_logger(__name__)


def send_ils_email(message, is_manually_triggered=False, name="ils_mail"):
    """Send an email async with Invenio-Mail and log success / errors.

    :param message: BlockTemplatedMessage mail message.
    :param name: The name used in the log message.
    """
    message.recipients = get_recipients(message.recipients)

    full_data = message.__dict__
    dump = message.dump()
    log_msg = dict(
        name=name, action="before_send", message_id=dump["id"], data=dump
    )
    celery_logger.info(json.dumps(log_msg, sort_keys=True))

    dump["is_manually_triggered"] = is_manually_triggered

    send_email.apply_async(
        (full_data,),
        link=log_successful_mail.s(dump),
        link_error=log_error_mail.s(data=dump),
    )


def get_recipients(recipients):
    """Return test recipients when ILS_MAIL_ENABLE_TEST_RECIPIENTS is True."""
    if current_app.config["ILS_MAIL_ENABLE_TEST_RECIPIENTS"]:
        return current_app.config["ILS_MAIL_NOTIFY_TEST_RECIPIENTS"]
    return recipients


def create_email_log_entry(data, log_message):
    """Create an entry in the email log db."""
    try:
        patron = User.query.filter_by(email=data["recipients"][0]).one()
    except NoResultFound as ex:
        current_app.logger.warning(ex)
        patron = current_app.config["ILS_PATRON_ANONYMOUS_CLASS"]
    recipient_id = str(patron.id)

    data_dict = dict(
        email_action=data.get("action", None),
        recipient_user_id=recipient_id,
        is_manually_triggered=data["is_manually_triggered"],
        message_id=data["id"],
        send_log=log_message,
    )

    pid_type = data.get("pid_type", None)
    data_dict["pid_type"] = pid_type
    pid_value = data.get("pid_value", None)
    data_dict["pid_value"] = pid_value
    EmailLog.create(data_dict)


@shared_task
def log_successful_mail(_, data):
    """Log successful email task."""
    log_msg = dict(
        name="ils_mail",
        action="success",
        message_id=data["id"],
        data=data,
    )

    create_email_log_entry(data, "Success")

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

    create_email_log_entry(data, "Error: " + repr(exc))

    celery_logger.exception(json.dumps(error, sort_keys=True), exc_info=exc)
