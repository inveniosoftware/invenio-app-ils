# -*- coding: utf-8 -*-
#
# Copyright (C) 2018 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""Test email notifications."""

import pytest
from flask_security import login_user
from invenio_circulation.api import Loan
from invenio_circulation.proxies import current_circulation
from invenio_mail.tasks import send_email
from jinja2.exceptions import TemplateError, TemplateNotFound

from invenio_app_ils.circulation.mail.messages import BlockTemplatedMessage
from invenio_app_ils.circulation.mail.tasks import send_ils_mail


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
    loan = Loan.get_record_by_pid(loan_data["loan_pid"])
    with app.extensions["mail"].record_messages() as outbox:
        admin = users["admin"]
        login_user(admin)

        assert len(outbox) == 0
        loan = current_circulation.circulation.trigger(
            loan, **dict(loan_params, trigger="checkout")
        )
        assert len(outbox) == 1


def test_log_successful_mail_task(app, testdata, mocker, loan_msg_factory):
    """Test that a successfully sent email is logged."""
    app.config.update(CELERY_TASK_ALWAYS_EAGER=True)
    succ = mocker.patch(
        "invenio_app_ils.circulation.mail.tasks.log_successful_mail"
    )
    loan = testdata["loans"][0]

    assert not succ.s.called
    send_ils_mail(loan_msg_factory, loan, loan, "extend",
                  recipients=["patron1@test.ch"])
    assert succ.s.called


def test_example_loader(app, example_message_factory):
    """Test a function based message loader."""
    msg = example_message_factory("Subject", "Body")
    assert msg.subject == "Subject"
    assert msg.body == "Body"
