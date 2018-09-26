import click
from flask.cli import with_appcontext

from invenio_circulation.api import Loan
from invenio_circulation.pid.minters import loan_pid_minter
from invenio_db import db
from invenio_indexer.api import RecordIndexer
from invenio_pidstore.models import PersistentIdentifier
from invenio_records.api import Record

from invenio_app_ils.api import Document, Item, Location
from invenio_app_ils.pid.minters import (
    document_pid_minter,
    item_pid_minter,
    location_pid_minter,
)


LOCATIONS = [
    {
        # PID 1
        "name": "CERN Library"
    }
]

BOOKS = [
    {
        # PID 2
        "title": "The Gulf: The Making of An American Sea",
        "authors": "Jack E. Davis",
        "abstracts": ["This is an abstract"],
        "items": ["7", "8"],
    },
    {
        # PID 3
        "title": "Prairie Fires: The American Dreams of Laura Ingalls Wilder",
        "authors": "Caroline Fraser",
        "abstracts": ["This is an abstract"],
        "items": ["9", "10"],
    },
    {
        # PID 4
        "title": "Half-light: Collected Poems 1965-2016",
        "authors": "Frank Bidart",
        "abstracts": ["This is an abstract"],
        "items": ["11", "12"],
    },
    {
        # PID 5
        "title": "Locking Up Our Own: Crime and Punishment in Black America",
        "authors": "James Forman Jr.",
        "abstracts": ["This is an abstract"],
        "items": ["13", "14"],
    },
    {
        # PID 6
        "title": "Less: A Novel",
        "authors": "Andrew Sean Greer",
        "abstracts": ["This is an abstract"],
        "items": ["15", "16"],
    },
]

ITEMS = [
    {
        # PID 7
        "title": "The Gulf: The Making of An American Sea - Item 1",
        "document_pid": "2",
        "location_pid": "1",
        "status": "MISSING",
    },
    {
        # PID 8
        "title": "The Gulf: The Making of An American Sea - Item 2",
        "document_pid": "2",
        "location_pid": "1",
        "status": "LOANABLE",
    },
    {
        # PID 9
        "title": "Prairie Fires: The American Dreams of Laura Ingalls Wilder",
        "document_pid": "4",
        "location_pid": "1",
    },
    {
        # PID 10
        "title": "Half-light: Collected Poems 1965-2016",
        "document_pid": "4",
        "location_pid": "1",
        "status": "LOANABLE",
    },
    {
        # PID 11
        "title": "Half-light: Collected Poems 1965-2016",
        "document_pid": "4",
        "location_pid": "1",
        "status": "LOANABLE",
    },
    {
        # PID 12
        "title": "Half-light: Collected Poems 1965-2016",
        "document_pid": "4",
        "location_pid": "1",
        "status": "LOANABLE",
    },
    {
        # PID 13
        "title": "Less: A Novel",
        "document_pid": "6",
        "location_pid": "1",
        "status": "ON_BINDING",
    },
    {
        # PID 14
        "title": "Less: A Novel",
        "document_pid": "6",
        "location_pid": "1",
        "status": "MISSING",
    },
    {
        # PID 15
        "title": "Less: A Novel",
        "document_pid": "6",
        "location_pid": "1",
        "status": "LOANABLE",
    },
    {
        # PID 16
        "title": "Less: A Novel",
        "document_pid": "6",
        "location_pid": "1",
        "status": "LOANABLE",
    },
]

LOANS = [
    {
        "item_pid": "7",
        "patron_pid": "3",
        "state": "PENDING",
        "transaction_date": "2018-06-29",
        "transaction_location_pid": "loc_pid",
        "transaction_user_pid": "user_pid",
        "pickup_location_pid": "pickup_location_pid",
        "request_expire_date": "2018-07-28",
    },
    {
        "item_pid": "7",
        "patron_pid": "2",
        "state": "PENDING",
        "transaction_date": "2018-06-29",
        "transaction_location_pid": "loc_pid",
        "transaction_user_pid": "user_pid",
        "pickup_location_pid": "pickup_location_pid",
        "request_expire_date": "2018-07-28",
    },
    {
        "item_pid": "7",
        "patron_pid": "1",
        "state": "PENDING",
        "transaction_date": "2018-06-29",
        "transaction_location_pid": "loc_pid",
        "transaction_user_pid": "user_pid",
        "pickup_location_pid": "pickup_location_pid",
        "request_expire_date": "2018-07-28",
    },
    {
        "item_pid": "7",
        "patron_pid": "3",
        "state": "PENDING",
        "transaction_date": "2018-06-29",
        "transaction_location_pid": "loc_pid",
        "transaction_user_pid": "user_pid",
        "pickup_location_pid": "pickup_location_pid",
        "request_expire_date": "2018-07-28",
    },
]


@click.group()
def demo():
    """."""


@demo.command()
@with_appcontext
def data():
    """."""
    indexer = RecordIndexer()
    for location in LOCATIONS:
        record = Location.create(location)
        location_pid_minter(record.id, record).pid_value
        record.commit()
        db.session.commit()
        indexer.index(record)

    for book in BOOKS:
        record = Document.create(book)
        document_pid_minter(record.id, record)
        record.commit()
        db.session.commit()
        indexer.index(record)

    for item in ITEMS:
        record = Item.create(item)
        item_pid_minter(record.id, record)
        record.commit()
        db.session.commit()
        indexer.index(record)

    for loan in LOANS:
        record = Loan.create(loan)
        loan_pid_minter(record.id, record)
        record.commit()
        db.session.commit()
        indexer.index(record)
