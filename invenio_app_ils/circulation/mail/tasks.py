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
from invenio_circulation.proxies import current_circulation
from invenio_mail.tasks import send_email

from invenio_app_ils.api import Document
from invenio_app_ils.circulation.mail.factory import loan_message_factory, \
    overdue_loan_message_factory
from invenio_app_ils.circulation.utils import circulation_overdue_loan_days
from invenio_app_ils.records.api import Patron

celery_logger = get_task_logger(__name__)


def get_recipients(patrons):
    """Return test recipients when ENABLE_TEST_RECIPIENTS is True."""
    if current_app.config["ENABLE_TEST_RECIPIENTS"]:
        return current_app.config["MAIL_NOTIFY_TEST_RECIPIENTS"]
    return patrons


@shared_task
def log_successful_mail(_, data):
    """Log successful email task."""
    celery_logger.info("Email '{}' successfully sent to '{}'".format(
        data['subject'], ", ".join(data['recipients'])
    ))


def send_ils_mail(prev_loan, loan, trigger, **kwargs):
    """Send loan email message asynchronously and log the result in Celery.

    :param factory: Callable message factory to create Message object.
    :param prev_loan: Previous loan.
    :param loan: Updated loan.
    :param trigger: Loan action trigger.
    """
    patron = Patron.get_patron(loan["patron_pid"])
    factory = loan_message_factory()
    msg = factory(prev_loan, loan, trigger,
                  recipients=get_recipients([patron.email]), **kwargs)
    current_app.logger.debug("Attempting to send email '{}' to {}...".format(
        msg.subject, ", ".join(msg.recipients)
    ))
    data = msg.__dict__
    send_email.apply_async((data,), link=log_successful_mail.s(data))


def send_overdue_mail(loan, **kwargs):
    """Send loan overdue email message async and log the result in Celery.

    :param loan: the overdue loan.
    """
    document = Document.get_record_by_pid(loan["document_pid"])
    patron = Patron.get_patron(loan["patron_pid"])
    factory = overdue_loan_message_factory()
    msg = factory(
        loan,
        document_title=document["title"],
        patron_email=patron.email,
        days_ago=circulation_overdue_loan_days(loan),
        recipients=get_recipients([patron.email]),
        **kwargs
    )
    current_app.logger.debug("Attempting to send email '{}' to {}...".format(
        msg.subject, ", ".join(msg.recipients)
    ))
    data = msg.__dict__
    send_email.apply_async((data,), link=log_successful_mail.s(data))


@shared_task
def send_overdue_loans_mail_reminder():
    """Send email message for loans that are overdue every X days."""
    days = current_app.config["OVERDUE_LOAN_MAIL_INTERVAL"]
    loan_search = current_circulation.loan_search
    overdue_loans = loan_search.get_all_overdue_loans().execute()
    for hit in overdue_loans.hits:
        loan = hit.to_dict()
        overdue_days = circulation_overdue_loan_days(loan)
        if overdue_days % days == 0:
            send_overdue_mail(loan)
