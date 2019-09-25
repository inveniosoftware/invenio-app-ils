# -*- coding: utf-8 -*-
#
# Copyright (C) 2018 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""Invenio App ILS Circulation APIs."""

import uuid
from copy import deepcopy

from elasticsearch import VERSION as ES_VERSION
from flask import current_app
from invenio_circulation.api import Loan
from invenio_circulation.pidstore.minters import loan_pid_minter
from invenio_circulation.proxies import current_circulation
from invenio_circulation.search.api import search_by_patron_item_or_document
from invenio_db import db

from invenio_app_ils.errors import MissingRequiredParameterError, \
    PatronHasLoanOnItemError, PatronHasRequestOnDocumentError
from invenio_app_ils.proxies import current_app_ils_extension
from invenio_app_ils.records.api import Item


def _validate_delivery(delivery):
    """Validate `delivery` param."""
    methods = list(
        current_app.config.get("CIRCULATION_DELIVERY_METHODS", {}).keys()
    )
    if methods:
        if not delivery or delivery["method"] not in methods:
            raise MissingRequiredParameterError(
                description="A valid 'delivery' is required on loan request"
            )


def _set_item_to_can_circulate(item_pid):
    """Change the item status to CAN_CIRCULATE."""
    item = Item.get_record_by_pid(item_pid)
    if item["status"] != "CAN_CIRCULATE":
        item = item.patch(
            [{"op": "replace", "path": "/status", "value": "CAN_CIRCULATE"}]
        )
        item.commit()
        db.session.commit()
        current_app_ils_extension.item_indexer.index(item)


def patron_has_request_on_document(patron_pid, document_pid):
    """Return True if patron has a request for the given document."""
    search = search_by_patron_item_or_document(
        patron_pid=patron_pid,
        document_pid=document_pid,
        filter_states=current_app.config["CIRCULATION_STATES_LOAN_REQUEST"],
    )
    search_result = search.execute()
    if ES_VERSION[0] >= 7:
        return search_result.hits.total.value > 0
    else:
        return search_result.hits.total > 0


def request_loan(
    document_pid,
    patron_pid,
    transaction_location_pid,
    transaction_user_pid,
    **kwargs
):
    """Create a new loan and trigger the first transition to PENDING."""
    if patron_has_request_on_document(
        patron_pid=patron_pid, document_pid=document_pid
    ):
        raise PatronHasRequestOnDocumentError(patron_pid, document_pid)
    _validate_delivery(kwargs.get("delivery"))

    # create a new loan
    record_uuid = uuid.uuid4()
    new_loan = dict(
        patron_pid=patron_pid,
        transaction_location_pid=transaction_location_pid,
        transaction_user_pid=transaction_user_pid,
    )
    pid = loan_pid_minter(record_uuid, data=new_loan)
    loan = Loan.create(data=new_loan, id_=record_uuid)

    params = deepcopy(loan)
    params.update(document_pid=document_pid, **kwargs)

    # trigger the transition to request
    loan = current_circulation.circulation.trigger(
        loan, **dict(params, trigger="request")
    )

    return pid, loan


def patron_has_active_loan_on_item(patron_pid, item_pid):
    """Return True if patron has a active Loan for given item."""
    search = search_by_patron_item_or_document(
        patron_pid=patron_pid,
        item_pid=item_pid,
        filter_states=current_app.config["CIRCULATION_STATES_LOAN_ACTIVE"],
    )
    search_result = search.execute()
    if ES_VERSION[0] >= 7:
        return search_result.hits.total.value > 0
    else:
        return search_result.hits.total > 0


def checkout_loan(
    item_pid,
    patron_pid,
    transaction_location_pid,
    transaction_user_pid,
    force=False,
    **kwargs
):
    """Create a new loan and trigger the first transition to ITEM_ON_LOAN."""
    if patron_has_active_loan_on_item(
        patron_pid=patron_pid, item_pid=item_pid
    ):
        raise PatronHasLoanOnItemError(patron_pid, item_pid)
    optional_delivery = kwargs.get("delivery")
    if optional_delivery:
        _validate_delivery(optional_delivery)

    if force:
        _set_item_to_can_circulate(item_pid)

    # create a new loan
    record_uuid = uuid.uuid4()
    new_loan = dict(
        patron_pid=patron_pid,
        transaction_location_pid=transaction_location_pid,
        transaction_user_pid=transaction_user_pid,
    )
    pid = loan_pid_minter(record_uuid, data=new_loan)
    loan = Loan.create(data=new_loan, id_=record_uuid)

    params = deepcopy(loan)
    params.update(item_pid=item_pid, **kwargs)

    # trigger the transition to request
    loan = current_circulation.circulation.trigger(
        loan, **dict(params, trigger="checkout")
    )

    return pid, loan
