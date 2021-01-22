# -*- coding: utf-8 -*-
#
# Copyright (C) 2020 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""Document requests mail tasks."""

from invenio_app_ils.document_requests.mail.factory import (
    document_request_message_creator_factory,
)
from invenio_app_ils.mail.messages import get_common_message_ctx
from invenio_app_ils.mail.tasks import send_ils_email


def send_document_request_mail(request, action=None, message_ctx={}, **kwargs):
    """Send a document request email.

    :param request: the document request record.
    :param action: the action performed, if any.
    :param message_ctx: any other parameter to be passed as ctx in the msg.
    """
    creator = document_request_message_creator_factory()

    message_ctx.update(get_common_message_ctx(record=request))
    patron = message_ctx["patron"]

    msg = creator(
        request,
        action=action,
        message_ctx=message_ctx,
        recipients=[patron.email],
        **kwargs,
    )
    send_ils_email(msg)
