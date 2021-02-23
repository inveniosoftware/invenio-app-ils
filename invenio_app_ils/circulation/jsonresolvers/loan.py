# -*- coding: utf-8 -*-
#
# Copyright (C) 2019-2020 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""Circulation Loan resolvers."""

from invenio_circulation.proxies import current_circulation
from invenio_pidstore.errors import PIDDeletedError

from invenio_app_ils.circulation.utils import resolve_item_from_loan
from invenio_app_ils.documents.utils import flatten_authors
from invenio_app_ils.patrons.api import get_patron_or_unknown_dump
from invenio_app_ils.proxies import current_app_ils
from invenio_app_ils.records.jsonresolvers.api import (
    get_field_value_for_record as get_field_value,
)
from invenio_app_ils.records.jsonresolvers.api import get_pid_or_default, pick


def item_resolver(loan_pid):
    """Resolve an Item given a Loan PID."""
    Loan = current_circulation.loan_record_cls
    loan = Loan.get_record_by_pid(loan_pid)
    if not loan.get("item_pid"):
        return {}

    try:
        # can resolve to an Item or BorrowingRequest
        item = resolve_item_from_loan(loan["item_pid"])
    except PIDDeletedError:
        item = {}
    else:
        # if it the item is a BorrowingRequest, then some of these
        # fields might not be there
        item = pick(
            item,
            "barcode",
            "description",
            "document_pid",
            "medium",
            "pid",
        )

    return item


@get_pid_or_default(default_value=dict())
def loan_patron_resolver(loan_pid):
    """Resolve a Patron given a Loan PID."""
    Loan = current_circulation.loan_record_cls
    try:
        patron_pid = get_field_value(Loan, loan_pid, "patron_pid")
    except KeyError:
        return {}

    return get_patron_or_unknown_dump(patron_pid)


@get_pid_or_default(default_value=dict())
def document_resolver(loan_pid):
    """Resolve a Document given a Loan PID."""
    Loan = current_circulation.loan_record_cls
    try:
        document_pid = get_field_value(Loan, loan_pid, "document_pid")
    except KeyError:
        return {}

    Document = current_app_ils.document_record_cls
    try:
        document = Document.get_record_by_pid(document_pid)
    except PIDDeletedError:
        obj = {}
    else:
        obj = pick(
            document,
            "authors",
            "cover_metadata",
            "document_type",
            "edition",
            "identifiers",
            "open_access",
            "pid",
            "publication_year",
            "title",
        )
        obj["authors"] = flatten_authors(obj["authors"])

    return obj
