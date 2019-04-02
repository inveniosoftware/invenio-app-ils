# -*- coding: utf-8 -*-
#
# Copyright (C) 2018 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""CLI for Invenio App ILS."""

from datetime import datetime, timedelta
from random import randint, sample

import click
import lorem
from flask.cli import with_appcontext
from invenio_circulation.api import Loan
from invenio_circulation.pidstore.pids import CIRCULATION_LOAN_PID_TYPE
from invenio_db import db
from invenio_indexer.api import RecordIndexer
from invenio_pidstore.models import PersistentIdentifier, PIDStatus, \
    RecordIdentifier
from invenio_search import current_search

from .records.api import Document, InternalLocation, Item, Keyword, Location

from .pidstore.pids import (  # isort:skip
    DOCUMENT_PID_TYPE,
    INTERNAL_LOCATION_PID_TYPE,
    ITEM_PID_TYPE,
    KEYWORD_PID_TYPE,
    LOCATION_PID_TYPE,
)

LOCATION = {
    Location.pid_field: "1",
    "name": "Central Library",
    "address": "Rue de Meyrin",
    "email": "library@cern.ch",
}

ITEM_CIRCULATION_RESTRICTIONS = ["NO_RESTRICTION", "FOR_REFERENCE_ONLY"]
ITEM_MEDIUMS = ["NOT_SPECIFIED", "ONLINE", "PAPER", "CDROM", "DVD", "VHS"]
ITEM_STATUSES = ["LOANABLE", "MISSING"]
LOAN_STATUSES = ["PENDING", "ITEM_ON_LOAN", "ITEM_RETURNED", "CANCELLED"]

ITEM_DOCUMENT_MAPPING = {}


def get_internal_locations(location):
    """Return random internal locations."""
    return [
        {
            InternalLocation.pid_field: "{}".format(i),
            "legacy_id": "{}".format(randint(100000, 999999)),
            "name": "Building {}".format(randint(1, 10)),
            "notes": lorem.sentence(),
            "physical_location": lorem.sentence(),
        }
        for i in range(1, randint(8, 10))
    ]


def get_keywords(n_keywords):
    """Return random keywords."""
    return [
        {
            Keyword.pid_field: "{}".format(i),
            "name": "Keyword {}".format(i),
        }
        for i in range(1, n_keywords)
    ]


def get_documents_items(internal_locations, n_docs, n_items):
    """Return random document and items."""
    documents = [
        {
            Document.pid_field: "{}".format(i),
            "title": "{}".format(lorem.sentence()),
            "authors": ["{}".format(lorem.sentence())],
            "abstracts": ["{}".format(lorem.text())],
            "publishers": ["{}".format(lorem.sentence())],
            "files": ["https://cds.cern.ch/record/2255762/files/CERN-Brochure-2017-002-Eng.pdf",
                      "https://cds.cern.ch/record/2256277/files/CERN-Brochure-2016-005-Eng.pdf"],
            "booklinks": ["https://home.cern/science/physics/dark-matter",
                          "https://home.cern/science/physics/antimatter"],
            "chapters": ["{}".format(lorem.sentence())],
            "information": "{}".format(lorem.text()),
        }
        for i in range(1, n_docs)
    ]
    len_docs = len(documents) - 1
    LEN_ITEM_CIRCULATION_RESTRICTIONS = len(ITEM_CIRCULATION_RESTRICTIONS) - 1
    LEN_ITEM_MEDIUMS = len(ITEM_MEDIUMS) - 1
    LEN_ITEM_STATUSES = len(ITEM_STATUSES) - 1

    items = []
    for i in range(1, n_items):
        doc = documents[randint(0, len_docs)]
        restr = ITEM_CIRCULATION_RESTRICTIONS[
            randint(0, LEN_ITEM_CIRCULATION_RESTRICTIONS)
        ]

        item = {
            Document.pid_field: "{}".format(doc[Document.pid_field]),
            Item.pid_field: "{}".format(i),
            "legacy_id": "{}".format(randint(100000, 999999)),
            "legacy_library_id": "{}".format(randint(5, 50)),
            "barcode": "{}".format(randint(10000000, 99999999)),
            "shelf": "{}".format(lorem.sentence()),
            "description": "{}".format(lorem.text()),
            "medium": "{}".format(ITEM_MEDIUMS[randint(0, LEN_ITEM_MEDIUMS)]),
            "status": "{}".format(
                ITEM_STATUSES[randint(0, LEN_ITEM_STATUSES)]
            ),
        }

        ITEM_DOCUMENT_MAPPING["{}".format(i)] = doc[Document.pid_field]

        if restr:
            item["circulation_restriction"] = "{}".format(restr)

        items.append(item)

    return documents, items


def get_loans_for_items(
    items, location, patron_ids=None, librarian_id="", n_loans=100
):
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
        patron_id = randint(1, len_patron_ids)
        transaction_date = datetime(
            current_year, randint(1, 12), randint(1, 28)
        )
        expire_date = transaction_date + timedelta(days=10)
        start_date = transaction_date + timedelta(days=3)
        end_date = transaction_date + timedelta(days=13)

        loan = {
            Document.pid_field: "{}".format(
                ITEM_DOCUMENT_MAPPING[item[Item.pid_field]]
            ),
            Item.pid_field: "{}".format(item[Item.pid_field]),
            Loan.pid_field: "{}".format(i),
            "patron_pid": "{}".format(patron_id),
            "pickup_location_pid": "{}".format(loc_pid),
            "request_expire_date": expire_date.strftime("%Y-%m-%d"),
            "state": "{}".format(status),
            "start_date": start_date.strftime("%Y-%m-%d"),
            "end_date": end_date.strftime("%Y-%m-%d"),
            "transaction_date": transaction_date.strftime("%Y-%m-%d"),
            "transaction_location_pid": "{}".format(loc_pid),
            "transaction_user_pid": "{}".format(librarian_id),
        }

        if status == "PENDING":
            loan[Item.pid_field] = ""
        else:
            loan[Item.pid_field] = "{}".format(item[Item.pid_field])
            items_on_loans.append(item[Item.pid_field])

        loans.append(loan)
    RecordIdentifier.insert(len(loans))

    return loans


def _mint_record_pid(pid_type, pid_field, record):
    """Mint the given PID for the given record."""
    PersistentIdentifier.create(
        pid_type=pid_type,
        pid_value=record[pid_field],
        object_type="rec",
        object_uuid=record.id,
        status=PIDStatus.REGISTERED,
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
    internal_location[Location.pid_field] = loc_pid
    record = InternalLocation.create(internal_location)
    _mint_record_pid(
        INTERNAL_LOCATION_PID_TYPE, InternalLocation.pid_field, record
    )
    record.commit()
    return record


def create_keyword_record(keyword):
    """Create Keyword record."""
    record = Keyword.create(keyword)
    _mint_record_pid(
        KEYWORD_PID_TYPE, Keyword.pid_field, record
    )
    record.commit()
    return record


def create_doc_record(document):
    """Create Document record."""
    record = Document.create(document)
    _mint_record_pid(DOCUMENT_PID_TYPE, Document.pid_field, record)
    record.commit()
    return record


def create_item_record(item, iloc_pid):
    """Create Item record."""
    item[InternalLocation.pid_field] = iloc_pid
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
@click.option("--docs", "n_docs", default=20)
@click.option("--items", "n_items", default=50)
@click.option("--loans", "n_loans", default=100)
@click.option("--keywords", "n_keywords", default=10)
@with_appcontext
def data(n_docs, n_items, n_loans, n_keywords):
    """Insert demo data."""
    indexer = RecordIndexer()

    rec_location = create_loc_record()
    db.session.commit()
    indexer.index(rec_location)

    rec_int_locs = []
    with click.progressbar(
        get_internal_locations(rec_location), label="Internal Locations"
    ) as ilocs:
        for iloc in ilocs:
            rec = create_iloc_record(iloc, rec_location[Location.pid_field])
            rec_int_locs.append(rec)

    rec_keywords = []
    random_keywords = get_keywords(n_keywords)
    with click.progressbar(random_keywords, label="Keywords") as keywords:
        for keyword in keywords:
            rec = create_keyword_record(keyword)
            rec_keywords.append(rec)
    indexer.bulk_index([str(r.id) for r in rec_keywords])
    click.echo(
        'Sent to the indexing queue {0} keywords'.format(len(rec_keywords)))

    documents, items = get_documents_items(
        rec_int_locs, n_docs=n_docs, n_items=n_items
    )
    rec_docs = []
    with click.progressbar(documents, label="Documents") as docs:
        for doc in docs:
            rec = create_doc_record(doc)
            for keyword in sample(rec_keywords, randint(1, n_keywords-1)):
                rec.add_keyword(keyword)
            rec.commit()
            rec_docs.append(rec)

    rec_items = []
    with click.progressbar(items, label="Items") as _items:
        for item in _items:
            iloc = rec_int_locs[randint(0, len(rec_int_locs) - 1)]
            rec = create_item_record(item, iloc[InternalLocation.pid_field])
            rec_items.append(rec)

    db.session.commit()

    loans = get_loans_for_items(
        rec_items,
        rec_location,
        patron_ids=["1", "2"],
        librarian_id="4",
        n_loans=n_loans,
    )
    rec_loans = []
    with click.progressbar(loans, label="Loans") as _loans:
        for _loan in _loans:
            rec = create_loan_record(_loan)
            rec_loans.append(rec)

    db.session.commit()

    # index locations
    indexer.bulk_index([str(r.id) for r in rec_int_locs])
    click.echo('Sent to the indexing queue {0} locations'.format(len(
                                                                rec_int_locs)))

    # index loans
    indexer.bulk_index([str(r.id) for r in rec_loans])
    click.echo('Sent to the indexing queue {0} loans'.format(len(rec_loans)))

    click.secho('Now indexing...', fg='green')
    # process queue so items can resolve circulation status correctly
    indexer.process_bulk_queue()

    # index items
    indexer.bulk_index([str(r.id) for r in rec_items])
    click.echo('Sent to the indexing queue {0} items'.format(len(rec_items)))

    click.secho('Now indexing...', fg='green')
    # process queue so documents can resolve circulation correctly
    indexer.process_bulk_queue()

    # flush all indices after indexing, otherwise ES won't be ready for tests
    current_search.flush_and_refresh(index=None)

    # index documents
    indexer.bulk_index([str(r.id) for r in rec_docs])
    click.echo('Sent to the indexing queue {0} documents'.format(len(
                                                                    rec_docs)))

    click.secho('Now indexing...', fg='green')
    indexer.process_bulk_queue()
