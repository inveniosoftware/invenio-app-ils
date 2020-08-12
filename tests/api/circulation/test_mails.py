# -*- coding: utf-8 -*-
#
# Copyright (C) 2020 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""Test email notifications on transitions."""

import random
from datetime import timedelta

import arrow
from flask import current_app
from invenio_circulation.api import Loan
from invenio_circulation.proxies import current_circulation
from invenio_indexer.api import RecordIndexer
from invenio_search import current_search

from invenio_app_ils.circulation.tasks import send_active_loans_mail
from invenio_app_ils.patrons.api import Patron
from tests.helpers import user_login

from invenio_app_ils.circulation.mail.tasks import (  # isort:skip
    send_expiring_loans_mail_reminder,
    send_overdue_loans_mail_reminder,
)


def test_email_on_loan_checkout(
    client, app_with_mail, users, testdata, loan_params
):
    """Test that an email is sent when an admin performs a loan checkout."""
    loan_data = testdata["loans"][1]
    loan = Loan.get_record_by_pid(loan_data["pid"])
    with app_with_mail.extensions["mail"].record_messages() as outbox:
        user_login(client, "admin", users)

        assert len(outbox) == 0
        current_circulation.circulation.trigger(
            loan, **dict(loan_params, trigger="checkout")
        )
        assert len(outbox) == 1


def test_email_on_overdue_loans(app_with_mail, db, users, testdata, mocker):
    """Test that an email is sent for a loan that is overdue."""
    mocker.patch(
        "invenio_app_ils.patrons.api.Patron.get_patron",
        return_value=Patron(users["patron1"].id),
    )

    def prepare_data():
        """Prepare data."""
        days = current_app.config[
            "ILS_CIRCULATION_MAIL_OVERDUE_REMINDER_INTERVAL"
        ]
        loans = testdata["loans"]

        recs = []
        now = arrow.utcnow()

        def new_end_date(loan, date):
            loan["end_date"] = date.date().isoformat()
            loan["state"] = "ITEM_ON_LOAN"
            loan.commit()
            recs.append(loan)

        # overdue loans
        date = now - timedelta(days=days)
        new_end_date(loans[0], date)

        date = now - timedelta(days=days * 2)
        new_end_date(loans[1], date)

        # not overdue or overdue but not to be notified
        remaining_not_overdue = loans[2:]
        for loan in remaining_not_overdue:
            days = random.choice([-1, 0, 1])
            date = now - timedelta(days=days)
            new_end_date(loan, date)
        db.session.commit()

        indexer = RecordIndexer()
        for rec in recs:
            indexer.index(rec)

        current_search.flush_and_refresh(index="*")

    prepare_data()

    with app_with_mail.extensions["mail"].record_messages() as outbox:
        assert len(outbox) == 0
        send_overdue_loans_mail_reminder.apply_async()
        assert len(outbox) == 2


def test_email_on_expiring_loans(app_with_mail, db, users, testdata, mocker):
    """Test that an email is sent for a loan that is about to expire."""
    mocker.patch(
        "invenio_app_ils.patrons.api.Patron.get_patron",
        return_value=Patron(users["patron1"].id),
    )

    def prepare_data():
        """Prepare data."""
        days = current_app.config["ILS_CIRCULATION_LOAN_WILL_EXPIRE_DAYS"]
        loans = testdata["loans"]

        recs = []
        now = arrow.utcnow()

        def new_end_date(loan, date):
            loan["end_date"] = date.date().isoformat()
            loan["state"] = "ITEM_ON_LOAN"
            loan.commit()
            recs.append(loan)

        # expiring loans
        date = now + timedelta(days=days)
        new_end_date(loans[0], date)
        new_end_date(loans[1], date)
        new_end_date(loans[2], date)

        # not expiring
        remaining_not_overdue = loans[3:]
        for loan in remaining_not_overdue:
            days = random.choice([-2, -1, 0, 1, 2])
            date = now + timedelta(days=days)
            new_end_date(loan, date)
        db.session.commit()

        indexer = RecordIndexer()
        for rec in recs:
            indexer.index(rec)

        current_search.flush_and_refresh(index="*")

    prepare_data()

    with app_with_mail.extensions["mail"].record_messages() as outbox:
        assert len(outbox) == 0
        send_expiring_loans_mail_reminder.apply_async()
        assert len(outbox) == 3


def test_active_loans_mail_task(app_with_mail, users, testdata):
    """Tests that the email contains the user data and the loans."""
    with app_with_mail.extensions["mail"].record_messages() as outbox:
        assert len(outbox) == 0
        send_active_loans_mail(patron_pid="2")
        assert len(outbox) == 1
        email = outbox[0]

        assert email.recipients == ['internal@inveniosoftware.org']

        def assert_contains(string):
            assert string in email.body
            assert string in email.html

        assert_contains('patron2@test.com')
        assert_contains('loanid-6')

        send_active_loans_mail(patron_pid="3")

        assert len(outbox) == 1
