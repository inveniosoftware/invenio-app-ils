# -*- coding: utf-8 -*-
#
# Copyright (C) 2018 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""Test email notifications."""

import pytest
from jinja2.exceptions import TemplateError, TemplateNotFound

from invenio_app_ils.circulation.mail.messages import BlockTemplatedMessage
from invenio_app_ils.mail.tasks import send_ils_email


class TestMessage(BlockTemplatedMessage):
    def __init__(self, *args, **kwargs):
        template = kwargs.pop("template", "mail/subject_body_html.html")
        kwargs.setdefault("sender", "sender@test.com")
        kwargs.setdefault("recipients", ["recipient@test.com"])
        super().__init__(template, **kwargs)


def test_block_templated_message_full(app_with_mail):
    """Test that the subject, body and html are read correctly."""
    with app_with_mail.app_context():
        full = BlockTemplatedMessage("mail/subject_body_html.html")
        assert full.subject == "Test subject."
        assert "Test body." in full.body
        assert "Test html." in full.html


def test_block_templated_message_body_same_as_html(app_with_mail):
    """Test that the subject and body are read correctly."""
    with app_with_mail.app_context():
        blank = BlockTemplatedMessage("mail/subject_body.html")
        assert blank.subject == "Test subject."
        assert "Test body." in blank.body
        assert "Test body." in blank.html


def test_invalid_block_templated_message_templates(app_with_mail):
    """Test invalid templates."""
    with app_with_mail.app_context():
        with pytest.raises(TemplateError) as ex:
            BlockTemplatedMessage("mail/blank.html")
        assert "No block with name 'subject'" in str(ex.value)

        with pytest.raises(TemplateError) as ex:
            BlockTemplatedMessage("mail/subject_only.html")
        assert "No block with name 'body_plain'" in str(ex.value)


def test_block_template_with_missing_template(app_with_mail):
    """Test that a missing template raises an exception."""
    with app_with_mail.app_context():
        with pytest.raises(TemplateNotFound):
            BlockTemplatedMessage("missing.html")


def test_log_successful_error_mail_task(app_with_mail, mocker):
    """Test that a successfully sent email is logged."""
    succ = mocker.patch("invenio_app_ils.mail.tasks.log_successful_mail")
    err = mocker.patch("invenio_app_ils.mail.tasks.log_error_mail")

    assert not succ.s.called
    assert not err.s.called
    send_ils_email(TestMessage())
    assert succ.s.called
    assert err.s.called


def test_example_loader(app_with_mail, example_message_factory):
    """Test a function based message loader."""
    msg = example_message_factory("Subject", "Body")
    assert msg.subject == "Subject"
    assert msg.body == "Body"


def test_send_only_to_test_recipients(app_with_mail, mocker):
    """Tests that send only to test recipients works."""
    app_with_mail.config["ILS_MAIL_ENABLE_TEST_RECIPIENTS"] = True

    msg = TestMessage(recipients=["realemail@test.com"])

    fake_recipients = app_with_mail.config["ILS_MAIL_NOTIFY_TEST_RECIPIENTS"]
    with app_with_mail.extensions["mail"].record_messages() as outbox:
        assert len(outbox) == 0
        send_ils_email(msg)
        assert len(outbox) == 1
        assert outbox[0].recipients == fake_recipients

    app_with_mail.config["ILS_MAIL_ENABLE_TEST_RECIPIENTS"] = False
