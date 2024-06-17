# -*- coding: utf-8 -*-
#
# Copyright (C) 2020 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""Loan custom serializer functions."""

from flask import current_app
from invenio_pidstore.errors import PIDDeletedError, PIDDoesNotExistError

from invenio_app_ils.circulation.utils import circulation_overdue_loan_days
from invenio_app_ils.errors import PatronNotFoundError
from invenio_app_ils.proxies import current_app_ils
from invenio_app_ils.records.jsonresolvers.api import pick


def field_is_overdue(metadata):
    """Calculate if the loan is overdue."""
    metadata["is_overdue"] = False
    is_loan_active = (
        metadata["state"] in current_app.config["CIRCULATION_STATES_LOAN_ACTIVE"]
    )
    if is_loan_active and "end_date" in metadata:
        metadata["is_overdue"] = circulation_overdue_loan_days(metadata) > 0


def field_pickup_location(metadata):
    """Get the pickup location object and add it a property."""
    pickup_location_pid = metadata.get("pickup_location_pid")
    if not pickup_location_pid:
        return
    Location = current_app_ils.location_record_cls
    try:
        pickup_location = Location.get_record_by_pid(pickup_location_pid)
    except PIDDeletedError:
        metadata["pickup_location"] = {"name": "This location was deleted."}
        return
    except PIDDoesNotExistError:
        metadata["pickup_location"] = {"name": "Location PID invalid."}
        return
    metadata["pickup_location"] = pick(pickup_location, "name")


def field_transaction_location(metadata):
    """Get the transaction location object and add it a property."""
    transaction_location_pid = metadata.get("transaction_location_pid")
    if not transaction_location_pid:
        return
    Location = current_app_ils.location_record_cls
    try:
        transaction_location = Location.get_record_by_pid(transaction_location_pid)
    except PIDDeletedError:
        metadata["transaction_location"] = {"name": "This location was deleted."}
        return
    except PIDDoesNotExistError:
        metadata["transaction_location"] = {"name": "Location PID invalid."}
        return
    metadata["transaction_location"] = pick(transaction_location, "name")


def field_transaction_user(metadata):
    """Get the transaction location object and add it a property."""
    transaction_user_pid = metadata.get("transaction_user_pid")
    if not transaction_user_pid:
        return
    Patron = current_app_ils.patron_cls
    try:
        transaction_user = Patron.get_patron(transaction_user_pid)
    except (PIDDeletedError, PatronNotFoundError):
        return
    metadata["transaction_user"] = pick(transaction_user, "name")
