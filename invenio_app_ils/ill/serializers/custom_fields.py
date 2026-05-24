# SPDX-FileCopyrightText: 2020 CERN.
# SPDX-License-Identifier: MIT

"""Loan custom serializer functions."""

from invenio_circulation.proxies import current_circulation
from invenio_pidstore.errors import PIDDeletedError, PIDDoesNotExistError

from invenio_app_ils.records.jsonresolvers.api import pick


def field_loan(metadata):
    """Get the loan object and add it to the metadata."""
    loan_pid = metadata.get("patron_loan", {}).get("pid")
    if not loan_pid:
        return
    Loan = current_circulation.loan_record_cls
    try:
        loan = Loan.get_record_by_pid(loan_pid)
    except PIDDeletedError:
        metadata["patron_loan"]["loan"] = {"pid": "This loan was deleted."}
        return
    except PIDDoesNotExistError:
        metadata["patron_loan"]["loan"] = {"pid": "Invalid Loan PID."}
        return
    metadata["patron_loan"]["loan"] = pick(
        loan, "pid", "start_date", "end_date", "state", "extension_count"
    )
