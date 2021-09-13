from invenio_app_ils.document_requests.notifications.api import (
    send_document_request_notification,
)


def test_notification_document_request_filter(app_with_notifs, mocker, users,
                                              testdata):
    """Test notification filtering."""

    def filter_document_request_messages(record, action, **kwargs):
        """Define notification filter."""
        if action == "decline":
            return False
        return True

    send_mocked = mocker.patch(
        "invenio_app_ils.notifications.backends.mail.send"
    )
    send_mocked.__name__ = "send"
    send_mocked.__annotations__ = "send"
    backends = mocker.patch(
        "invenio_app_ils.notifications.api._get_notification_backends",
        return_value=[send_mocked]
    )
    document_request = testdata["document_requests"][0]
    with app_with_notifs.app_context():
        # remove footer
        app_with_notifs.config["ILS_NOTIFICATIONS_TEMPLATES"] = {}
        # set filtering on the document requests
        app_with_notifs.config["ILS_NOTIFICATIONS_FILTER_DOCUMENT_REQUEST"]\
            = filter_document_request_messages

        send_document_request_notification(document_request, action="decline",
                                           msg_extra_ctx={})

        assert not send_mocked.apply_async.called
