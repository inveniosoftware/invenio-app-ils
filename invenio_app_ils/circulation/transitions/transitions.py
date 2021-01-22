# -*- coding: utf-8 -*-
#
# Copyright (C) 2020 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""Circulation custom transitions."""

import arrow
from invenio_circulation.transitions.transitions import (
    ItemOnLoanToItemOnLoan,
    ToItemOnLoan,
)

from invenio_app_ils.closures.api import find_next_open_date
from invenio_app_ils.ill.api import circulation_item_location_retriever


def _update_loan_end_date(loan):
    """Update the end date to the next opening day."""
    loan["end_date"] = arrow.get(
        find_next_open_date(
            circulation_item_location_retriever(loan["item_pid"]),
            loan["end_date"].date(),
        )
    )


class ILSToItemOnLoan(ToItemOnLoan):
    """Action to checkout."""

    def before(self, loan, initial_loan, **kwargs):
        """Update the end date to the next opening day."""
        super().before(loan, initial_loan, **kwargs)

        _update_loan_end_date(loan)


class ILSItemOnLoanToItemOnLoan(ItemOnLoanToItemOnLoan):
    """Extend action to perform a item loan extension."""

    def before(self, loan, initial_loan, **kwargs):
        """Update the end date to the next opening day."""
        super().before(loan, initial_loan, **kwargs)

        _update_loan_end_date(loan)
