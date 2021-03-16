# -*- coding: utf-8 -*-
#
# Copyright (C) 2018-2021 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""Test email notifications."""

import pytest
from flask import url_for
from jinja2.exceptions import TemplateError, TemplateNotFound

from invenio_app_ils.circulation.mail.messages import BlockTemplatedMessage
from invenio_app_ils.mail.models import EmailLog
from invenio_app_ils.mail.tasks import (
    log_error_mail,
    log_successful_mail,
    send_ils_email,
)
from tests.helpers import user_login


class TestMessage(BlockTemplatedMessage):
    def __init__(self, *args, **kwargs):
        template = kwargs.pop("template", "mail/subject_body_html.html")
        kwargs.setdefault("sender", "sender@test.com")
        kwargs.setdefault("recipients", ["recipient@test.com"])
        super().__init__(template, **kwargs)


def test_block_templated_message_full(app_with_mail):
    """Test that the subject, body and html are read correctly."""
    with app_with_mail.app_context():
        # remove footer
        app_with_mail.config["ILS_GLOBAL_MAIL_TEMPLATES"] = {}

        full = BlockTemplatedMessage("mail/subject_body_html.html")
        assert full.subject == "Test subject."
        assert "Test body." == full.body
        assert "Test html." == full.html


def test_block_templated_message_body_same_as_html(app_with_mail):
    """Test that the subject and body are read correctly."""
    with app_with_mail.app_context():
        # remove footer
        app_with_mail.config["ILS_GLOBAL_MAIL_TEMPLATES"] = {}

        blank = BlockTemplatedMessage("mail/subject_body.html")
        assert blank.subject == "Test subject."
        assert "Test body." == blank.body
        assert "Test body." == blank.html


def test_invalid_block_templated_message_templates(app_with_mail):
    """Test invalid templates."""
    with app_with_mail.app_context():
        with pytest.raises(TemplateError) as ex:
            BlockTemplatedMessage("mail/blank.html")
        assert "No block with name 'subject'" in str(ex.value)

        with pytest.raises(TemplateError) as ex:
            BlockTemplatedMessage("mail/subject_only.html")
        assert "No block with name 'body_plain'" in str(ex.value)


def test_message_templates_escaping(app_with_mail):
    """Test templates escaping."""
    title = "Spèciâl chäráctèrs: " \
        "`,~,!,@,#,$,%,^,&,*,(,),_,-,+,=,{,[,},},|,\\,:,;,',<,>,.,?,/,º,ª " \
        "<script>alert('test');</script>"
    ctx = dict(title=title)
    with app_with_mail.app_context():
        # remove footer
        app_with_mail.config["ILS_GLOBAL_MAIL_TEMPLATES"] = {}

        full = BlockTemplatedMessage("mail/subject_body_html_ctx.html", ctx)

        assert full.subject == "Test \"{0}\" subject.".format(title)

        from jinja2 import escape
        escaped = escape(title)
        assert "Test \"{0}\" body.".format(escaped) == full.body
        assert "Test \"{0}\" html.".format(escaped) == full.html


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
    succ = mocker.patch("invenio_app_ils.mail.tasks.log_successful_mail")

    msg = TestMessage(recipients=["realemail@test.com"])

    fake_recipients = app_with_mail.config["ILS_MAIL_NOTIFY_TEST_RECIPIENTS"]
    with app_with_mail.extensions["mail"].record_messages() as outbox:
        assert len(outbox) == 0
        send_ils_email(msg)
        assert succ.s.called
        assert len(outbox) == 1
        assert outbox[0].recipients == fake_recipients

    app_with_mail.config["ILS_MAIL_ENABLE_TEST_RECIPIENTS"] = False


def test_email_db_table_and_endpoint(users, client, json_headers):
    """Test creation of email in db table and read emails from endpoint."""
    request = {"id": "test-id", "task": "test-task"}
    data = {
        "id": "test-id",
        "recipients": ["patron1@test.com"],
        "is_manually_triggered": True,
        "message_id": "1",
    }
    exc = "An error occurred."
    log_successful_mail(None, data)

    log_error_mail(request=request, exc=exc, traceback=None, data=data)

    assert EmailLog.query.filter_by(id=1).one().send_log == "Success"
    assert (
        EmailLog.query.filter_by(id=2).one().send_log
        == "Error: 'An error occurred.'"
    )

    ITEM_ENDPOINT = "invenio_app_ils_emails_item.get_email"
    LIST_ENDPOINT = "invenio_app_ils_emails_list.get_emails"

    user_login(client, "librarian", users)

    url = url_for(LIST_ENDPOINT)
    res = client.get(url, headers=json_headers)

    assert (
        res.get_json()["hits"][0]["send_log"] == "Error: 'An error occurred.'"
    )
    assert res.get_json()["hits"][1]["send_log"] == "Success"

    url = url_for(ITEM_ENDPOINT, id=1)
    res = client.get(url, headers=json_headers)
    assert res.get_json()["send_log"] == "Success"
    assert res.get_json()["id"] == 1

    url = url_for(ITEM_ENDPOINT, id=2)
    res = client.get(url, headers=json_headers)
    assert res.get_json()["send_log"] == "Error: 'An error occurred.'"
    assert res.get_json()["id"] == 2
