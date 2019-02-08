# -*- coding: utf-8 -*-
#
# Copyright (C) 2019 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""Circulation message loader."""

from invenio_app_ils.circulation.mail.messages import LoanMessage


def loan_message_loader(prev_loan, loan, trigger, **kwargs):
    """Loan message loader."""
    return LoanMessage(prev_loan, loan, trigger, **kwargs)
