# -*- coding: utf-8 -*-
#
# Copyright (C) 2020 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""Circulation tasks."""

from copy import deepcopy

from celery import shared_task
from celery.utils.log import get_task_logger
from flask import current_app
from invenio_circulation.api import Loan
from invenio_circulation.proxies import current_circulation
from invenio_db import db

from invenio_app_ils.circulation.mail.factory import \
    loan_list_message_creator_factory
from invenio_app_ils.circulation.search import (get_active_loans_by_patron_pid,
                                                get_all_expired_loans)
from invenio_app_ils.mail.tasks import send_ils_email
from invenio_app_ils.proxies import current_app_ils

celery_logger = get_task_logger(__name__)


@shared_task
def cancel_expired_loan_requests():
    """Cancel loan requests after expiration date has passed."""
    SystemAgent = current_app.config["ILS_PATRON_SYSTEM_AGENT_CLASS"]
    system_agent_id = str(SystemAgent.id)

    expired_loans = get_all_expired_loans().execute()
    for hit in expired_loans.hits:
        loan = Loan.get_record_by_pid(hit.pid)
        duration_days = current_app.config[
            "ILS_CIRCULATION_LOAN_REQUEST_DURATION_DAYS"
        ]
        params = deepcopy(loan)
        params.update(
            dict(
                cancel_reason="The loan request has been automatically "
                "cancelled because {} days have passed.".format(duration_days),
                transaction_user_pid=system_agent_id,
            )
        )
        current_circulation.circulation.trigger(
            loan, **dict(params, trigger="cancel")
        )

        loan.commit()
        db.session.commit()
        current_circulation.loan_indexer().index(loan)


def send_active_loans_mail(patron_pid, message_ctx={}, **kwargs):
    """Send an email to librarian with on going loans of given patron.

    :param patron_pid: the pid of the patron.
    :param action: the action performed, if any.
    :param message_ctx: any other parameter to be passed as ctx in the msg.
    """
    creator = loan_list_message_creator_factory()

    Patron = current_app_ils.patron_cls
    patron = Patron.get_patron(patron_pid)

    loans = [
        loan.to_dict()
        for loan in get_active_loans_by_patron_pid(patron_pid).scan()
    ]

    if len(loans) > 0:  # Email is only sent if there are active loans
        recipient = current_app.config["MANAGEMENT_EMAIL"]
        msg = creator(
            patron,
            loans,
            message_ctx=message_ctx,
            recipients=[recipient],
            **kwargs,
        )
        send_ils_email(msg)
