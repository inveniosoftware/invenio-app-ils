# -*- coding: utf-8 -*-
#
# Copyright (C) 2019 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""Circulation mail tasks."""

from datetime import datetime

import ciso8601
from celery import shared_task
from celery.utils.log import get_task_logger
from flask import current_app
from invenio_circulation.proxies import current_circulation
from invenio_mail.tasks import send_email

from invenio_app_ils.api import Document
from invenio_app_ils.circulation.utils import circulation_get_patron_from_loan

from .factory import overdue_loan_message_factory

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


def send_overdue_mail(loan, patron, **kwargs):
    """Send loan overdue email message async and log the result in Celery.

    :param loan: the overdue loan.
    """
    factory = overdue_loan_message_factory()
    # This fucker creates OverdueLoanMessage, pass here extra crap
    document = Document.get_record_by_pid(loan["document_pid"])

    # TODO: try to pass recepients here instead of everywhere
    msg = factory(loan, document=document, patron_email=patron.email, **kwargs)
    current_app.logger.debug("Attempting to send email '{}' to {}...".format(
        msg.subject, ", ".join(msg.recipients)
    ))
    data = msg.__dict__
    send_email.apply_async((data,), link=log_successful_mail.s(data))


@shared_task
def send_auto_overdue_mail():
    """Send email message for loans that are overdue every X days."""
    days = current_app.config["MAIL_OVERDUE_LOAN_INTERVAL"]
    loan_search = current_circulation.loan_search
    overdue_loans = loan_search.get_all_overdue_loans().execute()
    for hit in overdue_loans.hits:
        loan = hit.to_dict()
        end_date = ciso8601.parse_datetime(loan["end_date"])
        days_ago = (end_date - datetime.utcnow()).days
        if days_ago % days == 0:
            patron = circulation_get_patron_from_loan(loan)
            send_overdue_mail(loan, patron, recipients=[patron.email])
