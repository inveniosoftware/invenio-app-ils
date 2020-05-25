# -*- coding: utf-8 -*-
#
# Copyright (C) 2020 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""ILS message loaders."""

from invenio_app_ils.document_requests.mail.messages import \
    DocumentRequestMessage


def document_request_message_loader(request, **kwargs):
    """Loan message loader."""
    return DocumentRequestMessage(request, **kwargs)
