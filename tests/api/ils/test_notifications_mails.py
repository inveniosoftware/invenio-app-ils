# -*- coding: utf-8 -*-
#
# Copyright (C) 2021 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""Test notifications backend emails."""

from invenio_app_ils.notifications.api import send_notification
from invenio_app_ils.notifications.messages import NotificationMsg
from invenio_app_ils.patrons.api import Patron


class FakeMessage(NotificationMsg):
    def __init__(self, *args, **kwargs):
        template = kwargs.pop("template", "notifications/title_body_html.html")
        super().__init__(template, **kwargs)


def test_send_only_to_test_recipients(app_with_notifs, users, testdata,
                                      mocker):
    """Tests that send only to test recipients works."""
    app_with_notifs.config["ILS_MAIL_ENABLE_TEST_RECIPIENTS"] = True
    succ = mocker.patch(
        "invenio_app_ils.notifications.api.log_successful_notification")

    msg = FakeMessage()
    patron = Patron(users["patron1"].id)

    fake_recipients = app_with_notifs.config["ILS_MAIL_NOTIFY_TEST_RECIPIENTS"]
    with app_with_notifs.extensions["mail"].record_messages() as outbox:
        assert len(outbox) == 0
        send_notification([patron], msg)
        assert succ.s.called
        assert len(outbox) == 1
        assert outbox[0].recipients == fake_recipients

    app_with_notifs.config["ILS_MAIL_ENABLE_TEST_RECIPIENTS"] = False
