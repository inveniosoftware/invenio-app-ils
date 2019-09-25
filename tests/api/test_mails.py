# -*- coding: utf-8 -*-
#
# Copyright (C) 2018 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""Test email notifications."""

import pytest
from flask_mail import Message
from flask_security import login_user
from invenio_circulation.api import Loan
from invenio_circulation.proxies import current_circulation
from jinja2.exceptions import TemplateError, TemplateNotFound

from invenio_app_ils.circulation.mail.messages import BlockTemplatedMessage
from invenio_app_ils.circulation.mail.tasks import send_loan_mail, \
    send_loan_overdue_reminder_mail
from invenio_app_ils.records.api import Patron


def test_block_templated_message_full(app):
    """Test that the subject, body and html are read correctly."""
    with app.app_context():
        blank = BlockTemplatedMessage("tests/subject_body_html.html")
        assert blank.subject == "Test subject."
        assert blank.body == "Test body."
        assert blank.html == "Test html."


def test_block_templated_message_body_same_as_html(app):
    """Test that the subject and body are read correctly."""
    with app.app_context():
        blank = BlockTemplatedMessage("tests/subject_body.html")
        assert blank.subject == "Test subject."
        assert blank.body == "Test body."
        assert blank.html == "Test body."


def test_invalid_block_templated_message_templates(app):
    """Test invalid templates."""
    with app.app_context():
        with pytest.raises(TemplateError) as ex:
            BlockTemplatedMessage("tests/blank.html")
        assert "No block with name 'subject'" in str(ex.value)

        with pytest.raises(TemplateError) as ex:
            BlockTemplatedMessage("tests/subject_only.html")
        assert "No block with name 'body'" in str(ex.value)


def test_block_template_with_missing_template(app):
    """Test that a missing template raises an exception."""
    with app.app_context():
        with pytest.raises(TemplateNotFound):
            BlockTemplatedMessage("tests/missing.html")


def test_email_on_loan_checkout(app, users, testdata, loan_params, mocker):
    """Test that an email is sent when an admin performs a loan checkout."""
    app.config.update(CELERY_TASK_ALWAYS_EAGER=True)

    loan_data = testdata["loans"][1]
    loan = Loan.get_record_by_pid(loan_data["pid"])
    with app.extensions["mail"].record_messages() as outbox:
        admin = users["admin"]
        login_user(admin)

        assert len(outbox) == 0
        current_circulation.circulation.trigger(
            loan, **dict(loan_params, trigger="checkout")
        )
        assert len(outbox) == 1


def test_log_successful_mail_task(app, testdata, mocker, users):
    """Test that a successfully sent email is logged."""
    app.config.update(CELERY_TASK_ALWAYS_EAGER=True)
    mocker.patch(
        "invenio_app_ils.records.api.Patron.get_patron",
        return_value=Patron(users["patron1"].id),
    )
    succ = mocker.patch(
        "invenio_app_ils.circulation.mail.tasks.log_successful_mail"
    )
    loan = testdata["loans"][0]

    assert not succ.s.called
    send_loan_mail("extend", loan)
    assert succ.s.called


def test_log_error_mail_task(app, testdata, mocker, users):
    """Test that an error is logged on email send error."""
    prev_sender = app.config["MAIL_NOTIFY_SENDER"]
    app.config.update(
        dict(CELERY_TASK_ALWAYS_EAGER=True, MAIL_NOTIFY_SENDER=[])
    )
    mocker.patch(
        "invenio_app_ils.records.api.Patron.get_patron",
        return_value=Patron(users["patron1"].id),
    )
    err = mocker.patch("invenio_app_ils.circulation.mail.tasks.log_error_mail")
    loan = testdata["loans"][0]

    assert not err.s.called
    send_loan_mail("extend", loan)
    assert err.s.called

    # restore
    app.config.update(MAIL_NOTIFY_SENDER=prev_sender)


def test_example_loader(app, example_message_factory):
    """Test a function based message loader."""
    msg = example_message_factory("Subject", "Body")
    assert msg.subject == "Subject"
    assert msg.body == "Body"


def test_email_on_overdue_loan(app, users, testdata, mocker):
    """Test that an email is sent when an admin performs a loan checkout."""
    app.config.update(CELERY_TASK_ALWAYS_EAGER=True)
    mocker.patch(
        "invenio_app_ils.records.api.Patron.get_patron",
        return_value=Patron(users["patron1"].id),
    )
    loan_data = testdata["loans"][-1]
    loan = Loan.get_record_by_pid(loan_data["pid"])
    with app.extensions["mail"].record_messages() as outbox:
        assert len(outbox) == 0
        send_loan_overdue_reminder_mail(loan)
        assert len(outbox) == 1


def test_send_only_to_test_recipients(app, users, testdata, mocker):
    """Tests that send only to test recipients works."""

    class M(Message):
        def __init__(self, *args, **kwargs):
            kwargs.pop("trigger", None)
            kwargs.pop("message_ctx", {})
            kwargs.setdefault("sender", app.config["MAIL_NOTIFY_SENDER"])
            super().__init__(**kwargs)

    app.config.update(
        dict(
            CELERY_TASK_ALWAYS_EAGER=True,
            ILS_MAIL_LOAN_MSG_LOADER=M,
            ILS_MAIL_ENABLE_TEST_RECIPIENTS=True
        )
    )
    patron = Patron(users["patron1"].id)
    mocker.patch(
        "invenio_app_ils.records.api.Patron.get_patron",
        return_value=patron,
    )
    loan_data = testdata["loans"][-1]
    loan = Loan.get_record_by_pid(loan_data["pid"])
    fake_recipients = app.config["ILS_MAIL_NOTIFY_TEST_RECIPIENTS"]
    with app.extensions["mail"].record_messages() as outbox:
        assert len(outbox) == 0
        send_loan_mail("trigger", loan, subject="Test", body="Test")
        assert len(outbox) == 1
        assert outbox[0].recipients == fake_recipients
