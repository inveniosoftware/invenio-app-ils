# -*- coding: utf-8 -*-
#
# Copyright (C) 2019 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""Circulation message factory."""

from functools import partial

from flask import current_app

from invenio_app_ils.circulation.mail.messages import (LoanListMessage,
                                                       LoanMessage)
from invenio_app_ils.mail.factory import message_factory


def loan_message_creator_factory():
    """Loan message factory creator."""
    return partial(
        message_factory, current_app.config["ILS_CIRCULATION_MAIL_MSG_CREATOR"]
    )


def loan_list_message_creator_factory():
    """Loan list message factory creator."""
    return partial(
        message_factory,
        current_app.config["ILS_CIRCULATION_LOANS_MAIL_MSG_CREATOR"],
    )


def default_loan_message_creator(loan, action, message_ctx, **kwargs):
    """Loan message creator."""
    return LoanMessage(loan, action, message_ctx, **kwargs)


def default_loan_list_message_creator(patron, loans, message_ctx, **kwargs):
    """Loan list message creator."""
    return LoanListMessage(patron, loans, message_ctx, **kwargs)
