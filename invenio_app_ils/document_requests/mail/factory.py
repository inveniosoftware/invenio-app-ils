# -*- coding: utf-8 -*-
#
# Copyright (C) 2020 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""Circulation message factory."""

from functools import partial

from flask import current_app

from invenio_app_ils.document_requests.mail.messages import \
    DocumentRequestMessage
from invenio_app_ils.mail.factory import message_factory


def document_request_message_creator_factory():
    """Document request message factory creator."""
    return partial(
        message_factory,
        current_app.config["ILS_DOCUMENT_REQUEST_MAIL_MSG_CREATOR"],
    )


def default_document_request_message_creator(record, **kwargs):
    """Document request message creator."""
    return DocumentRequestMessage(record, **kwargs)
