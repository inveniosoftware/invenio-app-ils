# -*- coding: utf-8 -*-
#
# Copyright (C) 2018-2019 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""CLI for Invenio App ILS."""
import random
from datetime import datetime, timedelta
from random import randint

import click
import lorem
from flask.cli import with_appcontext
from invenio_accounts.models import User
from invenio_circulation.api import Loan
from invenio_circulation.pidstore.pids import CIRCULATION_LOAN_PID_TYPE
from invenio_db import db
from invenio_indexer.api import RecordIndexer
from invenio_pidstore.models import PersistentIdentifier, PIDStatus, \
    RecordIdentifier
from invenio_search import current_search

from .errors import RelatedRecordError
from .indexer import PatronsIndexer
from .records.api import Document, EItem, InternalLocation, Item, Keyword, \
    Location, Patron, Series

from .pidstore.pids import (  # isort:skip
    DOCUMENT_PID_TYPE,
    ITEM_PID_TYPE,
    EITEM_PID_TYPE,
    LOCATION_PID_TYPE,
    INTERNAL_LOCATION_PID_TYPE,
    KEYWORD_PID_TYPE,
    SERIES_PID_TYPE,
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
    RecordIdentifier.next()


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
                 total_loans,
                 total_series):
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
        self.series = {
            'objs': [],
            'total': total_series
        }
        self.related_records = {
            'objs': [],
            'total': 0,
        }

    def pids(self, collection, pid_field):
        """Get a list of PIDs for a collection."""
        return [obj[pid_field] for obj in getattr(self, collection)['objs']]


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
            InternalLocation.pid_field: str(pid),
            "legacy_id": "{}".format(randint(100000, 999999)),
            "name": "Building {}".format(randint(1, 10)),
            "notes": lorem.sentence(),
            "physical_location": lorem.sentence(),
            Location.pid_field: location_pid_value
        } for pid in range(1, size+1)]

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
            Keyword.pid_field: str(pid),
            "name": lorem.sentence().split()[0],
            "provenance": lorem.sentence(),
        } for pid in range(1, size+1)]

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
        iloc_pids = self.holder.pids('internal_locations', InternalLocation.pid_field)
        doc_pids = self.holder.pids('documents', Document.pid_field)
        objs = [{
            Item.pid_field: str(pid),
            Document.pid_field: random.choice(doc_pids),
            InternalLocation.pid_field: random.choice(iloc_pids),
            "legacy_id": "{}".format(randint(100000, 999999)),
            "legacy_library_id": "{}".format(randint(5, 50)),
            "barcode": "{}".format(randint(10000000, 99999999)),
            "shelf": "{}".format(lorem.sentence()),
            "description": "{}".format(lorem.text()),
            "_internal_notes": "{}".format(lorem.text()),
            "medium": random.choice(self.ITEM_MEDIUMS),
            "status": random.choice(self.ITEM_STATUSES),
            "circulation_restriction": random.choice(self.ITEM_CIRCULATION_RESTRICTIONS),
        } for pid in range(1, size+1)]

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
        doc_pids = self.holder.pids('documents', Document.pid_field)

        objs = [{
            EItem.pid_field: str(pid),
            Document.pid_field: random.choice(doc_pids),
            "description": "{}".format(lorem.text()),
            "internal_notes": "{}".format(lorem.text()),
            "urls": ["https://home.cern/science/physics/dark-matter",
                     "https://home.cern/science/physics/antimatter"],
            "open_access": bool(random.getrandbits(1))
        } for pid in range(1, size+1)]

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
        keyword_pids = self.holder.pids('keywords', Keyword.pid_field)
        series_objs = self.holder.series['objs']
        serial_pids = [series[Series.pid_field] for series in series_objs if series['mode_of_issuance'] == 'SERIAL']
        multipart_pids = [series[Series.pid_field] for series in series_objs if series['mode_of_issuance'] == 'MULTIPART_MONOGRAPH']

        def random_series():
            data = []
            if multipart_pids:
                for pid in random.sample(multipart_pids, randint(0, len(multipart_pids) - 1)):
                    data.append(dict(
                        pid=pid,
                        volume=str(randint(1, 100))
                    ))
            if serial_pids:
                for pid in random.sample(serial_pids, randint(0, len(serial_pids) - 1)):
                    data.append(dict(
                        pid=pid,
                        volume=str(randint(1, 100))
                    ))
            return data

        objs = [{
            Document.pid_field: str(pid),
            "title": "{}".format(lorem.sentence()),
            "authors": ["{}".format(lorem.sentence())],
            "abstracts": ["{}".format(lorem.text())],
            "document_types": [random.choice(self.DOCUMENT_TYPES)],
            "_access": {},
            "languages": random.sample(self.LANGUAGES, randint(1, len(self.LANGUAGES))),
            "publishers": ["{}".format(lorem.sentence())],
            "files": ["https://cds.cern.ch/record/2255762/"
                      "files/CERN-Brochure-2017-002-Eng.pdf",
                      "https://cds.cern.ch/record/2256277/"
                      "files/CERN-Brochure-2016-005-Eng.pdf"],
            "booklinks": ["https://home.cern/science/physics/dark-matter",
                          "https://home.cern/science/physics/antimatter"],
            "chapters": ["{}".format(lorem.sentence())],
            "information": "{}".format(lorem.text()),
            "keyword_pids": random.sample(keyword_pids, randint(0, 5)),
            "series_objs": random_series(),
        } for pid in range(1, size+1)]

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
        item = items[randint(1, len(items) - 1)]
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
        items = self.holder.items['objs']
        patrons_pids = self.holder.patrons_pids
        librarian_pid = self.holder.librarian_pid
        doc_pids = self.holder.pids('documents', Document.pid_field)

        current_year = datetime.now().year
        items_on_loans = []
        for pid in range(1, size+1):
            item = self._get_item_can_circulate(items)
            status = self._get_valid_status(item, items_on_loans)
            patron_id = random.choice(patrons_pids)
            transaction_date = datetime(
                current_year, randint(1, 12), randint(1, 28)
            )
            expire_date = transaction_date + timedelta(days=10)
            start_date = transaction_date + timedelta(days=3)
            end_date = transaction_date + timedelta(days=13)

            loan = {
                Loan.pid_field: str(pid),
                Document.pid_field: random.choice(doc_pids),
                "extension_count": randint(0, 3),
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


class SeriesGenerator(Generator):
    """Series Generator."""

    DOCUMENT_TYPES = ["BOOK", "STANDARD", "PROCEEDINGS"]
    LANGUAGES = ["en", "fr", "it", "el", "pl", "ro", "sv", "es"]
    MODE_OF_ISSUANCE = ["MULTIPART_MONOGRAPH", "SERIAL"]

    def random_issn(self):
        """Generate a random ISSN."""
        random_4digit = [randint(1000, 9999), randint(1000, 9999)]
        return '-'.join(str(r) for r in random_4digit)

    def generate(self):
        """Generate."""
        size = self.holder.series['total']
        keyword_pids = self.holder.pids('keywords', Keyword.pid_field)

        objs = [{
            Series.pid_field: str(pid),
            "mode_of_issuance": random.choice(self.MODE_OF_ISSUANCE),
            "issn": self.random_issn(),
            "title": {"title": "{}".format(lorem.sentence())},
            "authors": ["{}".format(lorem.sentence())],
            "abstracts": ["{}".format(lorem.text())],
            "languages": random.sample(self.LANGUAGES, randint(1, len(self.LANGUAGES))),
            "publishers": ["{}".format(lorem.sentence())],
        } for pid in range(1, size+1)]

        self.holder.series['objs'] = objs

    def persist(self):
        """Persist."""
        recs = []
        for obj in self.holder.series['objs']:
            rec = self._persist(
                SERIES_PID_TYPE,
                Series.pid_field,
                Series.create(obj)
            )
            recs.append(rec)
        db.session.commit()
        return recs


class RelatedRecordsGenerator(Generator):
    """Related records generator."""

    def generate(self, rec_docs, rec_series):
        """Generate related records."""
        language_parents = random.sample(rec_docs, randint(2, 4))
        objs = [language_parents[0]]
        for record in language_parents[1:]:
            language_parents[0].related.add_language(record)
            objs.append(record)

        editions = rec_docs + rec_series
        for parent in language_parents:
            num_editions = randint(0, 3)
            while num_editions:
                try:
                    edition = editions.pop()
                    parent.related.add_edition(edition)
                    objs.append(edition)
                    num_editions -= 1
                except RelatedRecordError:
                    pass
        self.holder.related_records['objs'] = objs

    def persist(self):
        """Persist."""
        for record in self.holder.related_records['objs']:
            record.commit()
        db.session.commit()
        return self.holder.related_records['objs']


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
@click.option("--series", "n_series", default=10)
@with_appcontext
def data(n_docs, n_items, n_eitems, n_loans, n_keywords, n_intlocs, n_series):
    """Insert demo data."""
    click.secho('Generating demo data', fg='yellow')

    indexer = RecordIndexer()

    holder = Holder(
        patrons_pids=["1", "2", "5", "6"],
        librarian_pid="4",
        total_intloc=n_intlocs,
        total_keywords=n_keywords,
        total_items=n_items,
        total_eitems=n_eitems,
        total_documents=n_docs,
        total_loans=n_loans,
        total_series=n_series,
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

    # Series
    click.echo('Creating series...')
    series_generator = SeriesGenerator(holder, minter)
    series_generator.generate()
    rec_series = series_generator.persist()

    # Documents
    click.echo('Creating documents...')
    documents_generator = DocumentGenerator(holder, minter)
    documents_generator.generate()
    rec_docs = documents_generator.persist()

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

    # Loans
    click.echo('Creating loans...')
    loans_generator = LoanGenerator(holder, minter)
    loans_generator.generate()
    rec_loans = loans_generator.persist()

    # Related records
    click.echo('Creating related records...')
    related_generator = RelatedRecordsGenerator(holder, minter)
    related_generator.generate(rec_docs, rec_series)
    related_generator.persist()

    # index locations
    indexer.bulk_index([str(r.id) for r in rec_intlocs])
    click.echo('Sent to the indexing queue {0} locations'.format(
        len(rec_intlocs)))

    # index keywords
    indexer.bulk_index([str(r.id) for r in rec_keywords])
    click.echo('Sent to the indexing queue {0} keywords'.format(
        len(rec_keywords)))
    # process queue so series can resolve keywords correctly
    indexer.process_bulk_queue()

    # index series
    indexer.bulk_index([str(r.id) for r in rec_series])
    click.echo('Sent to the indexing queue {0} series'.format(
        len(rec_series)))

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

    click.secho('Now indexing {0} patrons'.format(len(patrons)), fg='green')

    for pat in patrons:
        patron = Patron(pat.id)
        indexer.index(patron)


@click.command()
@click.option('--skip-db-destroy', is_flag=True, help='Skip destroying DB.')
@click.option('--skip-demo-data', is_flag=True, help='Skip creating demo data.')
@click.option('--skip-patrons', is_flag=True, help='Skip creating patrons.')
@click.option('--verbose', is_flag=True, help='Verbose output.')
@with_appcontext
def setup(skip_db_destroy, skip_demo_data, skip_patrons, verbose):
    """ILS setup command."""
    from flask import current_app
    from invenio_base.app import create_cli
    import redis

    click.secho('ils setup started...', fg='blue')

    # Clean redis
    redis.StrictRedis.from_url(current_app.config['CACHE_REDIS_URL']).flushall()
    click.secho('redis cache cleared...', fg='red')

    cli = create_cli()
    runner = current_app.test_cli_runner()

    def run_command(command, catch_exceptions=False):
        click.secho('ils {}...'.format(command), fg='green')
        res = runner.invoke(cli, command, catch_exceptions=catch_exceptions)
        if verbose:
            click.secho(res.output)

    # Remove and create db and indexes
    if not skip_db_destroy:
        run_command('db destroy --yes-i-know', catch_exceptions=True)
    run_command('db init create')
    run_command('index destroy --force --yes-i-know')
    run_command('index init --force')
    run_command('index queue init purge')

    # Create roles to restrict access
    run_command('roles create admin')
    run_command('roles create librarian')

    if not skip_patrons:
        # Create users
        run_command('users create patron1@test.ch -a --password=123456')  # ID 1
        run_command('users create patron2@test.ch -a --password=123456')  # ID 2
        run_command('users create admin@test.ch -a --password=123456')  # ID 3
        run_command('users create librarian@test.ch -a --password=123456')  # ID 4
        run_command('users create patron3@test.ch -a --password=123456')  # ID 5
        run_command('users create patron4@test.ch -a --password=123456')  # ID 6

        # Assign roles
        run_command('roles add admin@test.ch admin')
        run_command('roles add librarian@test.ch librarian')

    # Assign actions
    run_command('access allow superuser-access role admin')
    run_command('access allow ils-backoffice-access role librarian')

    # Index patrons
    run_command('patrons index')

    # Generate demo data
    if not skip_demo_data:
        run_command('demo data')

    click.secho('ils setup finished successfully', fg='blue')
