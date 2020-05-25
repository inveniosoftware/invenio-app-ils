# -*- coding: utf-8 -*-
#
# Copyright (C) 2020 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""Test email notifications on transitions."""

from flask_security import login_user
from invenio_circulation.api import Loan
from invenio_circulation.proxies import current_circulation

from invenio_app_ils.circulation.mail.tasks import \
    send_loan_overdue_reminder_mail
from invenio_app_ils.records.api import Patron


def test_email_on_loan_checkout(
    app_with_mail, users, testdata, loan_params, mocker
):
    """Test that an email is sent when an admin performs a loan checkout."""
    loan_data = testdata["loans"][1]
    loan = Loan.get_record_by_pid(loan_data["pid"])
    with app_with_mail.extensions["mail"].record_messages() as outbox:
        admin = users["admin"]
        login_user(admin)

        assert len(outbox) == 0
        current_circulation.circulation.trigger(
            loan, **dict(loan_params, trigger="checkout")
        )
        assert len(outbox) == 1


def test_email_on_overdue_loan(app_with_mail, users, testdata, mocker):
    """Test that an email is sent for a loan that is overdue."""
    mocker.patch(
        "invenio_app_ils.records.api.Patron.get_patron",
        return_value=Patron(users["patron1"].id),
    )
    loan_data = testdata["loans"][-1]
    loan = Loan.get_record_by_pid(loan_data["pid"])
    with app_with_mail.extensions["mail"].record_messages() as outbox:
        assert len(outbox) == 0
        send_loan_overdue_reminder_mail(loan)
        assert len(outbox) == 1
