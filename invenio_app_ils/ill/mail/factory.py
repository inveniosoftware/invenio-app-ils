# -*- coding: utf-8 -*-
#
# Copyright (C) 2020 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""ILL message factory."""

from functools import partial

from flask import current_app

from invenio_app_ils.ill.mail.messages import ILLMessage
from invenio_app_ils.mail.factory import message_factory


def ill_message_creator_factory():
    """ILL message factory creator."""
    return partial(
        message_factory, current_app.config["ILS_ILL_MAIL_MSG_CREATOR"]
    )


def default_ill_message_creator(record, **kwargs):
    """ILL message creator."""
    return ILLMessage(record, **kwargs)
