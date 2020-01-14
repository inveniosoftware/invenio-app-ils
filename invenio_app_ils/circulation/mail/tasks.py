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

from invenio_app_ils.circulation.mail.factory import loan_message_factory
from invenio_app_ils.circulation.utils import circulation_overdue_loan_days
from invenio_app_ils.documents.api import Document
from invenio_app_ils.mail.tasks import get_recipients, send_ils_email
from invenio_app_ils.records.api import Patron

celery_logger = get_task_logger(__name__)


def send_loan_mail(trigger, loan, message_ctx={}, **kwargs):
    """Send loan email message asynchronously and log the result in Celery.

    :param trigger: Loan action trigger.
    :param loan: Updated loan.
    :param message_ctx: any other parameter to be passed as ctx in the msg.
    """
    patron = Patron.get_patron(loan["patron_pid"])
    document = Document.get_record_by_pid(loan["document_pid"])
    factory = loan_message_factory()
    msg = factory(
        trigger,
        message_ctx=dict(
            loan=loan,
            document=dict(title=document["title"]),
            patron=patron,
            **message_ctx,
        ),
        recipients=get_recipients([patron.email]),
        **kwargs,
    )
    send_ils_email(msg)


def send_loan_overdue_reminder_mail(loan):
    """Send loan overdue email message async and log the result in Celery.

    :param loan: the overdue loan.
    """
    send_loan_mail(
        "overdue_reminder",
        loan=loan,
        message_ctx=dict(days_ago=circulation_overdue_loan_days(loan)),
    )


@shared_task
def send_overdue_loans_mail_reminder():
    """Send email message for loans that are overdue every X days."""
    days = current_app.config["ILS_MAIL_LOAN_OVERDUE_REMINDER_INTERVAL"]
    search_cls = current_circulation.loan_search_cls
    overdue_loans = search_cls().get_all_overdue_loans().execute()
    for hit in overdue_loans.hits:
        loan = hit.to_dict()
        overdue_days = circulation_overdue_loan_days(loan)
        if overdue_days % days == 0:
            send_loan_overdue_reminder_mail(loan)
