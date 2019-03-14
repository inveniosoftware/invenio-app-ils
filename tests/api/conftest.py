# -*- coding: utf-8 -*-
#
# Copyright (C) 2018 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""Pytest fixtures and plugins for the API application."""

from __future__ import absolute_import, print_function

from functools import partial

import mock
import pytest
from flask_mail import Message
from invenio_app.factory import create_api
from invenio_circulation.api import Loan
from invenio_circulation.pidstore.pids import CIRCULATION_LOAN_PID_TYPE
from invenio_indexer.api import RecordIndexer
from invenio_search import current_search

from invenio_app_ils.circulation.mail.factory import loan_message_factory, \
    message_factory
from invenio_app_ils.circulation.receivers import \
    index_record_after_loan_change
from invenio_app_ils.records.api import Document, InternalLocation, Item, \
    Keyword, Location

from ..helpers import load_json_from_datadir
from .helpers import document_ref_builder, internal_location_ref_builder, \
    mint_record_pid

from invenio_app_ils.pidstore.pids import (  # isort:skip
    DOCUMENT_PID_TYPE,
    INTERNAL_LOCATION_PID_TYPE,
    ITEM_PID_TYPE,
    KEYWORD_PID_TYPE,
    LOCATION_PID_TYPE,
)


@pytest.fixture()
def item_record(app):
    """Fixture to return an item payload."""
    return {
        "item_pid": "itemid-1",
        "document_pid": "docid-1",
        "document": {"$ref": document_ref_builder(app, "itemid-1")},
        "barcode": "123456789",
        "title": "Test item x",
        "internal_location_pid": "ilocid-1",
        "internal_location": {
            "$ref": internal_location_ref_builder(app, "itemid-1")
        },
        "medium": "NOT_SPECIFIED",
        "status": "LOANABLE",
        "circulation_restriction": "NO_RESTRICTION"
    }


@pytest.fixture(scope="module")
def create_app():
    """Create test app."""
    return create_api


@pytest.fixture()
def json_headers():
    """JSON headers."""
    return [
        ("Content-Type", "application/json"),
        ("Accept", "application/json"),
    ]


@pytest.fixture()
def json_patch_headers():
    """JSON headers for Invenio Records REST PATCH api calls."""
    return [
        ("Content-Type", "application/json-patch+json"),
        ("Accept", "application/json"),
    ]


@pytest.fixture()
def testdata(app, db, es_clear):
    """Create, index and return test data."""
    indexer = RecordIndexer()

    locations = load_json_from_datadir("locations.json")
    for location in locations:
        record = Location.create(location)
        mint_record_pid(LOCATION_PID_TYPE, Location.pid_field, record)
        record.commit()
        db.session.commit()
        indexer.index(record)

    internal_locations = load_json_from_datadir("internal_locations.json")
    iloc_records = []
    for internal_location in internal_locations:
        record = InternalLocation.create(internal_location)
        mint_record_pid(
            INTERNAL_LOCATION_PID_TYPE, InternalLocation.pid_field, record
        )
        record.commit()
        iloc_records.append(record)
        db.session.commit()
        indexer.index(record)

    documents = load_json_from_datadir("documents.json")
    for doc in documents:
        record = Document.create(doc)
        mint_record_pid(DOCUMENT_PID_TYPE, Document.pid_field, record)
        record.commit()
        db.session.commit()
        indexer.index(record)

    items = load_json_from_datadir("items.json")
    for item in items:
        record = Item.create(item)
        mint_record_pid(ITEM_PID_TYPE, Item.pid_field, record)
        record.commit()
        db.session.commit()
        indexer.index(record)

    loans = load_json_from_datadir("loans.json")
    for loan in loans:
        record = Loan.create(loan)
        mint_record_pid(CIRCULATION_LOAN_PID_TYPE, Loan.pid_field, record)
        record.commit()
        db.session.commit()
        indexer.index(record)
        # re-index item attached to the loan
        index_record_after_loan_change(app, record)

    keywords = load_json_from_datadir("keywords.json")
    for keyword in keywords:
        record = Keyword.create(keyword)
        mint_record_pid(KEYWORD_PID_TYPE, Keyword.pid_field, record)
        record.commit()
        db.session.commit()
        indexer.index(record)

    # flush all indices after indexing, otherwise ES won't be ready for tests
    current_search.flush_and_refresh(index=None)

    return {
        "locations": locations,
        "documents": documents,
        "items": items,
        "loans": loans,
        "keywords": keywords,
    }


@pytest.fixture()
def loan_params():
    """Params for API REST payload."""
    return dict(
        transaction_user_pid="user_pid",
        patron_pid="1",
        document_pid="docid-1",
        item_pid="itemid-2",
        transaction_location_pid="locid-2",
        transaction_date="2018-02-01T09:30:00+02:00",
    )


@pytest.fixture()
def loan_msg_factory():
    """Return a loan message factory."""
    return loan_message_factory()


@pytest.fixture()
def example_message_factory():
    """A basic functional test message loader."""
    def loader(subject, body):
        return Message(
            sender="test@test.ch",
            subject=subject,
            body=body
        )
    return partial(message_factory, loader)
