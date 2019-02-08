# -*- coding: utf-8 -*-
#
# Copyright (C) 2019 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""Circulation mail tasks."""

from celery import shared_task
from celery.utils.log import get_task_logger
from flask import current_app
from invenio_mail.tasks import send_email

celery_logger = get_task_logger(__name__)


@shared_task
def log_successful_mail(_, data):
    """Log successful email task."""
    celery_logger.info("Email '{}' successfully sent to '{}'".format(
        data['subject'], ", ".join(data['recipients'])
    ))


def send_ils_mail(factory, prev_loan, loan, trigger, **kwargs):
    """Send loan email message asynchronously and log the result in Celery.

    :param factory: Callable message factory to create Message object.
    :param prev_loan: Previous loan.
    :param loan: Updated loan.
    :param trigger: Loan action trigger.
    """
    msg = factory(prev_loan, loan, trigger, **kwargs)
    current_app.logger.debug("Attempting to send email '{}' to {}...".format(
        msg.subject, ", ".join(msg.recipients)
    ))
    data = msg.__dict__
    send_email.apply_async((data,), link=log_successful_mail.s(data))
