# -*- coding: utf-8 -*-
#
# Copyright (C) 2018-2020 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""CLI for Invenio App ILS."""

import importlib.resources
import json
import os
import pathlib
import random
import re
from datetime import date, datetime, timedelta
from random import randint

import arrow
import click
import lorem
from flask import current_app
from flask.cli import with_appcontext
from invenio_access.permissions import system_identity
from invenio_accounts.models import User
from invenio_circulation.api import Loan
from invenio_circulation.pidstore.pids import CIRCULATION_LOAN_PID_TYPE
from invenio_db import db
from invenio_i18n.proxies import current_i18n
from invenio_indexer.api import RecordIndexer
from invenio_pages.proxies import current_pages_service
from invenio_pages.records.errors import PageNotFoundError
from invenio_pidstore.models import PersistentIdentifier, PIDStatus
from invenio_pidstore.providers.recordid_v2 import RecordIdProviderV2
from invenio_search import current_search
from lorem.text import TextLorem

from invenio_app_ils.errors import RecordRelationsError

from .acquisition.api import ORDER_PID_TYPE, Order
from .document_requests.api import DOCUMENT_REQUEST_PID_TYPE, DocumentRequest
from .documents.api import DOCUMENT_PID_TYPE, Document
from .eitems.api import EITEM_PID_TYPE, EItem
from .ill.api import BORROWING_REQUEST_PID_TYPE, BorrowingRequest
from .internal_locations.api import INTERNAL_LOCATION_PID_TYPE, InternalLocation
from .items.api import ITEM_PID_TYPE, Item
from .locations.api import LOCATION_PID_TYPE, Location
from .providers.api import PROVIDER_PID_TYPE, Provider
from .proxies import current_app_ils
from .records_relations.api import RecordRelationsParentChild, RecordRelationsSiblings
from .relations.api import Relation
from .series.api import SERIES_PID_TYPE, Series

CURRENT_DIR = pathlib.Path(__file__).parent.absolute()


def minter(pid_type, pid_field, record):
    """Mint the given PID for the given record."""
    pid = PersistentIdentifier.get(pid_type="recid", pid_value=record[pid_field])
    pid.status = PIDStatus.REGISTERED
    pid.object_type = "rec"
    pid.object_uuid = record.id
    pid.pid_type = pid_type


class Holder(object):
    """Hold generated data."""

    def __init__(
        self,
        patrons_pids,
        languages,
        librarian_pid,
        tags,
        total_intloc,
        total_items,
        total_eitems,
        total_documents,
        total_loans,
        total_series,
        total_document_requests,
        total_vendors,
        total_orders,
        total_borrowing_requests,
        total_libraries,
    ):
        """Constructor."""
        self.patrons_pids = patrons_pids
        self.languages = languages
        self.librarian_pid = librarian_pid
        self.tags = tags
        self.internal_locations = {"objs": [], "total": total_intloc}
        self.items = {"objs": [], "total": total_items}
        self.eitems = {"objs": [], "total": total_eitems}
        self.documents = {"objs": [], "total": total_documents}
        self.loans = {"objs": [], "total": total_loans}
        self.series = {"objs": [], "total": total_series}
        self.related_records = {"objs": [], "total": 0}
        self.document_requests = {"objs": [], "total": total_document_requests}
        self.vendors = {"objs": [], "total": total_vendors}
        self.orders = {"objs": [], "total": total_orders}
        self.borrowing_requests = {
            "objs": [],
            "total": total_borrowing_requests,
        }
        self.pending_borrowing_requests = {"objs": []}
        self.libraries = {"objs": [], "total": total_libraries}

    def pids(self, collection, pid_field):
        """Get a list of PIDs for a collection."""
        return [obj[pid_field] for obj in getattr(self, collection)["objs"]]


class Generator(object):
    """Generator."""

    def __init__(self, holder, minter):
        """Constructor."""
        self.holder = holder
        self.minter = minter

    def create_pid(self):
        """Create a new persistent identifier."""
        return RecordIdProviderV2.create().pid.pid_value

    def _persist(self, pid_type, pid_field, record):
        """Mint PID and store in the db."""
        minter(pid_type, pid_field, record)
        return record


class LocationGenerator(Generator):
    """Location Generator."""

    def generate(self):
        """Generate."""
        weekdays = [
            "monday",
            "tuesday",
            "wednesday",
            "thursday",
            "friday",
            "saturday",
            "sunday",
        ]
        closed = ["saturday", "sunday"]
        times = [
            {"start_time": "08:00", "end_time": "12:00"},
            {"start_time": "13:00", "end_time": "18:00"},
        ]
        opening_weekdays = []
        for weekday in weekdays:
            is_open = weekday not in closed
            opening_weekdays.append(
                {
                    "weekday": weekday,
                    "is_open": weekday not in closed,
                    **({"times": times} if is_open else {}),
                }
            )
        last_date = date.today()
        opening_exceptions = []
        for i in range(randint(0, 3)):
            start_date = last_date + timedelta(days=randint(1, 15))
            end_date = start_date + timedelta(days=randint(1, 4))
            last_date = end_date
            opening_exceptions.append(
                {
                    "title": lorem.sentence(),
                    "is_open": random.random() >= 0.7,
                    "start_date": start_date.isoformat(),
                    "end_date": end_date.isoformat(),
                }
            )
        self.holder.location = {
            "pid": self.create_pid(),
            "name": "Central Library",
            "address": "Rue de Meyrin",
            "email": "library@cern.ch",
            "opening_weekdays": opening_weekdays,
            "opening_exceptions": opening_exceptions,
        }

    def persist(self):
        """Persist."""
        record = Location.create(self.holder.location)
        rec = self._persist(LOCATION_PID_TYPE, "pid", record)
        db.session.commit()
        return rec


class InternalLocationGenerator(Generator):
    """InternalLocation Generator."""

    def generate(self):
        """Generate."""
        size = self.holder.internal_locations["total"]
        location_pid_value, _ = current_app_ils.get_default_location_pid
        objs = [
            {
                "pid": self.create_pid(),
                "legacy_id": randint(100000, 999999),
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


class ItemGenerator(Generator):
    """Item Generator."""

    MEDIUMS = [
        "NOT_SPECIFIED",
        "PAPER",
        "CDROM",
        "DVD",
        "VHS",
    ]

    def generate(self):
        """Generate."""
        size = self.holder.items["total"]
        iloc_pids = self.holder.pids("internal_locations", "pid")
        doc_pids = self.holder.pids("documents", "pid")
        shelf_lorem = TextLorem(wsep="-", srange=(2, 3), words="Ax Bs Cw 8080".split())
        objs = [
            {
                "pid": self.create_pid(),
                "created_by": {
                    "type": "script",
                    "value": "demo",
                },
                "document_pid": random.choice(doc_pids),
                "internal_location_pid": random.choice(iloc_pids),
                "isbns": [{"value": "978-1-891830-85-3"}],
                "legacy_id": "{}".format(randint(100000, 999999)),
                "legacy_library_id": "{}".format(randint(5, 50)),
                "barcode": "{}".format(randint(10000000, 99999999)),
                "shelf": "{}".format(shelf_lorem.sentence()),
                "description": "{}".format(lorem.text()),
                "internal_notes": "{}".format(lorem.text()),
                "medium": random.choice(self.MEDIUMS),
                "status": random.choice(
                    random.choices(
                        population=Item.STATUSES,
                        weights=[0.7, 0.1, 0.1, 0.1, 0.05],
                        k=10,
                    )
                ),
                "circulation_restriction": random.choice(Item.CIRCULATION_RESTRICTIONS),
            }
            for pid in range(1, size + 1)
        ]

        demo_data_dir = os.path.join(CURRENT_DIR, "demo_data")
        with open(os.path.join(demo_data_dir, "items.json")) as f:
            demo_data = json.loads(f.read())

        for item in demo_data:
            item["pid"] = self.create_pid()
            item["document_pid"] = random.choice(doc_pids)
            item["internal_location_pid"] = random.choice(iloc_pids)

        objs.extend(demo_data)
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
                "pid": self.create_pid(),
                "created_by": {
                    "type": "script",
                    "value": "demo",
                },
                "document_pid": random.choice(doc_pids),
                "eitem_type": random.choice(EItem.EITEM_TYPES),
                "description": "{}".format(lorem.text()),
                "internal_notes": "{}".format(lorem.text()),
                "urls": [
                    {
                        "value": "https://home.cern/science/physics/a",
                        "description": "Dark matter",
                    },
                    {
                        "value": "https://home.cern/science/physics/b",
                        "description": "Anti matter",
                    },
                ],
                "open_access": bool(random.getrandbits(1)),
            }
            for pid in range(1, size + 1)
        ]

        for obj in objs:
            if bool(random.getrandbits(1)):
                obj["identifiers"] = random.choice(
                    [
                        [
                            {
                                "scheme": "ISBN",
                                "value": "0-395-36341-1",
                                "material": "EBook",
                            },
                            {
                                "scheme": "DOI",
                                "value": "doi:10.1340/309registries",
                            },
                        ],
                        [],
                    ]
                )

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

    SERIAL_ISSUE = "SERIAL_ISSUE"
    AUTHORS = [
        {"full_name": "Close, Frank"},
        {"full_name": "Harrison, Stacey"},
        {"full_name": "Glover, Bruno"},
        {"full_name": "CERN", "type": "ORGANISATION"},
        {
            "full_name": "Doe, Jane",
            "affiliations": [
                {
                    "name": "Imperial Coll., London",
                    "identifiers": [{"scheme": "ROR", "value": "12345"}],
                }
            ],
            "identifiers": [{"scheme": "ORCID", "value": "1234AAA"}],
            "roles": ["EDITOR"],
        },
        {
            "full_name": "Haigh, Jill",
            "roles": ["RESEARCHER"],
            "affiliations": [{"name": "CERN"}],
        },
    ]
    CONFERENCE_INFO = [
        {
            "acronym": "CHEP",
            "country": "AUS",
            "dates": "1 - 20 Nov. 2019",
            "identifiers": [{"scheme": "OTHER", "value": "CHEP2019"}],
            "place": "Adelaide",
            "series": "CHEP",
            "title": "Conference on Computing in High Energy Physics",
            "year": 2019,
        },
        {
            "place": "London",
            "title": "Conference on Physics in High Energy Physics",
        },
    ]
    IMPRINTS = [
        {"date": "2019-08-02", "place": "Geneva", "publisher": "CERN"},
        {"date": "2017-08-02", "place": "Hamburg", "publisher": "Springer"},
    ]
    ISBNS = [
        "0002154129",
        "978-1-891830-85-3",
        "978-1-60309-265-4",
        "978-1-60309-077-3",
        "978-1-60309-069-8",
        "978-1-60309-042-1",
        "978-1-891830-37-2",
        "978-1-60309-029-2",
        "978-1-891830-40-2",
        "978-1-60309-442-9",
        "978-1-891830-56-3",
        "978-1-60309-432-0",
        "978-1-891830-19-8",
        "978-1-60309-422-1",
        "978-1-60309-100-8",
        "978-1-891830-81-5",
        "978-1-60309-271-5",
        "978-1-891830-92-1",
        "978-1-60309-057-5",
        "978-1-60309-085-8",
        "978-1-60309-387-3",
        "978-1-60309-036-0",
        "978-1-60309-053-7",
        "978-1-891830-97-6",
        "978-0-9585783-4-9",
        "978-1-60309-397-2",
        "978-1-60309-386-6",
        "978-1-60309-098-8",
        "978-1-60309-008-7",
        "978-1-60309-441-2",
        "978-1-891830-55-6",
        "978-1-891830-86-0",
        "978-1-891830-91-4",
        "978-1-60309-041-4",
        "978-1-60309-059-9",
        "978-1-891830-65-5",
        "978-1-891830-90-7",
        "978-1-60309-006-3",
        "978-1-60309-007-0",
        "978-1-60309-437-5",
        "978-1-891830-51-8",
        "978-1-60309-070-4",
        "978-1-63140-984-4",
        "978-1-60309-393-4",
        "978-1-60309-152-7",
        "978-1-891830-33-4",
        "978-1-60309-300-2",
        "978-1-60309-383-5",
        "978-1-60309-400-9",
        "978-1-891830-36-5",
        "978-1-60309-075-9",
        "978-1-891830-68-6",
        "978-1-60309-049-0",
        "978-1-60309-409-2",
        "978-1-60309-068-1",
        "978-1-891830-29-7",
        "978-1-60309-367-5",
        "978-1-60309-413-9",
        "978-1-60309-089-6",
        "978-1-60309-445-0",
        "978-1-891830-14-3",
        "978-1-891830-50-1",
        "978-1-60309-020-9",
        "978-1-60309-031-5",
        "978-1-60309-055-1",
        "978-1-891830-96-9",
        "978-1-60309-043-8",
        "978-1-891830-87-7",
        "978-1-60309-033-9",
        "978-1-60309-005-6",
        "978-1-60309-450-4",
        "978-1-891830-31-0",
        "978-1-891830-70-9",
        "978-1-891830-98-3",
        "978-1-60309-392-7",
        "978-1-60309-074-2",
        "978-1-891830-41-9",
        "978-1-60309-088-9",
        "978-1-60309-440-5",
    ]

    LICENSE = {
        "license": {
            "id": "license-0bsd",
        },
        "material": "paper",
    }

    COPYRIGHTS = {
        "holder": "INSTITUTION",
        "material": "paper",
        "statement": "Copyright statement",
        "url": "https://test.com",
        "year": 1990,
    }

    def generate_document(self, index, **kwargs):
        """Generate document data."""
        publication_year = kwargs.get("publication_year", str(randint(1700, 2020)))
        imprint = random.choice(self.IMPRINTS)
        isbn = random.choice(self.ISBNS)
        n_authors = randint(1, len(self.AUTHORS))
        obj = {
            "pid": self.create_pid(),
            "title": lorem.sentence(),
            "cover_metadata": {"ISBN": isbn, "urls": {}},
            "copyrights": [self.COPYRIGHTS],
            "authors": random.sample(self.AUTHORS, n_authors),
            "abstract": "{}".format(lorem.text()),
            "document_type": random.choice(Document.DOCUMENT_TYPES),
            "created_by": {"type": "script", "value": "demo"},
            "languages": [
                lang["key"]
                for lang in random.sample(self.holder.languages, randint(1, 3))
            ],
            "table_of_content": ["{}".format(lorem.sentence())],
            "note": "{}".format(lorem.text()),
            "tags": [
                tag["key"]
                for tag in random.sample(
                    self.holder.tags, randint(1, len(self.holder.tags) - 1)
                )
            ],
            "edition": str(index),
            "keywords": [{"source": lorem.sentence(), "value": lorem.sentence()}],
            "conference_info": self.CONFERENCE_INFO,
            "number_of_pages": str(random.randint(0, 300)),
            "identifiers": [{"scheme": "ISBN", "value": isbn}],
            "alternative_identifiers": [{"scheme": "ARXIV", "value": "1234.1234"}],
            "imprint": {
                **imprint,
                "date": "{}-08-02".format(publication_year),
            },
            "licenses": [self.LICENSE],
            "publication_year": publication_year,
            "subjects": [{"value": "515.353", "scheme": "Dewey"}],
            "urls": [
                {
                    "description": "{}".format(lorem.sentence()),
                    "value": "http://random.url",
                }
            ],
            "restricted": False,
        }
        obj.update(**kwargs)
        return obj

    def generate(self):
        """Generate."""
        size = self.holder.documents["total"]

        objs = [self.generate_document(index) for index in range(1, size + 1)]

        # Generate periodical issues
        volume = 1
        issue = 1
        publication_year = randint(1700, 2000)
        for index in range(1, 11):
            objs.append(
                self.generate_document(
                    index,
                    document_type=self.SERIAL_ISSUE,
                    title="Volume {} Issue {}".format(volume, issue),
                    publication_year=str(publication_year),
                )
            )
            if issue == 3:
                issue = 1
                volume += 1
                publication_year += 1
            else:
                issue += 1

        demo_data_dir = os.path.join(CURRENT_DIR, "demo_data")
        with open(os.path.join(demo_data_dir, "documents.json")) as f:
            demo_data = json.loads(f.read())

        for doc in demo_data:
            doc["pid"] = self.create_pid()

        objs.extend(demo_data)
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
        transaction_date = arrow.utcnow() - timedelta(days=randint(20, 30))
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
        loc_pid, _ = current_app_ils.get_default_location_pid
        items = self.holder.items["objs"]
        patrons_pids = self.holder.patrons_pids
        librarian_pid = self.holder.librarian_pid
        doc_pids = self.holder.pids("documents", "pid")
        all_delivery_methods = list(
            current_app.config["ILS_CIRCULATION_DELIVERY_METHODS"].keys()
        )
        delivery = all_delivery_methods[randint(0, 1)]

        items_on_loan = []
        for pid in range(1, size + 1):
            item = self._get_item_can_circulate(items)
            item_state = self._get_valid_status(item, items_on_loan)
            patron_id = random.choice(patrons_pids)

            loan = {
                "pid": self.create_pid(),
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
                loan["item_pid"] = {
                    "type": ITEM_PID_TYPE,
                    "value": item["pid"],
                }
                items_on_loan.append(item["pid"])

            self.holder.loans["objs"].append(loan)

    def persist(self):
        """Persist."""
        recs = []
        for obj in self.holder.loans["objs"]:
            rec = self._persist(CIRCULATION_LOAN_PID_TYPE, "pid", Loan.create(obj))
            recs.append(rec)
        db.session.commit()
        return recs


class SeriesGenerator(Generator):
    """Series Generator."""

    MODE_OF_ISSUANCE = Series.MODE_OF_ISSUANCE

    def random_issn(self):
        """Generate a random ISSN."""
        random_4digit = [randint(1000, 9999), randint(1000, 9999)]
        return "-".join(str(r) for r in random_4digit)

    def random_multipart(self, obj, index):
        """Randomize multipart data."""
        obj["edition"] = str(index)
        for _ in range(randint(1, 2)):
            obj["identifiers"].append(
                dict(scheme="ISBN", value=random.choice(DocumentGenerator.ISBNS))
            )

    def random_serial(self, obj):
        """Randomize serial data."""
        for _ in range(randint(1, 3)):
            obj["identifiers"].append(
                dict(
                    material=random.choice(["ONLINE", "PRINT"]),
                    scheme="ISSN",
                    value=self.random_issn(),
                )
            )
        obj["abbreviated_title"] = obj["title"].split()[0]
        obj["alternative_titles"] = [
            dict(value=obj["title"], type="SUBTITLE"),
            dict(value=obj["title"].split()[0], type="ABBREVIATION"),
            dict(
                value=obj["title"],
                type="TRANSLATED_TITLE",
                language="FRA",
            ),
        ]
        obj["internal_notes"] = [
            dict(field="title", user="Test", value="Internal test note.")
        ]
        obj["notes"] = lorem.text()
        obj["publisher"] = lorem.sentence().split()[0]
        obj["access_urls"] = [
            dict(
                open_access=True,
                description=lorem.sentence(),
                value="https://home.cern/",
            )
            for _ in range(1, 3)
        ]
        obj["urls"] = [
            dict(description=lorem.sentence(), value="https://home.cern/")
            for _ in range(1, 3)
        ]

    def generate_minimal(self, objs):
        """Generate a series with only the required fields."""
        objs.append(
            {
                "pid": self.create_pid(),
                "mode_of_issuance": "SERIAL",
                "title": "Minimal Series",
            }
        )

    def generate(self):
        """Generate."""
        size = self.holder.series["total"]
        objs = []
        self.generate_minimal(objs)
        for index in range(1, size + 1):
            moi = random.choice(self.MODE_OF_ISSUANCE)
            authors = random.sample(
                DocumentGenerator.AUTHORS, len(DocumentGenerator.AUTHORS)
            )
            obj = {
                "pid": self.create_pid(),
                "cover_metadata": {
                    "ISBN": random.choice(DocumentGenerator.ISBNS),
                    "urls": {},
                },
                "mode_of_issuance": moi,
                "title": lorem.sentence(),
                "authors": [author["full_name"] for author in authors],
                "abstract": lorem.text(),
                "languages": [
                    lang["key"]
                    for lang in random.sample(self.holder.languages, randint(1, 3))
                ],
                "identifiers": [],
                "created_by": {"type": "script", "value": "demo"},
                "tags": [
                    tag["key"]
                    for tag in random.sample(
                        self.holder.tags, randint(1, len(self.holder.tags) - 1)
                    )
                ],
                "keywords": [{"source": lorem.sentence(), "value": lorem.sentence()}],
                "series_type": random.choice(Series.SERIES_TYPES),
            }
            if moi == "SERIAL":
                self.random_serial(obj)
            elif moi == "MULTIPART_MONOGRAPH":
                self.random_multipart(obj, index)
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
            docs = [doc for doc in documents if doc["document_type"] != "SERIAL_ISSUE"]
            return random.sample(docs, randint(1, min(5, len(docs))))

        objs = self.holder.related_records["objs"]
        serial_parent = self.random_series(series, "SERIAL")
        multipart_parent = self.random_series(series, "MULTIPART_MONOGRAPH")
        multipart_children = random_docs()

        serial_children = []
        for document in documents:
            if document["document_type"] == "SERIAL_ISSUE":
                serial_children.append(document)

        objs.append(serial_parent)
        rr = RecordRelationsParentChild()
        serial_relation = Relation.get_relation_by_name("serial")
        multipart_relation = Relation.get_relation_by_name("multipart_monograph")
        re_volume = re.compile(r"Volume (?P<volume>\d+)", re.IGNORECASE)
        for index, child in enumerate(serial_children):
            m = re_volume.match(child["title"])
            volume = str(index + 1)
            if m:
                volume = m["volume"]
            rr.add(
                serial_parent,
                child,
                relation_type=serial_relation,
                volume=volume,
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
            random_docs = random.sample(documents, randint(2, min(5, len(documents))))

            for record in random_docs:
                for doc in documents:
                    try:
                        rr.add(doc, record, relation_type=relation_type)
                        break
                    except RecordRelationsError:
                        continue
                objs.append(record)

            if relation_type.name == "edition":
                record = self.random_series(series, "MULTIPART_MONOGRAPH")
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

    def random_document_pid(self):
        """Get a random document PID."""
        return random.choice(self.holder.pids("documents", "pid"))

    def random_pending_borrowing_request(self):
        """Get a random document PID."""
        return random.choice(self.holder.pids("pending_borrowing_requests", "pid"))

    def generate(self):
        """Generate."""
        size = self.holder.document_requests["total"]
        objs = []
        for pid in range(1, size + 1):
            state = random.choice(DocumentRequest.STATES)
            obj = {
                "pid": self.create_pid(),
                "state": state,
                "patron_pid": random.choice(self.holder.patrons_pids),
                "title": lorem.sentence(),
                "authors": lorem.sentence(),
                "publication_year": randint(1700, 2019),
                "request_type": "LOAN",
                "medium": "PAPER",
            }
            if state == "DECLINED":
                obj["decline_reason"] = random.choice(DocumentRequest.DECLINE_TYPES)
                if obj["decline_reason"] == "IN_CATALOG":
                    obj["document_pid"] = self.random_document_pid()
            elif state == "ACCEPTED":
                obj["document_pid"] = self.random_document_pid()
                obj["physical_item_provider"] = {
                    "pid": self.random_pending_borrowing_request(),
                    "pid_type": BORROWING_REQUEST_PID_TYPE,
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


class LibraryGenerator(Generator):
    """Location Generator."""

    def random_name(self):
        """Generate random name."""
        parts = lorem.sentence().split()
        return " ".join(parts[: min(randint(1, 2), len(parts))])

    def generate(self):
        """Generate."""
        size = self.holder.libraries["total"]
        objs = []
        for pid in range(1, size + 1):
            obj = {
                "pid": self.create_pid(),
                "name": self.random_name(),
                "address": "CERN\n1211 Geneva 23\nSwitzerland",
                "email": "visits.service@cern.ch",
                "phone": "+41 (0) 22 76 776 76",
                "notes": lorem.sentence(),
                "type": "LIBRARY",
            }
            objs.append(obj)

        self.holder.libraries["objs"] = objs

    def persist(self):
        """Persist."""
        recs = []
        for obj in self.holder.libraries["objs"]:
            rec = self._persist(PROVIDER_PID_TYPE, "pid", Provider.create(obj))
            recs.append(rec)
        db.session.commit()
        return recs


class BorrowingRequestGenerator(Generator):
    """Borrowing requests generator."""

    def random_date(self, start, end):
        """Generate random date between two dates."""
        delta = end - start
        int_delta = (delta.days * 24 * 3600) + delta.seconds
        return start + timedelta(seconds=random.randrange(int_delta))

    def random_document_pid(self):
        """Get a random document PID."""
        return random.choice(self.holder.pids("documents", "pid"))

    def random_provider_pid(self):
        """Get a random provider PID if the state is ACCEPTED."""
        return random.choice(self.holder.pids("libraries", "pid"))

    def random_price(self, currency, min_value=10.0):
        """Generate random price."""
        return {
            "currency": currency,
            "value": round(min_value + random.random() * 100, 2),
        }

    def generate(self):
        """Generate."""
        size = self.holder.borrowing_requests["total"]
        objs = []
        now = datetime.now()
        for pid in range(1, size + 1):
            status = random.choice(BorrowingRequest.STATUSES)
            obj = {
                "pid": self.create_pid(),
                "status": status,
                "provider_pid": self.random_provider_pid(),
                "document_pid": self.random_document_pid(),
                "patron_pid": random.choice(self.holder.patrons_pids),
                "type": "E-BOOK",
                "notes": lorem.sentence(),
            }

            t = now + timedelta(days=400)
            if obj["status"] != "PENDING":
                obj["request_date"] = self.random_date(now, t).date().isoformat()
                obj["expected_delivery_date"] = (
                    self.random_date(now, t).date().isoformat()
                )
                obj["received_date"] = self.random_date(now, t).date().isoformat()
                obj["due_date"] = self.random_date(now, t).date().isoformat()
                obj["payment"] = {
                    "debit_cost_main_currency": self.random_price("CHF"),
                    "debit_cost": self.random_price("EUR"),
                    "debit_date": self.random_date(now, t).date().isoformat(),
                    "debit_note": "Charged in euro",
                    "mode": "CREDIT_CARD",
                }
                obj["total_main_currency"] = self.random_price("CHF")
                obj["total"] = self.random_price("EUR")

            if obj["status"] == "CANCELLED":
                obj["cancel_reason"] = lorem.sentence()

            objs.append(obj)

            if status == "PENDING":
                self.holder.pending_borrowing_requests["objs"] = objs

        self.holder.borrowing_requests["objs"] = objs

    def persist(self):
        """Persist."""
        recs = []
        for obj in self.holder.borrowing_requests["objs"]:
            rec = self._persist(
                BORROWING_REQUEST_PID_TYPE, "pid", BorrowingRequest.create(obj)
            )
            recs.append(rec)
        db.session.commit()
        return recs


class VendorGenerator(Generator):
    """Provider generator."""

    def random_name(self):
        """Generate random name."""
        parts = lorem.sentence().split()
        return " ".join(parts[: min(randint(1, 2), len(parts))])

    def generate(self):
        """Generate."""
        size = self.holder.vendors["total"]
        objs = []
        for pid in range(1, size + 1):
            obj = {
                "pid": self.create_pid(),
                "name": self.random_name(),
                "address": "CERN\n1211 Geneva 23\nSwitzerland",
                "email": "visits.service@cern.ch",
                "phone": "+41 (0) 22 76 776 76",
                "notes": lorem.sentence(),
                "type": "VENDOR",
            }
            objs.append(obj)

        self.holder.vendors["objs"] = objs

    def persist(self):
        """Persist."""
        recs = []
        for obj in self.holder.vendors["objs"]:
            rec = self._persist(PROVIDER_PID_TYPE, "pid", Provider.create(obj))
            recs.append(rec)
        db.session.commit()
        return recs


class OrderGenerator(Generator):
    """Order generator."""

    def random_date(self, start, end):
        """Generate random date between two dates."""
        delta = end - start
        int_delta = (delta.days * 24 * 3600) + delta.seconds
        return start + timedelta(seconds=random.randrange(int_delta))

    def random_price(self, currency, min_value=10.0):
        """Generate random price."""
        return {
            "currency": currency,
            "value": round(min_value + random.random() * 100, 2),
        }

    def random_order_lines(self, status):
        """Generate random order lines."""
        doc_pids = self.holder.pids("documents", "pid")
        count = randint(1, 6)
        doc_pids = random.sample(doc_pids, count)
        for i in range(count):
            ordered = randint(1, 5)
            yield dict(
                copies_ordered=ordered,
                copies_received=randint(1, ordered) if status == "RECEIVED" else 0,
                document_pid=doc_pids[i],
                is_donation=random.choice([True, False]),
                is_patron_suggestion=random.choice([True, False]),
                medium="PAPER",
                notes=lorem.sentence(),
                patron_pid=random.choice(self.holder.patrons_pids),
                payment_mode="CREDIT_CARD",
                purchase_type="PERPETUAL",
                recipient="PATRON",
                total_price=self.random_price("EUR"),
                unit_price=self.random_price("EUR"),
            )

    def generate(self):
        """Generate."""
        size = self.holder.orders["total"]
        objs = []
        now = datetime.now()
        for pid in range(1, size + 1):
            order_date = self.random_date(datetime(2010, 1, 1), now)
            status = random.choice(Order.STATUSES)
            order_lines = list(self.random_order_lines(status))
            obj = {
                "pid": self.create_pid(),
                "created_by_pid": self.holder.librarian_pid,
                "provider_pid": random.choice(self.holder.vendors["objs"])["pid"],
                "status": status,
                "order_date": order_date.date().isoformat(),
                "notes": lorem.sentence(),
                "grand_total": self.random_price("EUR", min_value=50.0),
                "grand_total_main_currency": self.random_price("CHF", min_value=60.0),
                "funds": list(set(lorem.sentence().split())),
                "payment": {
                    "mode": "CREDIT_CARD",
                },
                "order_lines": order_lines,
            }
            obj["expected_delivery_date"] = (
                self.random_date(now, now + timedelta(days=400)).date().isoformat()
            )
            if obj["status"] == "CANCELLED":
                obj["cancel_reason"] = lorem.sentence()
            elif obj["status"] == "RECEIVED":
                obj["received_date"] = (
                    self.random_date(order_date, now).date().isoformat()
                )
            objs.append(obj)

        self.holder.orders["objs"] = objs

    def persist(self):
        """Persist."""
        recs = []
        for obj in self.holder.orders["objs"]:
            rec = self._persist(ORDER_PID_TYPE, "pid", Order.create(obj))
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
@click.option("--internal-locations", "n_intlocs", default=10)
@click.option("--series", "n_series", default=10)
@click.option("--document-requests", "n_document_requests", default=10)
@click.option("--vendors", "n_vendors", default=10)
@click.option("--orders", "n_orders", default=30)
@click.option("--libraries", "n_libraries", default=10)
@click.option("--borrowing-requests", "n_borrowing_requests", default=10)
@click.option("--verbose", is_flag=True, help="Verbose output.")
@click.option("--skip-admin", "skip_admin", is_flag=True)
@with_appcontext
def data(
    n_docs,
    n_items,
    n_eitems,
    n_loans,
    n_intlocs,
    n_series,
    n_document_requests,
    n_vendors,
    n_orders,
    n_libraries,
    n_borrowing_requests,
    verbose,
    skip_admin=False,
):
    """Insert demo data."""
    click.secho("Generating demo data", fg="yellow")

    indexer = RecordIndexer()

    vocabulary_dir = os.path.join(CURRENT_DIR, "vocabularies", "data")
    with open(os.path.join(vocabulary_dir, "tags.json")) as f:
        tags = json.loads(f.read())

    languages = [
        {"key": "AAR", "text": "Afar (aar)", "type": "language"},
        {"key": "ABK", "text": "Abkhazian (abk)", "type": "language"},
        {"key": "AFR", "text": "Afrikaans (afr)", "type": "language"},
        {"key": "III", "text": "Sichuan Yi (iii)", "type": "language"},
        {"key": "IKU", "text": "Inuktitut (iku)", "type": "language"},
        {"key": "ILE", "text": "Interlingue (ile)", "type": "language"},
        {
            "key": "INA",
            "text": "Interlingua (International Auxiliary Language \
                Association) (ina)",
            "type": "language",
        },
        {"key": "IND", "text": "Indonesian (ind)", "type": "language"},
        {"key": "IPK", "text": "Inupiaq (ipk)", "type": "language"},
        {"key": "ISL", "text": "Icelandic (isl)", "type": "language"},
        {"key": "ITA", "text": "Italian (ita)", "type": "language"},
        {"key": "JAV", "text": "Javanese (jav)", "type": "language"},
    ]

    holder = Holder(
        patrons_pids=["1", "2", "5", "4"],
        languages=languages,
        librarian_pid="3",
        tags=tags,
        total_intloc=n_intlocs,
        total_items=n_items,
        total_eitems=n_eitems,
        total_documents=n_docs,
        total_loans=n_loans,
        total_series=n_series,
        total_document_requests=n_document_requests,
        total_vendors=n_vendors,
        total_orders=n_orders,
        total_borrowing_requests=n_borrowing_requests,
        total_libraries=n_libraries,
    )

    # Create roles to restrict access
    _run_command("roles create admin", verbose)
    _run_command("roles create librarian", verbose)
    _run_command("roles create librarian-readonly", verbose)

    # Create users
    patron1_profile = {"full_name": "Yannic Vilma"}
    _run_command(
        f"users create patron1@test.ch -a --password=123456 --profile '{json.dumps(patron1_profile)}'",
        verbose,
    )

    patron2_profile = {"full_name": "Diana Adi"}
    _run_command(
        f"users create patron2@test.ch -a --password=123456 --profile '{json.dumps(patron2_profile)}'",
        verbose,
    )

    librarian_profile = {"full_name": "Hector Nabu"}
    _run_command(
        f"users create librarian@test.ch -a --password=123456 --profile '{json.dumps(librarian_profile)}'",
        verbose,
    )

    readonly_profile = {"full_name": "Ro Only"}
    _run_command(
        f"users create readonly@test.ch -a --password=123456 --profile '{json.dumps(readonly_profile)}'",
        verbose,
    )

    patron3_profile = {"full_name": "Medrod Tara"}
    _run_command(
        f"users create patron3@test.ch -a --password=123456 --profile '{json.dumps(patron3_profile)}'",
        verbose,
    )

    patron4_profile = {"full_name": "Devi Cupid"}
    _run_command(
        f"users create patron4@test.ch -a --password=123456 --profile '{json.dumps(patron4_profile)}'",
        verbose,
    )

    if not skip_admin:
        admin_profile = {"full_name": "Zeki Ryoichi"}
        _run_command(
            f"users create admin@test.ch -a --password=123456 --profile '{json.dumps(admin_profile)}'",
            verbose,
        )
        _run_command("roles add admin@test.ch admin", verbose)

    # assign roles
    _run_command("roles add librarian@test.ch librarian", verbose)
    _run_command("roles add readonly@test.ch librarian-readonly", verbose)

    # Index vocabularies
    vocabularies_dir = os.path.join(CURRENT_DIR, "vocabularies", "data")
    json_files = " ".join(
        os.path.join(vocabularies_dir, name)
        for name in os.listdir(vocabularies_dir)
        if name.endswith(".json")
    )
    _run_command("vocabulary index json --force {}".format(json_files), verbose)
    _run_command("vocabulary index opendefinition spdx --force", verbose)
    _run_command("vocabulary index opendefinition opendefinition --force", verbose)

    # index languages
    _run_command("vocabulary index languages --force", verbose)

    # Assign actions
    _run_command("access allow superuser-access role admin", verbose)
    _run_command("access allow ils-backoffice-access role librarian", verbose)
    _run_command(
        "access allow ils-backoffice-readonly-access role librarian-readonly", verbose
    )

    # Create demo locations
    click.echo("Creating locations and internal locations...")
    fake_holder = type("FakeHolder", (object,), {"location": {}})
    loc_generator = LocationGenerator(fake_holder, minter)
    loc_generator.generate()
    rec = loc_generator.persist()
    indexer.index(rec)
    current_search.flush_and_refresh(index="*")

    # Index patrons
    _run_command("patrons index", verbose)

    # Create files location
    _run_command("files location --default ils /tmp/ils-files", verbose)

    # Create static pages
    _run_command("fixtures pages", verbose)

    # InternalLocations
    intlocs_generator = InternalLocationGenerator(holder, minter)
    intlocs_generator.generate()
    rec_intlocs = intlocs_generator.persist()

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

    # Libraries
    click.echo("Creating ILL external libraries...")
    library_generator = LibraryGenerator(holder, minter)
    library_generator.generate()
    rec_libraries = library_generator.persist()

    # Borrowing requests
    click.echo("Creating ILL borrowing requests...")
    borrowing_requests_generator = BorrowingRequestGenerator(holder, minter)
    borrowing_requests_generator.generate()
    rec_borrowing_requests = borrowing_requests_generator.persist()

    # Document requests
    click.echo("Creating document requests...")
    document_requests_generator = DocumentRequestGenerator(holder, minter)
    document_requests_generator.generate()
    rec_requests = document_requests_generator.persist()

    # Vendors
    click.echo("Creating acquisition vendors...")
    vendor_generator = VendorGenerator(holder, minter)
    vendor_generator.generate()
    rec_vendors = vendor_generator.persist()

    # Orders
    click.echo("Creating acquisition orders...")
    order_generator = OrderGenerator(holder, minter)
    order_generator.generate()
    rec_orders = order_generator.persist()

    # index internal locations
    indexer.bulk_index([str(r.id) for r in rec_intlocs])
    click.echo("Sent to the indexing queue {0} locations".format(len(rec_intlocs)))

    # index series
    indexer.bulk_index([str(r.id) for r in rec_series])
    click.echo("Sent to the indexing queue {0} series".format(len(rec_series)))

    # index loans
    indexer.bulk_index([str(r.id) for r in rec_loans])
    click.echo("Sent to the indexing queue {0} loans".format(len(rec_loans)))

    click.secho("Now indexing...", fg="green")
    # process queue so items can resolve circulation status correctly
    indexer.process_bulk_queue()
    current_search.flush_and_refresh(index="*")

    # index eitems
    indexer.bulk_index([str(r.id) for r in rec_eitems])
    click.echo("Sent to the indexing queue {0} eitems".format(len(rec_eitems)))

    # index items
    indexer.bulk_index([str(r.id) for r in rec_items])
    click.echo("Sent to the indexing queue {0} items".format(len(rec_items)))

    click.secho("Now indexing...", fg="green")
    # process queue so documents can resolve circulation correctly
    indexer.process_bulk_queue()
    current_search.flush_and_refresh(index="*")

    # index libraries
    indexer.bulk_index([str(r.id) for r in rec_libraries])
    click.echo("Sent to the indexing queue {0} libraries".format(len(rec_libraries)))

    # index borrowing requests
    indexer.bulk_index([str(r.id) for r in rec_borrowing_requests])
    click.echo(
        "Sent to the indexing queue {0} borrowing requests".format(
            len(rec_borrowing_requests)
        )
    )

    click.secho("Now indexing...", fg="green")
    indexer.process_bulk_queue()
    current_search.flush_and_refresh(index="*")

    # index documents
    indexer.bulk_index([str(r.id) for r in rec_docs])
    click.echo("Sent to the indexing queue {0} documents".format(len(rec_docs)))

    # index document requests
    indexer.bulk_index([str(r.id) for r in rec_requests])
    click.echo(
        "Sent to the indexing queue {0} document requests".format(len(rec_requests))
    )

    # index loans again
    indexer.bulk_index([str(r.id) for r in rec_loans])
    click.echo("Sent to the indexing queue {0} loans".format(len(rec_loans)))

    # index items again
    indexer.bulk_index([str(r.id) for r in rec_items])
    click.echo("Sent to the indexing queue {0} items".format(len(rec_items)))

    # index vendors
    indexer.bulk_index([str(r.id) for r in rec_vendors])
    click.echo("Sent to the indexing queue {0} vendors".format(len(rec_vendors)))

    # index orders
    indexer.bulk_index([str(r.id) for r in rec_orders])
    click.echo("Sent to the indexing queue {0} orders".format(len(rec_orders)))

    click.secho("Now indexing...", fg="green")
    indexer.process_bulk_queue()
    current_search.flush_and_refresh(index="*")


def _run_command(command, verbose, catch_exceptions=False):
    from invenio_base.app import create_cli

    click.secho("ils {}...".format(command), fg="green")

    cli = create_cli()
    runner = current_app.test_cli_runner()

    res = runner.invoke(cli, command, catch_exceptions=catch_exceptions)
    if verbose:
        click.secho(res.output)


@click.command()
@click.option("--recreate-db", is_flag=True, help="Recreating DB.")
@click.option("--skip-demo-data", is_flag=True, help="Skip creating demo data.")
@click.option("--verbose", is_flag=True, help="Verbose output.")
@click.option("--skip-admin", "skip_admin", is_flag=True)
@with_appcontext
def setup(
    recreate_db,
    skip_demo_data,
    verbose,
    skip_admin=False,
):
    """ILS setup command."""
    import redis
    from flask import current_app

    click.secho("ils setup started...", fg="blue")

    # Clean redis
    redis.StrictRedis.from_url(current_app.config["CACHE_REDIS_URL"]).flushall()
    click.secho("redis cache cleared...", fg="red")

    # Remove and create db and indexes
    if recreate_db:
        _run_command("db destroy --yes-i-know", verbose=verbose, catch_exceptions=True)
        _run_command("db init", verbose)
    else:
        _run_command("db drop --yes-i-know", verbose)
    _run_command("db create", verbose)
    _run_command("index destroy --force --yes-i-know", verbose)
    _run_command("index init --force", verbose)
    _run_command("index queue init purge", verbose)
    # Generate demo data
    if not skip_demo_data:
        cmd = "demo data {}".format("--verbose" if verbose else "")
        cmd = f'{cmd} {"--skip-admin" if skip_admin else ""}'
        _run_command(cmd, verbose)

    click.secho("ils setup finished successfully", fg="blue")


@click.group()
def fixtures():
    """Create initial data and demo records."""


@fixtures.command()
@with_appcontext
def pages():
    """Register static pages."""

    def get_page_content(page):
        with importlib.resources.files("invenio_app_ils").joinpath(
            "static_pages", page
        ).open("rb") as f:
            return f.read().decode("utf8")

    pages_data = [
        {
            "url": "/about",
            "title": "About",
            "description": "About",
            "content": "InvenioILS about page",
        },
        {
            "url": "/contact",
            "title": "Contact",
            "description": "Contact",
            "content": (
                "You can contact InvenioILS developers on "
                '<a href="https://gitter.im/inveniosoftware/invenio">'
                "our chatroom</a>"
            ),
        },
        {
            "url": "/guide/search",
            "title": "Search guide",
            "description": "Search guide",
            "template": "search_guide.html",
        },
    ]

    supported_languages = current_i18n.get_languages()

    for entry in pages_data:
        url = entry["url"]
        for lang in supported_languages:
            lang_code = lang[0]
            try:
                current_pages_service.read_by_url(system_identity, url, lang_code)
            except PageNotFoundError:
                page = {
                    "url": url,
                    "title": entry.get("title", ""),
                    "description": entry.get("description", ""),
                    "lang": lang_code,
                    "template_name": current_app.config["PAGES_DEFAULT_TEMPLATE"],
                    "content": (
                        get_page_content(entry["template"])
                        if entry.get("template")
                        else entry.get("content", "")
                    ),
                }
                current_pages_service.create(system_identity, page)

    click.echo("Static pages created :)")
