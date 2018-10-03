import click
from flask.cli import with_appcontext

from invenio_circulation.api import Loan
from invenio_db import db
from invenio_indexer.api import RecordIndexer
from invenio_pidstore.models import PersistentIdentifier, PIDStatus
from invenio_records.api import Record

from invenio_app_ils.api import Document, Item, Location


LOCATIONS = [
    {
        "locid": "locid-1",
        "name": "CERN Library"
    }
]

DOCUMENTS = [
    {
        "docid": "docid-1",
        "title": "The Gulf: The Making of An American Sea",
        "authors": "Jack E. Davis",
        "abstracts": ["This is an abstract"],
        "items": ["itemid-1", "itemid-2"],
    },
    {
        "docid": "docid-2",
        "title": "Prairie Fires: The American Dreams of Laura Ingalls Wilder",
        "authors": "Caroline Fraser",
        "abstracts": ["This is an abstract"],
        "items": ["itemid-3"],
    },
    {
        "docid": "docid-3",
        "title": "Half-light: Collected Poems 1965-2016",
        "authors": "Frank Bidart",
        "abstracts": ["This is an abstract"],
        "items": ["itemid-4", "itemid-5", "itemid-6"],
    },
    {
        "docid": "docid-4",
        "title": "Locking Up Our Own: Crime and Punishment in Black America",
        "authors": "James Forman Jr.",
        "abstracts": ["This is an abstract"],
        "items": [],
    },
    {
        "docid": "docid-5",
        "title": "Less: A Novel",
        "authors": "Andrew Sean Greer",
        "abstracts": ["This is an abstract"],
        "items": ["itemid-7", "itemid-8", "itemid-9", "itemid-10"],
    },
]

ITEMS = [
    {
        "itemid": "itemid-1",
        "title": "The Gulf: The Making of An American Sea - Item 1",
        "document_pid": "docid-1",
        "location_pid": "locid-1",
        "status": "MISSING",
    },
    {
        "itemid": "itemid-2",
        "title": "The Gulf: The Making of An American Sea - Item 2",
        "document_pid": "docid-1",
        "location_pid": "locid-1",
        "status": "LOANABLE",
    },
    {
        "itemid": "itemid-3",
        "title": "Prairie Fires: The American Dreams of Laura Ingalls Wilder",
        "document_pid": "docid-2",
        "location_pid": "locid-1",
    },
    {
        "itemid": "itemid-4",
        "title": "Half-light: Collected Poems 1965-2016",
        "document_pid": "docid-3",
        "location_pid": "locid-1",
        "status": "LOANABLE",
    },
    {
        "itemid": "itemid-5",
        "title": "Half-light: Collected Poems 1965-2016",
        "document_pid": "docid-3",
        "location_pid": "locid-1",
        "status": "LOANABLE",
    },
    {
        "itemid": "itemid-6",
        "title": "Half-light: Collected Poems 1965-2016",
        "document_pid": "docid-3",
        "location_pid": "locid-1",
        "status": "LOANABLE",
    },
    {
        "itemid": "itemid-7",
        "title": "Less: A Novel",
        "document_pid": "docid-5",
        "location_pid": "locid-1",
        "status": "ON_BINDING",
    },
    {
        "itemid": "itemid-8",
        "title": "Less: A Novel",
        "document_pid": "docid-5",
        "location_pid": "locid-1",
        "status": "MISSING",
    },
    {
        "itemid": "itemid-9",
        "title": "Less: A Novel",
        "document_pid": "docid-5",
        "location_pid": "locid-1",
        "status": "LOANABLE",
    },
    {
        "itemid": "itemid-10",
        "title": "Less: A Novel",
        "document_pid": "docid-5",
        "location_pid": "locid-1",
        "status": "LOANABLE",
    },
]

LOANS = [
    {
        "loanid": "loanid-1",
        "item_pid": "itemid-1",
        "patron_pid": "1",
        "state": "PENDING",
        "transaction_date": "2018-06-29",
        "transaction_location_pid": "loc_pid",
        "transaction_user_pid": "user_pid",
        "pickup_location_pid": "pickup_location_pid",
        "request_expire_date": "2018-07-28",
    },
    {
        "loanid": "loanid-2",
        "item_pid": "itemid-2",
        "patron_pid": "1",
        "state": "PENDING",
        "transaction_date": "2018-06-29",
        "transaction_location_pid": "loc_pid",
        "transaction_user_pid": "user_pid",
        "pickup_location_pid": "pickup_location_pid",
        "request_expire_date": "2018-07-28",
    },
    {
        "loanid": "loanid-3",
        "item_pid": "itemid-5",
        "patron_pid": "2",
        "state": "PENDING",
        "transaction_date": "2018-06-29",
        "transaction_location_pid": "loc_pid",
        "transaction_user_pid": "user_pid",
        "pickup_location_pid": "pickup_location_pid",
        "request_expire_date": "2018-07-28",
    },
    {
        "loanid": "loanid-4",
        "item_pid": "itemid-7",
        "patron_pid": "2",
        "state": "PENDING",
        "transaction_date": "2018-06-29",
        "transaction_location_pid": "loc_pid",
        "transaction_user_pid": "user_pid",
        "pickup_location_pid": "pickup_location_pid",
        "request_expire_date": "2018-07-28",
    },
]


def _mint_record_pid(pid_type, record):
    """Mint the given PID for the given record."""
    PersistentIdentifier.create(
        pid_type=pid_type,
        pid_value=record[pid_type],
        object_type='rec',
        object_uuid=record.id,
        status=PIDStatus.REGISTERED
    )
    db.session.commit()


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
        _mint_record_pid('locid', record)
        record.commit()
        db.session.commit()
        indexer.index(record)

    for document in DOCUMENTS:
        record = Document.create(document)
        _mint_record_pid('docid', record)
        record.commit()
        db.session.commit()
        indexer.index(record)

    for item in ITEMS:
        record = Item.create(item)
        _mint_record_pid('itemid', record)
        record.commit()
        db.session.commit()
        indexer.index(record)

    for loan in LOANS:
        record = Loan.create(loan)
        _mint_record_pid('loanid', record)
        record.commit()
        db.session.commit()
        indexer.index(record)
