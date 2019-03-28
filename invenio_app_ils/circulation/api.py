# -*- coding: utf-8 -*-
#
# Copyright (C) 2018 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""Invenio App ILS Circulation apis."""

import uuid

from invenio_circulation.api import Loan, patron_has_active_loan_on_item
from invenio_circulation.pidstore.minters import loan_pid_minter
from invenio_circulation.proxies import current_circulation

from invenio_app_ils.circulation.utils import circulation_document_retriever
from invenio_app_ils.errors import MissingRequiredParameterError, \
    PatronHasLoanOnItemError


def request_loan(params):
    """Create a loan and trigger the first transition to create a request."""
    if "patron_pid" not in params:
        raise MissingRequiredParameterError(
            description="'patron_pid' is required on loan request")
    if "document_pid" not in params:
        raise MissingRequiredParameterError(
            description="'document_pid' is required on loan request")

    if patron_has_active_loan_on_item(patron_pid=params["patron_pid"],
                                      item_pid=params["item_pid"]):
        raise PatronHasLoanOnItemError(params["patron_pid"], params["item_pid"])

    # create a new loan
    record_uuid = uuid.uuid4()
    new_loan = {}
    pid = loan_pid_minter(record_uuid, data=new_loan)
    loan = Loan.create(data=new_loan, id_=record_uuid)

    # trigger the first transition
    loan = current_circulation.circulation.trigger(
        loan, **dict(params, trigger="request")
    )

    return pid, loan


def create_loan(params):
    """Create a loan for behalf of a user."""
    if "patron_pid" not in params:
        raise MissingRequiredParameterError(
            description="'patron_pid' is required on loan request")
    if "item_pid" not in params:
        raise MissingRequiredParameterError(
            description="'item_pid' is required on loan request")

    if patron_has_active_loan_on_item(patron_pid=params["patron_pid"],
                                      item_pid=params["item_pid"]):
        raise PatronHasLoanOnItemError(params["patron_pid"], params["item_pid"])

    if "document_pid" not in params:
        document_pid = circulation_document_retriever(params["item_pid"])
        if document_pid:
            params["document_pid"] = document_pid
    # create a new loan
    record_uuid = uuid.uuid4()
    new_loan = {
        "item_pid": params["item_pid"] if params["item_pid"] else ""
    }
    pid = loan_pid_minter(record_uuid, data=new_loan)
    loan = Loan.create(data=new_loan, id_=record_uuid)
    # trigger the first transition
    loan = current_circulation.circulation.trigger(
        loan, **dict(params, trigger="checkout")
    )

    return pid, loan
