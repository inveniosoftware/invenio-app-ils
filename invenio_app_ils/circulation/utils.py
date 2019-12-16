# -*- coding: utf-8 -*-
#
# Copyright (C) 2018 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""Circulation configuration callbacks."""

from __future__ import absolute_import, print_function

from datetime import datetime, timedelta

import arrow
from flask import current_app


def circulation_build_item_ref(loan_pid):
    """Build $ref for the Item attached to the Loan."""
    return {
        "$ref": "{scheme}://{host}/api/resolver/circulation/loans/{loan_pid}/"
                "item".format(
                    scheme=current_app.config["JSONSCHEMAS_URL_SCHEME"],
                    host=current_app.config["JSONSCHEMAS_HOST"],
                    loan_pid=loan_pid,
                )
    }


def circulation_build_patron_ref(loan_pid):
    """Build $ref for the Patron of the Loan."""
    return {
        "$ref": "{scheme}://{host}/api/resolver/circulation/loans/{loan_pid}/"
                "patron".format(
                    scheme=current_app.config["JSONSCHEMAS_URL_SCHEME"],
                    host=current_app.config["JSONSCHEMAS_HOST"],
                    loan_pid=loan_pid,
                )
    }


def circulation_build_document_ref(loan_pid):
    """Build $ref for the Document attached to the Loan."""
    return {
        "$ref": "{scheme}://{host}/api/resolver/circulation/loans/{loan_pid}/"
                "document".format(
                    scheme=current_app.config["JSONSCHEMAS_URL_SCHEME"],
                    host=current_app.config["JSONSCHEMAS_HOST"],
                    loan_pid=loan_pid,
                )
    }


def circulation_default_loan_duration(loan):
    """Return a default loan duration in timedelta."""
    return timedelta(days=30)


def circulation_default_extension_duration(loan):
    """Return a default extension duration in timedelta."""
    return timedelta(days=30)


def circulation_default_extension_max_count(loan):
    """Return a default extensions max count."""
    return float("inf")


def circulation_is_loan_duration_valid(loan):
    """Validate the loan duration."""
    return loan["end_date"] > loan["start_date"] and loan["end_date"] - loan[
        "start_date"
    ] < timedelta(days=60)


def circulation_can_be_requested(loan):
    """Return True if the Document/Item for the given Loan can be requested."""
    return True


def circulation_overdue_loan_days(loan):
    """Return the amount of days a loan is overdue."""
    end_date = arrow.get(loan["end_date"])
    return (arrow.get().utcnow() - end_date).days


def circulation_upcoming_return_range():
    """Return a default upcoming return range."""
    return arrow.utcnow() + timedelta(days=7)
