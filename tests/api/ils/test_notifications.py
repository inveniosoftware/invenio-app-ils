# -*- coding: utf-8 -*-
#
# Copyright (C) 2018-2021 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""Test notifications."""

import pytest
from flask import url_for
from jinja2.exceptions import TemplateError, TemplateNotFound

from invenio_app_ils.notifications.api import (
    log_error_notification,
    log_successful_notification,
    send_notification,
)
from invenio_app_ils.notifications.messages import NotificationMsg
from invenio_app_ils.notifications.models import NotificationsLogs
from invenio_app_ils.patrons.api import Patron
from tests.helpers import user_login


def test_message_full(app_with_notifs):
    """Test that the title, body and html are read correctly."""
    with app_with_notifs.app_context():
        # remove footer
        app_with_notifs.config["ILS_NOTIFICATIONS_TEMPLATES"] = {}

        full = NotificationMsg("notifications/title_body_html.html")
        assert full.title == "Test title."
        assert "Test body." == full.body_plain
        assert "Test html." == full.body_html


def test_message_body_same_as_html(app_with_notifs):
    """Test that the title and body are read correctly."""
    with app_with_notifs.app_context():
        # remove footer
        app_with_notifs.config["ILS_NOTIFICATIONS_TEMPLATES"] = {}

        blank = NotificationMsg("notifications/title_body.html")
        assert blank.title == "Test title."
        assert "Test body." == blank.body_plain
        assert "Test body." == blank.body_html


def test_invalid_message_templates(app_with_notifs):
    """Test invalid templates."""
    with app_with_notifs.app_context():
        with pytest.raises(TemplateError) as ex:
            NotificationMsg("notifications/blank.html")
        assert "No block with name 'title'" in str(ex.value)

        with pytest.raises(TemplateError) as ex:
            NotificationMsg("notifications/title_only.html")
        assert "No block with name 'body_plain'" in str(ex.value)


def test_message_templates_escaping(app_with_notifs):
    """Test templates escaping."""
    title = (
        "Spèciâl chäráctèrs: "
        "`,~,!,@,#,$,%,^,&,*,(,),_,-,+,=,{,[,},},|,\\,:,;,',<,>,.,?,/,º,ª "
        "<script>alert('test');</script>"
    )
    ctx = dict(title=title)
    with app_with_notifs.app_context():
        # remove footer
        app_with_notifs.config["ILS_NOTIFICATIONS_TEMPLATES"] = {}

        full = NotificationMsg("notifications/title_body_html_ctx.html", ctx)

        assert full.title == 'Test "{0}" title.'.format(title)

        from jinja2 import escape

        escaped = escape(title)
        assert 'Test "{0}" body.'.format(escaped) == full.body_plain
        assert 'Test "{0}" html.'.format(escaped) == full.body_html


def test_message_with_missing_template(app_with_notifs):
    """Test that a missing template raises an exception."""
    with app_with_notifs.app_context():
        with pytest.raises(TemplateNotFound):
            NotificationMsg("missing.html")


def test_send_message_backend(app_with_notifs, users, testdata, mocker):
    """Test that notifications backend is called when sending."""
    send_mocked = mocker.patch(
        "invenio_app_ils.notifications.backends.mail.send"
    )
    send_mocked.__name__ = "send"
    send_mocked.__annotations__ = "send"
    backends = mocker.patch(
        "invenio_app_ils.notifications.api._get_notification_backends",
        return_value=[send_mocked]
    )
    with app_with_notifs.app_context():
        # remove footer
        app_with_notifs.config["ILS_NOTIFICATIONS_TEMPLATES"] = {}

        msg = NotificationMsg("notifications/title_body_html.html")
        patrons = [Patron(users["patron1"].id)]
        send_notification(patrons, msg)

        assert send_mocked.apply_async.called


class FakeMessage(NotificationMsg):
    def __init__(self, *args, **kwargs):
        template = kwargs.pop("template", "notifications/title_body_html.html")
        super().__init__(template, **kwargs)


def test_log_successful_error_mail_task(
    app_with_notifs, users, testdata, mocker
):
    """Test that a successfully sent email is logged."""
    # !attention the mocker has to patch function where it is used, not defined
    succ = mocker.patch(
        "invenio_app_ils.notifications.api.log_successful_notification"
    )
    err = mocker.patch(
        "invenio_app_ils.notifications.api.log_error_notification"
    )

    patron = Patron(users["patron1"].id)

    assert not succ.s.called
    assert not err.s.called
    send_notification([patron], FakeMessage())
    assert succ.s.called
    assert err.s.called


def test_notifications_db_table_and_endpoint(users, client, json_headers,
                                             app_with_notifs):
    """Test logging of notifs in db table and read from endpoint."""
    request = {"id": "test-id", "task": "test-task"}
    data = {
        "id": "test-id",
        "recipients": ["patron1@test.com"],
        "is_manually_triggered": True,
        "message_id": "1",
        "patron_id": "1",
    }
    exc = "An error occurred."
    log_successful_notification(None, data)

    log_error_notification(request=request, exc=exc, traceback=None, data=data)

    assert NotificationsLogs.query.filter_by(id=1).one().send_log == "Success"
    assert (
        NotificationsLogs.query.filter_by(id=2).one().send_log
        == "Error: 'An error occurred.'"
    )

    ITEM_ENDPOINT = "invenio_app_ils_notifications.get_notification"
    LIST_ENDPOINT = "invenio_app_ils_notifications.get_notifications"

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

    assert res.get_json()["send_log"] ==\
           "Error: 'An error occurred.'"
    assert res.get_json()["id"] == 2
