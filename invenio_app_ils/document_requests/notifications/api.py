# SPDX-FileCopyrightText: 2021 CERN.
# SPDX-License-Identifier: MIT

"""Document requests notifications APIs."""

from flask import current_app
from invenio_records_rest.utils import obj_or_import_string

from invenio_app_ils.notifications.api import build_common_msg_ctx, send_notification


def send_document_request_notification(
    document_request, action, msg_extra_ctx=None, **kwargs
):
    """Send notification to patron about a document request action."""
    _filter = current_app.config["ILS_NOTIFICATIONS_FILTER_DOCUMENT_REQUEST"]
    if _filter and _filter(document_request, action, **kwargs) is False:
        return

    msg_ctx = msg_extra_ctx or {}
    msg_ctx.update(build_common_msg_ctx(document_request))

    func_or_path = current_app.config["ILS_NOTIFICATIONS_MSG_BUILDER_DOCUMENT_REQUEST"]
    builder = obj_or_import_string(func_or_path)
    msg = builder(document_request, action, msg_ctx, **kwargs)

    patron = msg_ctx["patron"]
    patrons = [patron]

    send_notification(patrons, msg, **kwargs)


def document_request_notification_filter(record, action, **kwargs):
    """Filter notifications.

    Returns if the notification should be sent
    """
    return True
