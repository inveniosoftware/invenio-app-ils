# -*- coding: utf-8 -*-
#
# Copyright (C) 2020 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""Test transitions on expiring loans."""

from datetime import timedelta

import arrow
from flask import url_for
from invenio_indexer.api import RecordIndexer
from invenio_search import current_search

from invenio_app_ils.circulation.tasks import cancel_expired_loan_requests
from invenio_app_ils.patrons.api import SystemAgent
from tests.helpers import user_login


def test_cancel_expired_loans(client, json_headers, db, users, testdata):
    """Test cancellation of loan requests after expiration date."""

    user_login(client, "admin", users)

    def prepare_data():
        """Prepare data."""
        loans = testdata["loans"]

        recs = []
        now = arrow.utcnow()

        def new_expiration_date(loan, date):
            loan["request_expire_date"] = date.date().isoformat()
            loan["state"] = "PENDING"
            loan.commit()
            recs.append(loan)

        # expired loans
        date = now - timedelta(days=1)
        new_expiration_date(loans[0], date)
        new_expiration_date(loans[1], date)
        date = now - timedelta(days=2)
        new_expiration_date(loans[2], date)
        expired_pids = [loans[0]["pid"], loans[1]["pid"], loans[2]["pid"]]

        # not expired loans
        not_expired_pids = []
        remaining_not_expired = loans[3:]
        n_days = 0  # today
        for loan in remaining_not_expired:
            date = now + timedelta(days=n_days)
            new_expiration_date(loan, date)
            not_expired_pids.append(loan["pid"])
            n_days += 1
        db.session.commit()

        indexer = RecordIndexer()
        for rec in recs:
            indexer.index(rec)

        current_search.flush_and_refresh(index="*")
        return expired_pids, not_expired_pids

    expired_pids, not_expired_pids = prepare_data()

    # trigger cancel expired loan requests
    cancel_expired_loan_requests.apply_async()

    for pid_value in expired_pids:
        res = client.get(
            url_for("invenio_records_rest.loanid_item", pid_value=pid_value),
            headers=json_headers,
        )
        loan = res.get_json()["metadata"]
        assert loan["state"] == "CANCELLED"
        assert "cancel_reason" in loan
        assert loan["transaction_user_pid"] == str(SystemAgent.id)

    for pid_value in not_expired_pids:
        res = client.get(
            url_for("invenio_records_rest.loanid_item", pid_value=pid_value),
            headers=json_headers,
        )
        loan = res.get_json()["metadata"]
        assert loan["state"] == "PENDING"
        assert "cancel_reason" not in loan
