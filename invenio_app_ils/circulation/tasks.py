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

from invenio_app_ils.circulation.search import get_all_expired_loans

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
