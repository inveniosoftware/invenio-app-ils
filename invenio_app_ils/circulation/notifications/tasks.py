# -*- coding: utf-8 -*-
#
# Copyright (C) 2019 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""Circulation notifications."""
from celery import shared_task
from celery.utils.log import get_task_logger
from flask import current_app

from invenio_app_ils.circulation.notifications.api import (
    send_expiring_loan_reminder_notification,
    send_loan_notification,
    send_loan_overdue_reminder_notification,
)
from invenio_app_ils.circulation.search import (
    get_all_expiring_loans,
    get_all_overdue_loans,
)
from invenio_app_ils.circulation.utils import circulation_overdue_loan_days

celery_logger = get_task_logger(__name__)


@shared_task
def send_overdue_loans_notification_reminder():
    """Send notification message for loans that are overdue every X days."""
    days = current_app.config[
        "ILS_CIRCULATION_NOTIFICATION_OVERDUE_REMINDER_INTERVAL"]
    for hit in get_all_overdue_loans().scan():
        loan = hit.to_dict()
        days_ago = circulation_overdue_loan_days(loan)
        if days_ago % days == 0:
            send_loan_overdue_reminder_notification(loan, days_ago)


@shared_task
def send_expiring_loans_notification_reminder():
    """Send notification for loans that will expire in X days."""
    days = current_app.config["ILS_CIRCULATION_LOAN_WILL_EXPIRE_DAYS"]
    for hit in get_all_expiring_loans(days).scan():
        loan = hit.to_dict()
        send_expiring_loan_reminder_notification(loan, days)


@shared_task
def send_loan_end_date_updated_notification(loan):
    """Sends an notification to the patron whose loan was updated."""
    send_loan_notification(
        action="extend",
        loan=loan,
        is_manually_triggered=False,
    )
