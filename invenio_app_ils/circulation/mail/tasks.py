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

from invenio_app_ils.circulation.mail.factory import \
    loan_message_creator_factory
from invenio_app_ils.circulation.search import (get_all_expiring_loans,
                                                get_all_overdue_loans)
from invenio_app_ils.circulation.utils import circulation_overdue_loan_days
from invenio_app_ils.mail.messages import get_common_message_ctx
from invenio_app_ils.mail.tasks import send_ils_email

celery_logger = get_task_logger(__name__)


def send_loan_mail(action, loan, message_ctx={}, **kwargs):
    """Send loan email message asynchronously and log the result in Celery.

    :param action: the triggered loan action.
    :param loan: the loan record.
    :param message_ctx: any other parameter to be passed as ctx in the msg.
    """
    creator = loan_message_creator_factory()

    message_ctx.update(get_common_message_ctx(record=loan))
    patron = message_ctx["patron"]

    msg = creator(
        loan,
        action=action,
        message_ctx=message_ctx,
        recipients=[patron.email],
        **kwargs,
    )
    send_ils_email(msg)


def send_loan_overdue_reminder_mail(loan, days_ago):
    """Send loan overdue email."""
    send_loan_mail(
        action="overdue_reminder",
        loan=loan,
        message_ctx=dict(days_ago=days_ago),
    )


@shared_task
def send_overdue_loans_mail_reminder():
    """Send email message for loans that are overdue every X days."""
    days = current_app.config["ILS_CIRCULATION_MAIL_OVERDUE_REMINDER_INTERVAL"]
    overdue_loans = get_all_overdue_loans().execute()
    for hit in overdue_loans.hits:
        loan = hit.to_dict()
        days_ago = circulation_overdue_loan_days(loan)
        if days_ago % days == 0:
            send_loan_overdue_reminder_mail(loan, days_ago)


def send_expiring_loan_reminder_mail(loan, expiring_in_days):
    """Send reminder email."""
    send_loan_mail(
        action="expiring_reminder",
        loan=loan,
        message_ctx=dict(expiring_in_days=expiring_in_days),
    )


@shared_task
def send_expiring_loans_mail_reminder():
    """Send email for loans that will expire in X days."""
    days = current_app.config["ILS_CIRCULATION_LOAN_WILL_EXPIRE_DAYS"]
    expiring_loans = get_all_expiring_loans(days).execute()
    for hit in expiring_loans.hits:
        loan = hit.to_dict()
        send_expiring_loan_reminder_mail(loan, days)


@shared_task
def send_loan_end_date_updated_mail(loan):
    """Sends an email to the patron whose loan was updated."""
    send_loan_mail(
        action="extend",
        loan=loan,
    )
