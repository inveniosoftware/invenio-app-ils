# -*- coding: utf-8 -*-
#
# Copyright (C) 2020 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""Document requests mail tasks."""

from invenio_app_ils.mail.factory import message_factory
from invenio_app_ils.mail.tasks import send_ils_email
from invenio_app_ils.proxies import current_app_ils


def send_document_request_status_mail(request):
    """Send a document request email and format based on the request status."""
    patron = current_app_ils.patron_cls.get_patron(request["patron_pid"])
    msg = message_factory(
        "invenio_app_ils.document_requests.mail.loader:document_request_message_loader",
        request,
        recipients=[patron.email]
    )
    send_ils_email(msg)
