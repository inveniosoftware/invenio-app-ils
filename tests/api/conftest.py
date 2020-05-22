# -*- coding: utf-8 -*-
#
# Copyright (C) 2018-2020 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""Pytest fixtures and plugins for the API application."""

from __future__ import absolute_import, print_function

import tempfile
from functools import partial

import pytest
from flask_mail import Message
from invenio_app.factory import create_api
from invenio_circulation.api import Loan
from invenio_circulation.pidstore.pids import CIRCULATION_LOAN_PID_TYPE
from invenio_indexer.api import RecordIndexer
from invenio_search import current_search

from invenio_app_ils.acquisition.api import ORDER_PID_TYPE, VENDOR_PID_TYPE, \
    Order, Vendor
from invenio_app_ils.circulation.mail.factory import message_factory
from invenio_app_ils.document_requests.api import DOCUMENT_REQUEST_PID_TYPE, \
    DocumentRequest
from invenio_app_ils.documents.api import DOCUMENT_PID_TYPE, Document
from invenio_app_ils.ill.api import BORROWING_REQUEST_PID_TYPE, \
    LIBRARY_PID_TYPE, BorrowingRequest, Library
from invenio_app_ils.pidstore.pids import EITEM_PID_TYPE, \
    INTERNAL_LOCATION_PID_TYPE, ITEM_PID_TYPE, LOCATION_PID_TYPE, \
    SERIES_PID_TYPE
from invenio_app_ils.records.api import EItem, InternalLocation, Item, \
    Location, Series

from ..helpers import load_json_from_datadir
from .helpers import document_ref_builder, internal_location_ref_builder, \
    mint_record_pid


@pytest.fixture(scope="module")
def app_config(app_config):
    """Get app config."""
    tests_config = {
        "ACCOUNTS_SESSION_REDIS_URL": "",  # in-memory
        "RATELIMIT_GUEST_USER": "1000 per minute",
        "RATELIMIT_AUTHENTICATED_USER": "1000 per minute",
        "CIRCULATION_TRANSACTION_USER_VALIDATOR": lambda x: True,
    }
    app_config.update(tests_config)
    return app_config


@pytest.fixture(scope="module")
def create_app():
    """Create test app."""
    return create_api


@pytest.fixture(scope="module")
def json_headers():
    """JSON headers."""
    return [
        ("Content-Type", "application/json"),
        ("Accept", "application/json"),
    ]


def _records_create_and_index(db, objs, cls, pid_type):
    """Create records and index."""
    indexer = RecordIndexer()
    recs = []
    for obj in objs:
        record = cls.create(obj)
        mint_record_pid(pid_type, "pid", record)
        record.commit()
        recs.append(record)
    db.session.commit()
    for rec in recs:
        indexer.index(rec)


@pytest.fixture()
def testdata(app, db, es_clear, users):
    """Create, index and return test data."""
    locations = load_json_from_datadir("locations.json")
    _records_create_and_index(db, locations, Location, LOCATION_PID_TYPE)

    int_locs = load_json_from_datadir("internal_locations.json")
    _records_create_and_index(
        db, int_locs, InternalLocation, INTERNAL_LOCATION_PID_TYPE
    )

    series_data = load_json_from_datadir("series.json")
    _records_create_and_index(db, series_data, Series, SERIES_PID_TYPE)

    documents = load_json_from_datadir("documents.json")
    _records_create_and_index(db, documents, Document, DOCUMENT_PID_TYPE)

    items = load_json_from_datadir("items.json")
    _records_create_and_index(db, items, Item, ITEM_PID_TYPE)

    eitems = load_json_from_datadir("eitems.json")
    _records_create_and_index(db, eitems, EItem, EITEM_PID_TYPE)

    loans = load_json_from_datadir("loans.json")
    _records_create_and_index(db, loans, Loan, CIRCULATION_LOAN_PID_TYPE)

    doc_reqs = load_json_from_datadir("document_requests.json")
    _records_create_and_index(
        db, doc_reqs, DocumentRequest, DOCUMENT_REQUEST_PID_TYPE
    )

    acq_vendors = load_json_from_datadir("acq_vendors.json")
    _records_create_and_index(db, acq_vendors, Vendor, VENDOR_PID_TYPE)

    acq_orders = load_json_from_datadir("acq_orders.json")
    _records_create_and_index(db, acq_orders, Order, ORDER_PID_TYPE)

    ill_libraries = load_json_from_datadir("ill_libraries.json")
    _records_create_and_index(db, ill_libraries, Library, LIBRARY_PID_TYPE)

    ill_brw_reqs = load_json_from_datadir("ill_borrowing_requests.json")
    _records_create_and_index(
        db, ill_brw_reqs, BorrowingRequest, BORROWING_REQUEST_PID_TYPE
    )

    # flush all indices after indexing, otherwise ES won't be ready for tests
    current_search.flush_and_refresh(index="*")

    return {
        "document_requests": doc_reqs,
        "documents": documents,
        "internal_locations": int_locs,
        "items": items,
        "loans": loans,
        "locations": locations,
        "series": series_data,
    }


@pytest.fixture(scope="module")
def item_record(app):
    """Fixture to return an Item payload."""
    return {
        "pid": "itemid-1",
        "document_pid": "docid-1",
        "document": {"$ref": document_ref_builder(app, "itemid-1")},
        "barcode": "123456789-1",
        "title": "Test item x",
        "internal_location_pid": "ilocid-1",
        "internal_location": {
            "$ref": internal_location_ref_builder(app, "itemid-1")
        },
        "medium": "NOT_SPECIFIED",
        "status": "CAN_CIRCULATE",
        "circulation_restriction": "NO_RESTRICTION",
    }


@pytest.fixture(scope="module")
def loan_params():
    """Params for API REST payload."""
    return dict(
        transaction_user_pid="4",
        patron_pid="1",
        document_pid="docid-1",
        item_pid=dict(type="pitmid", value="itemid-2"),
        transaction_location_pid="1",
        transaction_date="2018-02-01T09:30:00+02:00",
    )


@pytest.fixture(scope="module")
def example_message_factory():
    """A basic functional test message loader."""

    def loader(subject, body):
        return Message(sender="test@test.ch", subject=subject, body=body)

    return partial(message_factory, loader)


@pytest.fixture()
def testdata_most_loaned(app, db, es_clear):
    """Create, index and return test data for most loans tests."""
    locations = load_json_from_datadir("locations.json")
    _records_create_and_index(db, locations, Location, LOCATION_PID_TYPE)

    int_locs = load_json_from_datadir("internal_locations.json")
    _records_create_and_index(
        db, int_locs, InternalLocation, INTERNAL_LOCATION_PID_TYPE
    )

    series_data = load_json_from_datadir("series.json")
    _records_create_and_index(db, series_data, Series, SERIES_PID_TYPE)

    documents = load_json_from_datadir("documents.json")
    _records_create_and_index(db, documents, Document, DOCUMENT_PID_TYPE)

    items = load_json_from_datadir("items.json")
    _records_create_and_index(db, items, Item, ITEM_PID_TYPE)

    eitems = load_json_from_datadir("eitems.json")
    _records_create_and_index(db, eitems, EItem, EITEM_PID_TYPE)

    loans = load_json_from_datadir("loans_most_loaned.json")
    _records_create_and_index(db, loans, Loan, CIRCULATION_LOAN_PID_TYPE)

    # flush all indices after indexing, otherwise ES won't be ready for tests
    current_search.flush_and_refresh(index="*")

    return {
        "locations": locations,
        "internal_locations": int_locs,
        "documents": documents,
        "items": items,
        "loans": loans,
        "series": series_data,
    }


@pytest.yield_fixture(scope="module")
def bucket(bucket_from_dir):
    """Create temporary bucket fixture."""
    with tempfile.TemporaryDirectory(prefix="ils-test-") as temp_dir:
        bucket = bucket_from_dir(temp_dir)
        yield bucket


@pytest.fixture(scope="module")
def with_access(app):
    """Enable explicit permission check (`_access`)."""
    app.config["ILS_RECORDS_EXPLICIT_PERMISSIONS_ENABLED"] = True
    yield
    app.config["ILS_RECORDS_EXPLICIT_PERMISSIONS_ENABLED"] = False
