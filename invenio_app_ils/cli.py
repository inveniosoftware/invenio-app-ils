# -*- coding: utf-8 -*-
#
# Copyright (C) 2018-2019 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""CLI for Invenio App ILS."""
import random
from datetime import datetime, timedelta
from functools import partial
from random import randint

import click
import lorem
from flask.cli import with_appcontext
from invenio_accounts.models import User
from invenio_circulation.api import Loan
from invenio_circulation.pidstore.pids import CIRCULATION_LOAN_PID_TYPE
from invenio_db import db
from invenio_indexer.api import RecordIndexer
from invenio_pidstore.models import PersistentIdentifier, PIDStatus
from invenio_search import current_search

from .indexer import PatronsIndexer
from .records.api import Document, EItem, InternalLocation, Item, Keyword, \
    Location, Patron

from .pidstore.pids import (  # isort:skip
    DOCUMENT_PID_TYPE,
    ITEM_PID_TYPE,
    EITEM_PID_TYPE,
    LOCATION_PID_TYPE,
    INTERNAL_LOCATION_PID_TYPE,
    KEYWORD_PID_TYPE,
    PATRON_PID_TYPE
)


def minter(pid_type, pid_field, record):
    """Mint the given PID for the given record."""
    PersistentIdentifier.create(
        pid_type=pid_type,
        pid_value=record[pid_field],
        object_type="rec",
        object_uuid=record.id,
        status=PIDStatus.REGISTERED,
    )


class Holder():
    """Hold generated data."""

    def __init__(self,
                 patrons_pids,
                 librarian_pid,
                 total_intloc,
                 total_keywords,
                 total_items,
                 total_eitems,
                 total_documents,
                 total_loans):
        """Constructor."""
        self.patrons_pids = patrons_pids
        self.librarian_pid = librarian_pid

        self.location = {}
        self.internal_locations = {
            'objs': [],
            'total': total_intloc
        }
        self.keywords = {
            'objs': [],
            'total': total_keywords
        }
        self.items = {
            'objs': [],
            'total': total_items
        }
        self.eitems = {
            'objs': [],
            'total': total_eitems
        }
        self.documents = {
            'objs': [],
            'total': total_documents
        }
        self.loans = {
            'objs': [],
            'total': total_loans
        }


class Generator():
    """Generator."""

    def __init__(self, holder, minter):
        """Constructor."""
        self.holder = holder
        self.minter = minter

    def _persist(self, pid_type, pid_field, record):
        """Mint PID and store in the db."""
        minter(pid_type, pid_field, record)
        record.commit()
        return record


class LocationGenerator(Generator):
    """Location Generator."""

    def generate(self):
        """Generate."""
        self.holder.location = {
            Location.pid_field: "1",
            "name": "Central Library",
            "address": "Rue de Meyrin",
            "email": "library@cern.ch",
        }

    def persist(self):
        """Persist."""
        record = Location.create(self.holder.location)
        return self._persist(LOCATION_PID_TYPE, Location.pid_field, record)


class InternalLocationGenerator(Generator):
    """InternalLocation Generator."""

    def generate(self):
        """Generate."""
        size = self.holder.internal_locations['total']
        location_pid_value = self.holder.location[Location.pid_field]
        objs = [{
            InternalLocation.pid_field: "{}".format(i),
            "legacy_id": "{}".format(randint(100000, 999999)),
            "name": "Building {}".format(randint(1, 10)),
            "notes": lorem.sentence(),
            "physical_location": lorem.sentence(),
            Location.pid_field: location_pid_value
        } for i in range(1, size)]

        self.holder.internal_locations['objs'] = objs

    def persist(self):
        """Persist."""
        recs = []
        for obj in self.holder.internal_locations['objs']:
            rec = self._persist(
                INTERNAL_LOCATION_PID_TYPE,
                InternalLocation.pid_field,
                InternalLocation.create(obj)
            )
            recs.append(rec)
        db.session.commit()
        return recs


class KeywordGenerator(Generator):
    """Keyword Generator."""

    def generate(self):
        """Generate."""
        size = self.holder.keywords['total']
        objs = [{
            Keyword.pid_field: "{}".format(i),
            "name": lorem.sentence().split()[0],
        } for i in range(1, size)]

        self.holder.keywords['objs'] = objs

    def persist(self):
        """Persist."""
        recs = []
        for obj in self.holder.keywords['objs']:
            rec = self._persist(
                KEYWORD_PID_TYPE,
                Keyword.pid_field,
                Keyword.create(obj)
            )
            recs.append(rec)
        db.session.commit()
        return recs


class ItemGenerator(Generator):
    """Item Generator."""

    ITEM_CIRCULATION_RESTRICTIONS = ["NO_RESTRICTION", "FOR_REFERENCE_ONLY"]
    ITEM_MEDIUMS = ["NOT_SPECIFIED", "ONLINE", "PAPER", "CDROM", "DVD", "VHS"]
    ITEM_STATUSES = ["CAN_CIRCULATE", "MISSING", "IN_BINDING"]

    def generate(self):
        """Generate."""
        size = self.holder.items['total']
        total_intlocs = self.holder.internal_locations['total']
        total_docs = self.holder.documents['total']
        objs = [{
            Document.pid_field: "{}".format(randint(1, total_docs-1)),
            Item.pid_field: "{}".format(i),
            InternalLocation.pid_field: "{}".format(randint(1, total_intlocs-1)),
            "legacy_id": "{}".format(randint(100000, 999999)),
            "legacy_library_id": "{}".format(randint(5, 50)),
            "barcode": "{}".format(randint(10000000, 99999999)),
            "shelf": "{}".format(lorem.sentence()),
            "description": "{}".format(lorem.text()),
            "_internal_notes": "{}".format(lorem.text()),
            "medium": "{}".format(self.ITEM_MEDIUMS[randint(0, 5)]),
            "status": "{}".format(self.ITEM_STATUSES[randint(0, 2)]),
            "circulation_restriction": "{}".format(self.ITEM_CIRCULATION_RESTRICTIONS[randint(0, 1)])
        } for i in range(1, size)]

        self.holder.items['objs'] = objs

    def persist(self):
        """Persist."""
        recs = []
        for obj in self.holder.items['objs']:
            rec = self._persist(
                ITEM_PID_TYPE,
                Item.pid_field,
                Item.create(obj)
            )
            recs.append(rec)
        db.session.commit()
        return recs


class EItemGenerator(Generator):
    """EItem Generator."""

    def generate(self):
        """Generate."""
        size = self.holder.eitems['total']
        total_docs = self.holder.documents['total']

        objs = [{
            Document.pid_field: "{}".format(randint(1, total_docs-1)),
            EItem.pid_field: "{}".format(i),
            "description": "{}".format(lorem.text()),
            "_internal_notes": "{}".format(lorem.text()),
        } for i in range(1, size)]

        self.holder.eitems['objs'] = objs

    def persist(self):
        """Persist."""
        recs = []
        for obj in self.holder.eitems['objs']:
            rec = self._persist(
                EITEM_PID_TYPE,
                EItem.pid_field,
                EItem.create(obj)
            )
            recs.append(rec)
        db.session.commit()
        return recs


class DocumentGenerator(Generator):
    """Document Generator."""

    DOCUMENT_TYPES = ["BOOK", "STANDARD", "PROCEEDINGS"]
    LANGUAGES = ["en", "fr", "it", "el", "pl", "ro", "sv", "es"]

    def generate(self):
        """Generate."""
        size = self.holder.documents['total']
        total_keywords = self.holder.keywords['total']

        objs = [{
            Document.pid_field: "{}".format(i),
            "title": "{}".format(lorem.sentence()),
            "authors": ["{}".format(lorem.sentence())],
            "abstracts": ["{}".format(lorem.text())],
            "document_types": [random.choice(self.DOCUMENT_TYPES)],
            "languages":list(set([random.choice(self.LANGUAGES)
                                  for _ in
                                  range(0, randint(1, len(self.LANGUAGES)))])),

            "publishers": ["{}".format(lorem.sentence())],
            "files": ["https://cds.cern.ch/record/2255762/"
                      "files/CERN-Brochure-2017-002-Eng.pdf",
                      "https://cds.cern.ch/record/2256277/"
                      "files/CERN-Brochure-2016-005-Eng.pdf"],
            "booklinks": ["https://home.cern/science/physics/dark-matter",
                          "https://home.cern/science/physics/antimatter"],
            "chapters": ["{}".format(lorem.sentence())],
            "information": "{}".format(lorem.text()),
            "keyword_pids": [str(randint(1, total_keywords-1)) for i in range(0, 5)],
        } for i in range(1, size)]

        self.holder.documents['objs'] = objs

    def persist(self):
        """Persist."""
        recs = []
        for obj in self.holder.documents['objs']:
            rec = self._persist(
                DOCUMENT_PID_TYPE,
                Document.pid_field,
                Document.create(obj)
            )
            recs.append(rec)
        db.session.commit()
        return recs


class LoanGenerator(Generator):
    """Loan Generator."""

    LOAN_STATUSES = ["PENDING", "ITEM_ON_LOAN", "ITEM_RETURNED", "CANCELLED"]

    def _get_item_can_circulate(self, items):
        """Return an item that can circulate."""
        item = items[randint(1, len(items)-1)]
        if item["status"] != "CAN_CIRCULATE":
            return self._get_item_can_circulate(items)
        return item

    def _get_valid_status(self, item, items_on_loans):
        """Return valid loan status for the item to avoid inconsistencies."""
        # cannot have 2 loans in the same item
        if item[Item.pid_field] in items_on_loans:
            status = self.LOAN_STATUSES[0]
        else:
            status = self.LOAN_STATUSES[randint(0, 3)]
        return status

    def generate(self):
        """Generate."""
        size = self.holder.loans['total']
        loc_pid = self.holder.location[Location.pid_field]
        total_docs = self.holder.documents['total']
        items = self.holder.items['objs']
        patrons_pids = self.holder.patrons_pids
        librarian_pid = self.holder.librarian_pid

        current_year = datetime.now().year
        items_on_loans = []
        for i in range(1, size):
            item = self._get_item_can_circulate(items)
            status = self._get_valid_status(item, items_on_loans)
            patron_id = randint(1, len(patrons_pids)-1)
            transaction_date = datetime(
                current_year, randint(1, 12), randint(1, 28)
            )
            expire_date = transaction_date + timedelta(days=10)
            start_date = transaction_date + timedelta(days=3)
            end_date = transaction_date + timedelta(days=13)

            loan = {
                Document.pid_field: "{}".format(randint(1, total_docs-1)),
                Loan.pid_field: "{}".format(i),
                "patron_pid": "{}".format(patron_id),
                "pickup_location_pid": "{}".format(loc_pid),
                "request_expire_date": expire_date.strftime("%Y-%m-%d"),
                "state": "{}".format(status),
                "start_date": start_date.strftime("%Y-%m-%d"),
                "end_date": end_date.strftime("%Y-%m-%d"),
                "transaction_date": transaction_date.strftime("%Y-%m-%d"),
                "transaction_location_pid": "{}".format(loc_pid),
                "transaction_user_pid": "{}".format(librarian_pid),
            }

            if status == "PENDING":
                loan[Item.pid_field] = ""
            else:
                loan[Item.pid_field] = "{}".format(item[Item.pid_field])
                items_on_loans.append(item[Item.pid_field])

            self.holder.loans['objs'].append(loan)

    def persist(self):
        """Persist."""
        recs = []
        for obj in self.holder.loans['objs']:
            rec = self._persist(
                CIRCULATION_LOAN_PID_TYPE,
                Loan.pid_field,
                Loan.create(obj)
            )
            recs.append(rec)
        db.session.commit()
        return recs


@click.group()
def demo():
    """Demo data CLI."""


@demo.command()
@click.option("--docs", "n_docs", default=20)
@click.option("--items", "n_items", default=50)
@click.option("--eitems", "n_eitems", default=30)
@click.option("--loans", "n_loans", default=100)
@click.option("--keywords", "n_keywords", default=40)
@click.option("--internal-locations", "n_intlocs", default=10)
@with_appcontext
def data(n_docs, n_items, n_eitems, n_loans, n_keywords, n_intlocs):
    """Insert demo data."""
    click.secho('Generating demo data', fg='yellow')

    indexer = RecordIndexer()

    holder = Holder(
        patrons_pids=["1", "2"],
        librarian_pid="4",
        total_intloc=n_intlocs,
        total_keywords=n_keywords,
        total_items=n_items,
        total_eitems=n_eitems,
        total_documents=n_docs,
        total_loans=n_loans
    )

    click.echo('Creating locations...')
    loc_generator = LocationGenerator(holder, minter)
    loc_generator.generate()
    rec = loc_generator.persist()
    indexer.index(rec)

    # InternalLocations
    intlocs_generator = InternalLocationGenerator(holder, minter)
    intlocs_generator.generate()
    rec_intlocs = intlocs_generator.persist()

    # Keywords
    click.echo('Creating keywords...')
    keywords_generator = KeywordGenerator(holder, minter)
    keywords_generator.generate()
    rec_keywords = keywords_generator.persist()

    # Items
    click.echo('Creating items...')
    items_generator = ItemGenerator(holder, minter)
    items_generator.generate()
    rec_items = items_generator.persist()

    # EItems
    click.echo('Creating eitems...')
    eitems_generator = EItemGenerator(holder, minter)
    eitems_generator.generate()
    rec_eitems = eitems_generator.persist()

    # Documents
    click.echo('Creating documents...')
    documents_generator = DocumentGenerator(holder, minter)
    documents_generator.generate()
    rec_docs = documents_generator.persist()

    # Loans
    click.echo('Creating loans...')
    loans_generator = LoanGenerator(holder, minter)
    loans_generator.generate()
    rec_loans = loans_generator.persist()

    # index locations
    indexer.bulk_index([str(r.id) for r in rec_intlocs])
    click.echo('Sent to the indexing queue {0} locations'.format(
        len(rec_intlocs)))

    # index keywords
    indexer.bulk_index([str(r.id) for r in rec_keywords])
    click.echo('Sent to the indexing queue {0} keywords'.format(
        len(rec_keywords)))

    # index loans
    indexer.bulk_index([str(r.id) for r in rec_loans])
    click.echo('Sent to the indexing queue {0} loans'.format(len(rec_loans)))

    click.secho('Now indexing...', fg='green')
    # process queue so items can resolve circulation status correctly
    indexer.process_bulk_queue()

    # index eitems
    indexer.bulk_index([str(r.id) for r in rec_eitems])
    click.echo('Sent to the indexing queue {0} eitems'.format(len(rec_eitems)))

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
    click.echo('Sent to the indexing queue {0} documents'.format(
        len(rec_docs)))

    click.secho('Now indexing...', fg='green')
    indexer.process_bulk_queue()


@click.group()
def patrons():
    """Patrons data CLI."""


@patrons.command()
@with_appcontext
def index():
    """Index patrons."""
    patrons = User.query.all()
    indexer = PatronsIndexer()

    click.secho('Now indexing {0} patrons'.format(len(patrons)),  fg='green')

    for pat in patrons:
        patron = Patron(pat.id)
        indexer.index(patron)
