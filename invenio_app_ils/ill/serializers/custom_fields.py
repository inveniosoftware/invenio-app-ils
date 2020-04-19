# -*- coding: utf-8 -*-
#
# Copyright (C) 2020 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""Loan custom serializer functions."""

from invenio_pidstore.errors import PIDDeletedError, PIDDoesNotExistError

from invenio_app_ils.jsonresolver.api import pick
from invenio_app_ils.proxies import current_app_ils


def field_loan(metadata):
    """Get the loan object and add it to the metadata."""
    loan_pid = metadata.get("loan_pid")
    if not loan_pid:
        return
    Loan = current_app_ils.loan_record_cls
    try:
        loan = Loan.get_record_by_pid(loan_pid)
    except PIDDeletedError:
        metadata["loan"] = {"name": "This loan was deleted."}
        return
    except PIDDoesNotExistError:
        metadata["loan"] = {"name": "Invalid Loan PID."}
        return
    metadata["loan"] = pick(loan, "pid", "start_date", "end_date", "state")
