# -*- coding: utf-8 -*-
#
# Copyright (C) 2019 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""Circulation message factory."""

from functools import partial

from flask import current_app

from invenio_app_ils.mail.factory import message_factory


def loan_message_factory():
    """Create a loan message factory."""
    return partial(
        message_factory, current_app.config["ILS_MAIL_LOAN_MSG_LOADER"]
    )
