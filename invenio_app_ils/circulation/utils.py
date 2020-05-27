# -*- coding: utf-8 -*-
#
# Copyright (C) 2018-2020 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""Circulation configuration callbacks."""

from __future__ import absolute_import, print_function

from datetime import timedelta

import arrow
from flask import current_app, g, has_request_context
from flask_login import current_user

from invenio_app_ils.errors import UnknownItemPidTypeError
from invenio_app_ils.ill.api import BORROWING_REQUEST_PID_TYPE
from invenio_app_ils.ill.proxies import current_ils_ill
from invenio_app_ils.permissions import backoffice_permission
from invenio_app_ils.pidstore.pids import ITEM_PID_TYPE
from invenio_app_ils.proxies import current_app_ils


def circulation_build_item_ref(loan_pid, loan):
    """Build $ref for the Item attached to the Loan."""
    return {
        "$ref": "{scheme}://{host}/api/resolver/circulation/loans/{loan_pid}/"
        "item".format(
            scheme=current_app.config["JSONSCHEMAS_URL_SCHEME"],
            host=current_app.config["JSONSCHEMAS_HOST"],
            loan_pid=loan_pid,
        )
    }


def circulation_build_patron_ref(loan_pid, loan):
    """Build $ref for the Patron of the Loan."""
    return {
        "$ref": "{scheme}://{host}/api/resolver/circulation/loans/{loan_pid}/"
        "patron".format(
            scheme=current_app.config["JSONSCHEMAS_URL_SCHEME"],
            host=current_app.config["JSONSCHEMAS_HOST"],
            loan_pid=loan_pid,
        )
    }


def circulation_build_document_ref(loan_pid, loan):
    """Build $ref for the Document attached to the Loan."""
    return {
        "$ref": "{scheme}://{host}/api/resolver/circulation/loans/{loan_pid}/"
        "document".format(
            scheme=current_app.config["JSONSCHEMAS_URL_SCHEME"],
            host=current_app.config["JSONSCHEMAS_HOST"],
            loan_pid=loan_pid,
        )
    }


def circulation_default_extension_max_count(loan):
    """Return a default extensions max count."""
    is_admin_or_librarian = has_request_context() and \
                            backoffice_permission().allows(g.identity)
    if is_admin_or_librarian:
        unlimited = loan.get("extension_count", 0) + 1
        return unlimited
    return 3


def circulation_is_loan_duration_valid(loan):
    """Validate the loan duration."""
    return loan["end_date"] > loan["start_date"] and loan["end_date"] - loan[
        "start_date"
    ] < timedelta(days=60)


def circulation_can_be_requested(loan):
    """Checkout policy: return True if request is valid."""
    return True


def circulation_overdue_loan_days(loan):
    """Return the amount of days a loan is overdue."""
    end_date = arrow.get(loan["end_date"])
    return (arrow.utcnow() - end_date).days


def circulation_loan_will_expire_days():
    """Return a number of days before a loan expires."""
    return arrow.utcnow() + timedelta(
        days=current_app.config["ILS_CIRCULATION_LOAN_WILL_EXPIRE_DAYS"])


def circulation_transaction_location_validator(transaction_location_pid):
    """Validate that the given transaction location PID is valid."""
    return (
        transaction_location_pid
        == current_app.config["ILS_DEFAULT_LOCATION_PID"]
    )


def circulation_transaction_user_validator(transaction_user_pid):
    """Validate that the given transaction user PID is valid."""
    return transaction_user_pid == str(current_user.id)


def resolve_item_from_loan(item_pid):
    """Resolve the item referenced in loan based on its PID type."""
    if item_pid["type"] == ITEM_PID_TYPE:
        rec_cls = current_app_ils.item_record_cls
    elif item_pid["type"] == BORROWING_REQUEST_PID_TYPE:
        rec_cls = current_ils_ill.borrowing_request_record_cls
    else:
        raise UnknownItemPidTypeError(pid_type=item_pid["type"])
    return rec_cls.get_record_by_pid(item_pid["value"])
