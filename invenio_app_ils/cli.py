# -*- coding: utf-8 -*-
#
# Copyright (C) 2018 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""CLI for Invenio App ILS."""

from datetime import datetime, timedelta
from random import randint

import click
import lorem
from flask import current_app
from flask.cli import with_appcontext
from invenio_circulation.api import Loan
from invenio_circulation.pidstore.pids import CIRCULATION_LOAN_PID_TYPE
from invenio_db import db
from invenio_indexer.api import RecordIndexer
from invenio_pidstore.models import PersistentIdentifier, PIDStatus

from .circulation.receivers import index_item_after_loan_change
from .records.api import Document, InternalLocation, Item, Location

from .pidstore.pids import (  # isort:skip
    DOCUMENT_PID_TYPE,
    INTERNAL_LOCATION_PID_TYPE,
    ITEM_PID_TYPE,
    LOCATION_PID_TYPE
)

LOCATION = {
    Location.pid_field: "1",
    "name": "Central Library",
    "address": "",
    "email": ""
}

ITEM_CIRCULATION_RESTRICTIONS = [None, "FOR_REFERENCE_ONLY"]
ITEM_MEDIUMS = ["NOT_SPECIFIED", "ONLINE", "PAPER", "CDROM", "DVD", "VHS"]
ITEM_STATUSES = ["LOANABLE", "MISSING"]
LOAN_STATUSES = ["PENDING", "ITEM_ON_LOAN", "ITEM_RETURNED", "CANCELLED"]


def get_internal_locations(location):
    """Return random internal locations."""
    return [
        {
            InternalLocation.pid_field: "{}".format(i),
            Location.pid_field: location[Location.pid_field],
            "legacy_id": "{}".format(randint(100000, 999999)),
            "name": "Building {}".format(randint(1, 10)),
            "notes": lorem.sentence(),
            "physical_location": lorem.sentence()
        } for i in range(1, randint(8, 10))
    ]


def get_documents_items(internal_locations, n_docs, n_items):
    """Return random document and items."""
    documents = [
        {
            Document.pid_field: "{}".format(i),
            "title": "{}".format(lorem.sentence()),
            "authors": "{}".format(lorem.sentence()),
            "abstracts": ["{}".format(lorem.text())],
        } for i in range(1, n_docs)
    ]
    len_docs = len(documents) - 1
    len_internal_locations = len(internal_locations) - 1
    LEN_ITEM_CIRCULATION_RESTRICTIONS = len(ITEM_CIRCULATION_RESTRICTIONS) - 1
    LEN_ITEM_MEDIUMS = len(ITEM_MEDIUMS) - 1
    LEN_ITEM_STATUSES = len(ITEM_STATUSES) - 1

    items = []
    for i in range(1, n_items):
        doc = documents[randint(0, len_docs)]
        loc = internal_locations[randint(0, len_internal_locations)]
        restr = ITEM_CIRCULATION_RESTRICTIONS[
            randint(0, LEN_ITEM_CIRCULATION_RESTRICTIONS)]

        item = {
            Item.pid_field: "{}".format(i),
            Document.pid_field: "{}".format(doc[Document.pid_field]),
            InternalLocation.pid_field: "{}".format(loc[InternalLocation.pid_field]),
            "legacy_id": "{}".format(randint(100000, 999999)),
            "legacy_library_id": "{}".format(randint(5, 50)),
            "barcode": "{}".format(randint(10000000, 99999999)),
            "shelf": "{}".format(lorem.sentence()),
            "description": "{}".format(lorem.text()),
            "medium": "{}".format(ITEM_MEDIUMS[randint(0, LEN_ITEM_MEDIUMS)]),
            "status": "{}".format(ITEM_STATUSES[randint(0, LEN_ITEM_STATUSES)]),
        }

        if restr:
            item["circulation_restriction"] = "{}".format(restr)

        if "items" in doc:
            doc["items"].append(item["item_pid"])
        else:
            doc["items"] = [item["item_pid"]]

        items.append(item)

    return documents, items


def get_loans_for_items(items, location, patron_ids=None, librarian_id="",
                        n_loans=100):
    """Return random loans."""
    loc_pid = location[Location.pid_field]
    len_patron_ids = len(patron_ids) - 1
    len_items = len(items) - 1
    LEN_LOAN_STATUSES = len(LOAN_STATUSES) - 1
    current_year = datetime.now().year

    def _get_loanable_item(items):
        """Return an item that is loanable."""
        item = items[randint(1, len_items)]
        if item["status"] != "LOANABLE":
            return _get_loanable_item(items)
        return item

    def _get_valid_status(item, items_on_loans):
        """Return valid loan status for the item to avoid inconsistencies."""
        # cannot have 2 loans in the same item
        if item[Item.pid_field] in items_on_loans:
            status = LOAN_STATUSES[0]
        else:
            status = LOAN_STATUSES[randint(0, LEN_LOAN_STATUSES)]
        return status

    loans = []
    items_on_loans = []
    for i in range(1, n_loans):
        item = _get_loanable_item(items)
        status = _get_valid_status(item, items_on_loans)
        if status == "ITEM_ON_LOAN":
            items_on_loans.append(item[Item.pid_field])

        padron_id = randint(1, len_patron_ids)
        transaction_date = datetime(current_year, randint(1, 12),
                                    randint(1, 28))
        expire_date = transaction_date + timedelta(days=10)

        loan = {
            Loan.pid_field: "{}".format(i),
            Item.pid_field: "{}".format(item[Item.pid_field]),
            "patron_pid": "{}".format(padron_id),
            "state": "{}".format(status),
            "transaction_date": transaction_date.strftime("%Y-%m-%d"),
            "transaction_location_pid": "{}".format(loc_pid),
            "transaction_user_pid": "{}".format(librarian_id),
            "pickup_location_pid": "{}".format(loc_pid),
            "request_expire_date": expire_date.strftime("%Y-%m-%d"),
        }

        loans.append(loan)

    return loans


def _mint_record_pid(pid_type, pid_field, record):
    """Mint the given PID for the given record."""
    PersistentIdentifier.create(
        pid_type=pid_type,
        pid_value=record[pid_field],
        object_type='rec',
        object_uuid=record.id,
        status=PIDStatus.REGISTERED
    )
    db.session.commit()


def create_loc_record():
    """Create Location record."""
    record = Location.create(LOCATION)
    _mint_record_pid(LOCATION_PID_TYPE, Location.pid_field, record)
    record.commit()
    return record


def create_iloc_record(internal_location, loc_pid):
    """Create Internal Location record."""
    record = InternalLocation.create(internal_location, **{Location.pid_field: loc_pid})
    _mint_record_pid(INTERNAL_LOCATION_PID_TYPE,
                     InternalLocation.pid_field, record)
    record.commit()
    return record


def create_doc_record(document):
    """Create Document record."""
    record = Document.create(document)
    _mint_record_pid(DOCUMENT_PID_TYPE, Document.pid_field, record)
    record.commit()
    return record


def create_item_record(item):
    """Create Item record."""
    record = Item.create(item)
    _mint_record_pid(ITEM_PID_TYPE, Item.pid_field, record)
    record.commit()
    return record


def create_loan_record(loan):
    """Create Loan record."""
    record = Loan.create(loan)
    _mint_record_pid(CIRCULATION_LOAN_PID_TYPE, Loan.pid_field, record)
    record.commit()
    return record


@click.group()
def demo():
    """Demo data CLI."""


@demo.command()
@click.option('--docs', 'n_docs', default=20)
@click.option('--items', 'n_items', default=50)
@click.option('--loans', 'n_loans', default=100)
@with_appcontext
def data(n_docs, n_items, n_loans):
    """Insert demo data."""
    indexer = RecordIndexer()

    rec_location = create_loc_record()
    db.session.commit()
    indexer.index(rec_location)

    rec_int_locs = []
    with click.progressbar(get_internal_locations(rec_location),
                           label="Internal Locations") as ilocs:
        for iloc in ilocs:
            rec = create_iloc_record(iloc, rec_location[Location.pid_field])
            rec_int_locs.append(rec)

    documents, items = get_documents_items(rec_int_locs, n_docs=n_docs,
                                           n_items=n_items)
    rec_docs = []
    with click.progressbar(documents,
                           label="Documents") as docs:
        for doc in docs:
            rec = create_doc_record(doc)
            rec_docs.append(rec)

    rec_items = []
    with click.progressbar(items,
                           label="Items") as _items:
        for item in _items:
            rec = create_item_record(item)
            rec_items.append(rec)

    db.session.commit()

    with click.progressbar(rec_int_locs + rec_docs + rec_items,
                           label="Indexing") as _recs:
        for _rec in _recs:
            indexer.index(_rec)

    loans = get_loans_for_items(rec_items, rec_location, patron_ids=["1", "2"],
                                librarian_id="4", n_loans=n_loans)
    with click.progressbar(loans,
                           label="Loans") as _loans:
        for loan in _loans:
            rec = create_loan_record(loan)
            db.session.commit()
            indexer.index(rec)
            # re-index item attached to the loan
            index_item_after_loan_change(current_app, rec)
