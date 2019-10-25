# -*- coding: utf-8 -*-
#
# Copyright (C) 2018-2019 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""CLI for Invenio App ILS."""

import random
from datetime import timedelta
from random import randint

import arrow
import click
import lorem
from flask import current_app
from flask.cli import with_appcontext
from invenio_accounts.models import User
from invenio_circulation.api import Loan
from invenio_circulation.pidstore.pids import CIRCULATION_LOAN_PID_TYPE
from invenio_db import db
from invenio_indexer.api import RecordIndexer
from invenio_pidstore.models import PersistentIdentifier, PIDStatus, \
    RecordIdentifier
from invenio_search import current_search
from invenio_userprofiles.models import UserProfile
from lorem.text import TextLorem

from .indexer import PatronsIndexer
from .pidstore.pids import DOCUMENT_PID_TYPE, DOCUMENT_REQUEST_PID_TYPE, \
    EITEM_PID_TYPE, INTERNAL_LOCATION_PID_TYPE, ITEM_PID_TYPE, \
    LOCATION_PID_TYPE, SERIES_PID_TYPE, TAG_PID_TYPE
from .records.api import Document, DocumentRequest, EItem, InternalLocation, \
    Item, Location, Patron, Series, Tag
from .records_relations.api import RecordRelationsParentChild, \
    RecordRelationsSiblings
from .relations.api import Relation


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


class Holder(object):
    """Hold generated data."""

    def __init__(
        self,
        patrons_pids,
        librarian_pid,
        total_intloc,
        total_tags,
        total_items,
        total_eitems,
        total_documents,
        total_loans,
        total_series,
        total_document_requests,
    ):
        """Constructor."""
        self.patrons_pids = patrons_pids
        self.librarian_pid = librarian_pid

        self.location = {}
        self.internal_locations = {"objs": [], "total": total_intloc}
        self.tags = {"objs": [], "total": total_tags}
        self.items = {"objs": [], "total": total_items}
        self.eitems = {"objs": [], "total": total_eitems}
        self.documents = {"objs": [], "total": total_documents}
        self.loans = {"objs": [], "total": total_loans}
        self.series = {"objs": [], "total": total_series}
        self.related_records = {"objs": [], "total": 0}
        self.document_requests = {"objs": [], "total": total_document_requests}

    def pids(self, collection, pid_field):
        """Get a list of PIDs for a collection."""
        return [obj[pid_field] for obj in getattr(self, collection)["objs"]]


class Generator(object):
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
            "pid": "1",
            "name": "Central Library",
            "address": "Rue de Meyrin",
            "email": "library@cern.ch",
        }

    def persist(self):
        """Persist."""
        record = Location.create(self.holder.location)
        return self._persist(LOCATION_PID_TYPE, "pid", record)


class InternalLocationGenerator(Generator):
    """InternalLocation Generator."""

    def generate(self):
        """Generate."""
        size = self.holder.internal_locations["total"]
        location_pid_value = self.holder.location["pid"]
        objs = [
            {
                "pid": str(pid),
                "legacy_id": "{}".format(randint(100000, 999999)),
                "name": "Building {}".format(randint(1, 10)),
                "notes": lorem.sentence(),
                "physical_location": lorem.sentence(),
                "location_pid": location_pid_value,
            }
            for pid in range(1, size + 1)
        ]

        self.holder.internal_locations["objs"] = objs

    def persist(self):
        """Persist."""
        recs = []
        for obj in self.holder.internal_locations["objs"]:
            rec = self._persist(
                INTERNAL_LOCATION_PID_TYPE, "pid", InternalLocation.create(obj)
            )
            recs.append(rec)
        db.session.commit()
        return recs


class TagGenerator(Generator):
    """Tag Generator."""

    def generate(self):
        """Generate."""
        size = self.holder.tags["total"]
        objs = [
            {
                "pid": str(pid),
                "name": lorem.sentence().split()[0],
                "provenance": lorem.sentence(),
            }
            for pid in range(1, size + 1)
        ]

        self.holder.tags["objs"] = objs

    def persist(self):
        """Persist."""
        recs = []
        for obj in self.holder.tags["objs"]:
            rec = self._persist(TAG_PID_TYPE, "pid", Tag.create(obj))
            recs.append(rec)
        db.session.commit()
        return recs


class ItemGenerator(Generator):
    """Item Generator."""

    def generate(self):
        """Generate."""
        size = self.holder.items["total"]
        iloc_pids = self.holder.pids("internal_locations", "pid")
        doc_pids = self.holder.pids("documents", "pid")
        shelf_lorem = TextLorem(wsep='-', srange=(2, 3),
                                words='Ax Bs Cw 8080'.split())
        objs = [
            {
                "pid": str(pid),
                "document_pid": random.choice(doc_pids),
                "internal_location_pid": random.choice(iloc_pids),
                "legacy_id": "{}".format(randint(100000, 999999)),
                "legacy_library_id": "{}".format(randint(5, 50)),
                "barcode": "{}".format(randint(10000000, 99999999)),
                "shelf": "{}".format(shelf_lorem.sentence()),
                "description": "{}".format(lorem.text()),
                "internal_notes": "{}".format(lorem.text()),
                "medium": random.choice(Item.MEDIUMS),
                "status": random.choice(
                    random.choices(population=Item.STATUSES,
                                   weights=[0.7, 0.1, 0.1, 0.1, 0.05],
                                   k=10
                                   )),
                "circulation_restriction": random.choice(
                    Item.CIRCULATION_RESTRICTIONS
                ),
            }
            for pid in range(1, size + 1)
        ]

        self.holder.items["objs"] = objs

    def persist(self):
        """Persist."""
        recs = []
        for obj in self.holder.items["objs"]:
            rec = self._persist(ITEM_PID_TYPE, "pid", Item.create(obj))
            recs.append(rec)
        db.session.commit()
        return recs


class EItemGenerator(Generator):
    """EItem Generator."""

    def generate(self):
        """Generate."""
        size = self.holder.eitems["total"]
        doc_pids = self.holder.pids("documents", "pid")

        objs = [
            {
                "pid": str(pid),
                "document_pid": random.choice(doc_pids),
                "description": "{}".format(lorem.text()),
                "internal_notes": "{}".format(lorem.text()),
                "urls": [
                    {
                        "value": "https://home.cern/science/physics/dark-matter",
                        "description": "Dark matter"
                    },
                    {
                        "value": "https://home.cern/science/physics/antimatter",
                        "description": "Anti matter"
                    },
                ],
                "open_access": bool(random.getrandbits(1)),
            }
            for pid in range(1, size + 1)
        ]

        self.holder.eitems["objs"] = objs

    def persist(self):
        """Persist."""
        recs = []
        for obj in self.holder.eitems["objs"]:
            rec = self._persist(EITEM_PID_TYPE, "pid", EItem.create(obj))
            recs.append(rec)
        db.session.commit()
        return recs


class DocumentGenerator(Generator):
    """Document Generator."""

    DOCUMENT_TYPES = ["BOOK", "STANDARD", "PROCEEDINGS"]
    LANGUAGES = [u"en", u"fr", u"it", u"el", u"pl", u"ro", u"sv", u"es"]
    AUTHORS = [{"full_name": "Close, Frank"},
               {"full_name": "Doe, Jane",
                "affiliations": [{"name": "Imperial Coll., London",
                                  "identifiers":
                                      [
                                          {"scheme": "INSPIRE",
                                           "value": "12345"}
                                      ]
                                  }
                                 ],
                "identifiers": [
                    {"scheme": "CERN", "value": "2108633"}
                ],
                "roles": ["editor"]
                },
               {"full_name": "Doe, John", "roles": ["author"],
                "affiliations": [{"name": "CERN"}]
                },
               {"full_name": "CERN", "type": "organisation"}
               ]
    CONFERENCE_INFO = {"acronym": "CHEP", "country": "AU",
                       "dates": "1 - 20 Nov. 2019",
                       "identifiers": [{"scheme": "CERN",
                                        "value": "CHEP2019"}
                                       ],
                       "place": "Adelaide",
                       "series": "CHEP",
                       "title": "Conference on Computing"
                                " in High Energy Physics",
                       "year": 2019,
                       }
    IMPRINTS = [
        {"date": "2019-08-02",
         "place": "Geneva",
         "publisher": "CERN"
         },
        {"date": "2017-08-02",
         "place": "Hamburg",
         "publisher": "Springer"
         },

    ]

    def generate(self):
        """Generate."""
        size = self.holder.documents["total"]
        tag_pids = self.holder.pids("tags", "pid")

        objs = [
            {
                "pid": str(pid),
                "title": lorem.sentence(),
                "authors": random.sample(self.AUTHORS, randint(1, 3)),
                "abstract": "{}".format(lorem.text()),
                "document_type": random.choice(self.DOCUMENT_TYPES),
                "_access": {},
                "languages": random.sample(self.LANGUAGES, randint(1, 3)),
                "table_of_content": ["{}".format(lorem.sentence())],
                "note": "{}".format(lorem.text()),
                "tag_pids": random.sample(tag_pids, randint(0, 5)),
                "edition": str(pid),
                "keywords": {"source": lorem.sentence(),
                             "value": lorem.sentence()},
                "conference_info": self.CONFERENCE_INFO,
                "number_of_pages": str(random.randint(0, 300)),
                "imprints": [self.IMPRINTS[randint(0, 1)]],
                "urls": [{"description": "{}".format(lorem.sentence()),
                          "value": "{}".format(lorem.sentence()),
                          }],


            }
            for pid in range(1, size + 1)
        ]

        self.holder.documents["objs"] = objs

    def persist(self):
        """Persist."""
        recs = []
        for obj in self.holder.documents["objs"]:
            rec = self._persist(DOCUMENT_PID_TYPE, "pid", Document.create(obj))
            recs.append(rec)
        db.session.commit()
        return recs


class LoanGenerator(Generator):
    """Loan Generator."""

    LOAN_STATES = ["PENDING", "ITEM_ON_LOAN", "ITEM_RETURNED", "CANCELLED"]

    def _get_item_can_circulate(self, items):
        """Return an item that can circulate."""
        item = items[randint(1, len(items) - 1)]
        if item["status"] != "CAN_CIRCULATE":
            return self._get_item_can_circulate(items)
        return item

    def _get_valid_status(self, item, items_on_loan):
        """Return valid loan status for the item to avoid inconsistencies."""
        # cannot have 2 loans in the same item
        if item["pid"] in items_on_loan:
            status = self.LOAN_STATES[0]
        else:
            status = self.LOAN_STATES[randint(0, 3)]
        return status

    def _fill_loan_with_valid_request(self, loan):
        """Add fields to the loan with dates valid for a request."""
        transaction_date = arrow.utcnow() - timedelta(days=randint(1, 10))
        request_start_date = transaction_date + timedelta(days=15)
        request_expire_date = transaction_date + timedelta(days=180)
        loan["transaction_date"] = transaction_date.isoformat()
        loan["request_start_date"] = request_start_date.date().isoformat()
        loan["request_expire_date"] = request_expire_date.date().isoformat()

    def _fill_loan_with_valid_loan(self, loan):
        """Add fields to the loan with dates valid for a on-going loan."""
        transaction_date = arrow.utcnow() - timedelta(days=randint(10, 20))
        start_date = transaction_date - timedelta(days=randint(1, 5))
        end_date = start_date + timedelta(days=30)
        loan["transaction_date"] = transaction_date.isoformat()
        loan["start_date"] = start_date.date().isoformat()
        loan["end_date"] = end_date.date().isoformat()
        loan["extension_count"] = randint(0, 3)

    def _fill_loan_with_loan_returned(self, loan):
        """Add fields to the loan with dates valid for a returned loan."""
        transaction_date = arrow.utcnow() - timedelta(days=randint(50, 70))
        start_date = transaction_date - timedelta(days=randint(40, 50))
        end_date = start_date + timedelta(days=30)
        loan["transaction_date"] = transaction_date.isoformat()
        loan["start_date"] = start_date.date().isoformat()
        loan["end_date"] = end_date.date().isoformat()

    def _fill_loan_with_loan_cancelled(self, loan):
        """Add fields to the loan with dates valid for a cancelled loan."""
        transaction_date = arrow.utcnow() - timedelta(days=randint(50, 100))
        request_expire_date = transaction_date + timedelta(days=180)
        start_date = transaction_date - timedelta(days=randint(40, 50))
        end_date = start_date + timedelta(days=30)
        loan["transaction_date"] = transaction_date.isoformat()
        loan["request_expire_date"] = request_expire_date.date().isoformat()
        loan["start_date"] = start_date.date().isoformat()
        loan["end_date"] = end_date.date().isoformat()
        loan["cancel_reason"] = "{}".format(lorem.sentence())

    def _fill_loan(self, loan):
        """Fill loan with valid dates."""
        if loan["state"] == "PENDING":
            self._fill_loan_with_valid_request(loan)
        elif loan["state"] == "ITEM_ON_LOAN":
            self._fill_loan_with_valid_loan(loan)
        elif loan["state"] == "ITEM_RETURNED":
            self._fill_loan_with_loan_returned(loan)
        elif loan["state"] == "CANCELLED":
            self._fill_loan_with_loan_cancelled(loan)
        return loan

    def generate(self):
        """Generate."""
        size = self.holder.loans["total"]
        loc_pid = self.holder.location["pid"]
        items = self.holder.items["objs"]
        patrons_pids = self.holder.patrons_pids
        librarian_pid = self.holder.librarian_pid
        doc_pids = self.holder.pids("documents", "pid")
        all_delivery_methods = list(
            current_app.config["CIRCULATION_DELIVERY_METHODS"].keys()
        )
        delivery = all_delivery_methods[randint(0, 1)]

        items_on_loan = []
        for pid in range(1, size + 1):
            item = self._get_item_can_circulate(items)
            item_state = self._get_valid_status(item, items_on_loan)
            patron_id = random.choice(patrons_pids)

            loan = {
                "pid": str(pid),
                "document_pid": random.choice(doc_pids),
                "patron_pid": "{}".format(patron_id),
                "pickup_location_pid": "{}".format(loc_pid),
                "state": "{}".format(item_state),
                "transaction_location_pid": "{}".format(loc_pid),
                "transaction_user_pid": "{}".format(librarian_pid),
                "delivery": {"method": delivery},
            }
            loan = self._fill_loan(loan)

            if item_state != "PENDING":
                loan["item_pid"] = "{}".format(item["pid"])
                items_on_loan.append(item["pid"])

            self.holder.loans["objs"].append(loan)

    def persist(self):
        """Persist."""
        recs = []
        for obj in self.holder.loans["objs"]:
            rec = self._persist(
                CIRCULATION_LOAN_PID_TYPE, "pid", Loan.create(obj)
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
        return "-".join(str(r) for r in random_4digit)

    def generate(self):
        """Generate."""
        size = self.holder.series["total"]
        objs = []
        for pid in range(1, size + 1):
            moi = random.choice(self.MODE_OF_ISSUANCE)
            obj = {
                "pid": str(pid),
                "mode_of_issuance": moi,
                "issn": self.random_issn(),
                "title": lorem.sentence(),
                "authors": [lorem.sentence()],
                "abstract": lorem.text(),
                "languages": random.sample(self.LANGUAGES, 1),
            }
            if moi == "MULTIPART_MONOGRAPH":
                obj["edition"] = str(pid)
            objs.append(obj)

        self.holder.series["objs"] = objs

    def persist(self):
        """Persist."""
        recs = []
        for obj in self.holder.series["objs"]:
            rec = self._persist(SERIES_PID_TYPE, "pid", Series.create(obj))
            recs.append(rec)
        db.session.commit()
        return recs


class RecordRelationsGenerator(Generator):
    """Related records generator."""

    @staticmethod
    def random_series(series, moi):
        """Get a random series with a specific mode of issuance."""
        for s in random.sample(series, len(series)):
            if s["mode_of_issuance"] == moi:
                return s

    def generate_parent_child_relations(self, documents, series):
        """Generate parent-child relations."""
        def random_docs():
            return random.sample(documents, randint(1, min(5, len(documents))))

        objs = self.holder.related_records["objs"]
        serial_parent = self.random_series(series, "SERIAL")
        multipart_parent = self.random_series(series, "MULTIPART_MONOGRAPH")
        serial_children = documents  # random_docs()
        multipart_children = random_docs()

        objs.append(serial_parent)
        rr = RecordRelationsParentChild()
        serial_relation = Relation.get_relation_by_name("serial")
        multipart_relation = Relation.get_relation_by_name(
            "multipart_monograph"
        )
        for index, child in enumerate(serial_children):
            rr.add(
                serial_parent,
                child,
                relation_type=serial_relation,
                volume="{}".format(index + 1),
            )
            objs.append(child)
        for index, child in enumerate(multipart_children):
            rr.add(
                multipart_parent,
                child,
                relation_type=multipart_relation,
                volume="{}".format(index + 1),
            )
            objs.append(child)

    def generate_sibling_relations(self, documents, series):
        """Generate sibling relations."""
        objs = self.holder.related_records["objs"]
        rr = RecordRelationsSiblings()

        def add_random_relations(relation_type):
            random_docs = random.sample(
                documents, randint(2, min(5, len(documents)))
            )

            objs.append(random_docs[0])
            for record in random_docs[1:]:
                rr.add(random_docs[0], record, relation_type=relation_type)
                objs.append(record)

            if relation_type.name == "edition":
                record = self.random_series(series, "MULTIPART_MONOGRAPH")
                rr.add(random_docs[0], record, relation_type=relation_type)
                objs.append(record)

        add_random_relations(Relation.get_relation_by_name("language"))
        add_random_relations(Relation.get_relation_by_name("edition"))

    def generate(self, rec_docs, rec_series):
        """Generate related records."""
        self.generate_parent_child_relations(rec_docs, rec_series)
        self.generate_sibling_relations(rec_docs, rec_series)

    def persist(self):
        """Persist."""
        db.session.commit()
        return self.holder.related_records["objs"]


class DocumentRequestGenerator(Generator):
    """Document requests generator."""

    def random_document_pid(self, state):
        """Get a random document PID if the state is ACCEPTED."""
        if state == "ACCEPTED":
            return random.choice(self.holder.pids("documents", "pid"))
        return None

    def generate(self):
        """Generate."""
        size = self.holder.series["total"]
        objs = []
        for pid in range(1, size + 1):
            obj = {
                "pid": str(pid),
                "patron_pid": random.choice(self.holder.patrons_pids),
                "title": lorem.sentence(),
                "authors": lorem.sentence(),
                "publication_year": randint(1700, 2019),
            }
            objs.append(obj)

        self.holder.document_requests["objs"] = objs

    def persist(self):
        """Persist."""
        recs = []
        for obj in self.holder.document_requests["objs"]:
            rec = self._persist(
                DOCUMENT_REQUEST_PID_TYPE, "pid", DocumentRequest.create(obj)
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
@click.option("--tags", "n_tags", default=10)
@click.option("--internal-locations", "n_intlocs", default=10)
@click.option("--series", "n_series", default=10)
@click.option("--document-requests", "n_document_requests", default=10)
@with_appcontext
def data(
    n_docs,
    n_items,
    n_eitems,
    n_loans,
    n_tags,
    n_intlocs,
    n_series,
    n_document_requests,
):
    """Insert demo data."""
    click.secho("Generating demo data", fg="yellow")

    indexer = RecordIndexer()

    holder = Holder(
        patrons_pids=["1", "2", "5", "6"],
        librarian_pid="4",
        total_intloc=n_intlocs,
        total_tags=n_tags,
        total_items=n_items,
        total_eitems=n_eitems,
        total_documents=n_docs,
        total_loans=n_loans,
        total_series=n_series,
        total_document_requests=n_document_requests,
    )

    click.echo("Creating locations...")
    loc_generator = LocationGenerator(holder, minter)
    loc_generator.generate()
    rec = loc_generator.persist()
    indexer.index(rec)

    # InternalLocations
    intlocs_generator = InternalLocationGenerator(holder, minter)
    intlocs_generator.generate()
    rec_intlocs = intlocs_generator.persist()

    # Tags
    click.echo("Creating tags...")
    tags_generator = TagGenerator(holder, minter)
    tags_generator.generate()
    rec_tags = tags_generator.persist()

    # Series
    click.echo("Creating series...")
    series_generator = SeriesGenerator(holder, minter)
    series_generator.generate()
    rec_series = series_generator.persist()

    # Documents
    click.echo("Creating documents...")
    documents_generator = DocumentGenerator(holder, minter)
    documents_generator.generate()
    rec_docs = documents_generator.persist()

    # Items
    click.echo("Creating items...")
    items_generator = ItemGenerator(holder, minter)
    items_generator.generate()
    rec_items = items_generator.persist()

    # EItems
    click.echo("Creating eitems...")
    eitems_generator = EItemGenerator(holder, minter)
    eitems_generator.generate()
    rec_eitems = eitems_generator.persist()

    # Loans
    click.echo("Creating loans...")
    loans_generator = LoanGenerator(holder, minter)
    loans_generator.generate()
    rec_loans = loans_generator.persist()

    # Related records
    click.echo("Creating related records...")
    related_generator = RecordRelationsGenerator(holder, minter)
    related_generator.generate(rec_docs, rec_series)
    related_generator.persist()

    # Document requests
    click.echo("Creating document requests...")
    document_requests_generator = DocumentRequestGenerator(holder, minter)
    document_requests_generator.generate()
    rec_requests = document_requests_generator.persist()

    # index locations
    indexer.bulk_index([str(r.id) for r in rec_intlocs])
    click.echo(
        "Sent to the indexing queue {0} locations".format(len(rec_intlocs))
    )

    # index tags
    indexer.bulk_index([str(r.id) for r in rec_tags])
    click.echo("Sent to the indexing queue {0} tags".format(len(rec_tags)))
    # process queue so series can resolve tags correctly
    indexer.process_bulk_queue()

    # index series
    indexer.bulk_index([str(r.id) for r in rec_series])
    click.echo("Sent to the indexing queue {0} series".format(len(rec_series)))

    # index loans
    indexer.bulk_index([str(r.id) for r in rec_loans])
    click.echo("Sent to the indexing queue {0} loans".format(len(rec_loans)))

    click.secho("Now indexing...", fg="green")
    # process queue so items can resolve circulation status correctly
    indexer.process_bulk_queue()

    # index eitems
    indexer.bulk_index([str(r.id) for r in rec_eitems])
    click.echo("Sent to the indexing queue {0} eitems".format(len(rec_eitems)))

    # index items
    indexer.bulk_index([str(r.id) for r in rec_items])
    click.echo("Sent to the indexing queue {0} items".format(len(rec_items)))

    click.secho("Now indexing...", fg="green")
    # process queue so documents can resolve circulation correctly
    indexer.process_bulk_queue()

    # index document requests
    indexer.bulk_index([str(r.id) for r in rec_requests])
    click.echo(
        "Sent to the indexing queue {0} document requests".format(
            len(rec_requests)
        )
    )

    click.secho("Now indexing...", fg="green")
    indexer.process_bulk_queue()

    # flush all indices after indexing, otherwise ES won't be ready for tests
    current_search.flush_and_refresh(index="*")

    # index documents
    indexer.bulk_index([str(r.id) for r in rec_docs])
    click.echo(
        "Sent to the indexing queue {0} documents".format(len(rec_docs))
    )

    # index loans again
    indexer.bulk_index([str(r.id) for r in rec_loans])
    click.echo("Sent to the indexing queue {0} loans".format(len(rec_loans)))

    click.secho("Now indexing...", fg="green")
    indexer.process_bulk_queue()


@click.group()
def patrons():
    """Patrons data CLI."""


@patrons.command()
@with_appcontext
def index():
    """Index patrons."""
    from flask import current_app
    from invenio_app_ils.pidstore.pids import PATRON_PID_TYPE

    patrons = User.query.all()
    indexer = PatronsIndexer()

    click.secho("Now indexing {0} patrons".format(len(patrons)), fg="green")

    rest_config = current_app.config["RECORDS_REST_ENDPOINTS"]
    patron_cls = rest_config[PATRON_PID_TYPE]["record_class"] or Patron
    for pat in patrons:
        patron = patron_cls(pat.id)
        indexer.index(patron)


def create_userprofile_for(email, username, full_name):
    """Create a fake user profile."""
    user = User.query.filter_by(email=email).one_or_none()
    if user:
        profile = UserProfile(user_id=int(user.get_id()))
        profile.username = username
        profile.full_name = full_name
        db.session.add(profile)
        db.session.commit()


@click.command()
@click.option("--recreate-db", is_flag=True, help="Recreating DB.")
@click.option(
    "--skip-demo-data", is_flag=True, help="Skip creating demo data."
)
@click.option("--skip-patrons", is_flag=True, help="Skip creating patrons.")
@click.option("--verbose", is_flag=True, help="Verbose output.")
@with_appcontext
def setup(recreate_db, skip_demo_data, skip_patrons, verbose):
    """ILS setup command."""
    from flask import current_app
    from invenio_base.app import create_cli
    import redis

    click.secho("ils setup started...", fg="blue")

    # Clean redis
    redis.StrictRedis.from_url(
        current_app.config["CACHE_REDIS_URL"]
    ).flushall()
    click.secho("redis cache cleared...", fg="red")

    cli = create_cli()
    runner = current_app.test_cli_runner()

    def run_command(command, catch_exceptions=False):
        click.secho("ils {}...".format(command), fg="green")
        res = runner.invoke(cli, command, catch_exceptions=catch_exceptions)
        if verbose:
            click.secho(res.output)

    # Remove and create db and indexes
    if recreate_db:
        run_command("db destroy --yes-i-know", catch_exceptions=True)
        run_command("db init")
    else:
        run_command("db drop --yes-i-know")
    run_command("db create")
    run_command("index destroy --force --yes-i-know")
    run_command("index init --force")
    run_command("index queue init purge")

    # Create roles to restrict access
    run_command("roles create admin")
    run_command("roles create librarian")

    if not skip_patrons:
        # Create users
        run_command(
            "users create patron1@test.ch -a --password=123456"
        )  # ID 1
        create_userprofile_for("patron1@test.ch", "patron1", "Yannic Vilma")
        run_command(
            "users create patron2@test.ch -a --password=123456"
        )  # ID 2
        create_userprofile_for("patron2@test.ch", "patron2", "Diana Adi")
        run_command("users create admin@test.ch -a --password=123456")  # ID 3
        create_userprofile_for("admin@test.ch", "admin", "Zeki Ryoichi")
        run_command(
            "users create librarian@test.ch -a --password=123456"
        )  # ID 4
        create_userprofile_for("librarian@test.ch", "librarian", "Hector Nabu")
        run_command(
            "users create patron3@test.ch -a --password=123456"
        )  # ID 5
        create_userprofile_for("patron3@test.ch", "patron3", "Medrod Tara")
        run_command(
            "users create patron4@test.ch -a --password=123456"
        )  # ID 6
        create_userprofile_for("patron4@test.ch", "patron4", "Devi Cupid")

        # Assign roles
        run_command("roles add admin@test.ch admin")
        run_command("roles add librarian@test.ch librarian")

    # Assign actions
    run_command("access allow superuser-access role admin")
    run_command("access allow ils-backoffice-access role librarian")

    # Index patrons
    run_command("patrons index")

    # Generate demo data
    if not skip_demo_data:
        run_command("demo data")

    click.secho("ils setup finished successfully", fg="blue")
