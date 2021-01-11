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
from flask import current_app, url_for
from invenio_circulation.api import Loan
from invenio_circulation.proxies import current_circulation
from invenio_indexer.api import RecordIndexer
from invenio_search import current_search

from invenio_app_ils.circulation.mail.tasks import (
    send_expiring_loans_mail_reminder, send_overdue_loans_mail_reminder)
from invenio_app_ils.documents.api import Document
from invenio_app_ils.patrons.api import Patron
from tests.helpers import user_login, user_logout


def test_email_on_loan_checkout(
    client, app_with_mail, users, testdata, loan_params
):
    """Test that an email is sent on loan checkout."""
    loan_data = testdata["loans"][1]
    loan = Loan.get_record_by_pid(loan_data["pid"])
    with app_with_mail.extensions["mail"].record_messages() as outbox:
        user_login(client, "admin", users)

        assert len(outbox) == 0
        current_circulation.circulation.trigger(
            loan, **dict(loan_params, trigger="checkout")
        )
        assert len(outbox) == 1
        msg = outbox[0]

    doc = Document.get_record_by_pid(loan_data["document_pid"])
    expected_subject = (
        """InvenioILS: your loan for "{0}" has started.""".format(doc["title"])
    )
    assert msg.subject == expected_subject

    edition_year = " ({edition} - {year})".format(
        edition=doc["edition"], year=doc["publication_year"]
    )
    full_title = "{title}, {author}{edition_year}".format(
        title=doc["title"],
        author=doc["authors"][0]["full_name"],
        edition_year=edition_year,
    )

    literature_url = "{host}{path}".format(
        host=current_app.config["SPA_HOST"],
        path=current_app.config["SPA_PATHS"]["literature"]
        % {"pid": doc["pid"]},
    )
    profile_url = "{host}{path}".format(
        host=current_app.config["SPA_HOST"],
        path=current_app.config["SPA_PATHS"]["profile"],
    )
    expected_body_plain = """Dear Patron One,

your loan for "{doc_full_title}" <{literature_url}> has started.

The due date is {loan_end_date}.

You can see your ongoing and past loans in your profile page <{profile_url}>.

Kind regards,
InvenioILS""".format(
        doc_full_title=full_title,
        literature_url=literature_url,
        loan_end_date=loan_data["end_date"],
        profile_url=profile_url,
    )
    assert msg.body == expected_body_plain


def test_email_on_overdue_permissions(client, testdata, json_headers, users):
    """Test that only the backoffice can send a reminder."""
    pid = testdata["loans"][0]["pid"]
    url = url_for("invenio_app_ils_circulation.loanid_email",
                  pid_value=pid)
    tests = [
        ("patron1", 403),
        ("anonymous", 401)
    ]
    for username, expected_status in tests:
        user_login(client, username, users)
        res = client.post(url, headers=json_headers)
        assert res.status_code == expected_status


def test_email_on_overdue_loans(
    app_with_mail, db, users, testdata, mocker, client, json_headers
):
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

        # not overdue
        date = now - timedelta(days=-1)
        new_end_date(loans[2], date)

        # not overdue or overdue but not to be notified
        remaining_not_overdue = loans[3:]
        for loan in remaining_not_overdue:
            days = random.choice([-1, 0, 1])
            date = now - timedelta(days=days)
            new_end_date(loan, date)
        db.session.commit()

        indexer = RecordIndexer()
        for rec in recs:
            indexer.index(rec)

        current_search.flush_and_refresh(index="*")

    user_login(client, "librarian", users)

    # test individual overdue loan
    prepare_data()
    loans = testdata["loans"]

    email_url = url_for(
        "invenio_app_ils_circulation.loanid_email",
        pid_value=loans[0]["pid"],
    )

    res = client.post(email_url, headers=json_headers)
    assert res.status_code == 202

    # test individual not overdue loan
    email_url = url_for(
        "invenio_app_ils_circulation.loanid_email",
        pid_value=loans[2]["pid"],
    )

    res = client.post(email_url, headers=json_headers)
    assert res.status_code == 400

    user_logout(client)

    # test all loans
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
