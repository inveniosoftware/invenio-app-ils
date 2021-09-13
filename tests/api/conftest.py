# -*- coding: utf-8 -*-
#
# Copyright (C) 2018-2020 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""Pytest fixtures and plugins for the API application."""

import tempfile

import pytest
from invenio_app.factory import create_api
from invenio_circulation.api import Loan
from invenio_circulation.pidstore.pids import CIRCULATION_LOAN_PID_TYPE
from invenio_indexer.api import RecordIndexer
from invenio_search import current_search

from invenio_app_ils.acquisition.api import ORDER_PID_TYPE, Order
from invenio_app_ils.document_requests.api import (
    DOCUMENT_REQUEST_PID_TYPE,
    DocumentRequest,
)
from invenio_app_ils.documents.api import DOCUMENT_PID_TYPE, Document
from invenio_app_ils.eitems.api import EITEM_PID_TYPE, EItem
from invenio_app_ils.ill.api import (
    BORROWING_REQUEST_PID_TYPE,
    BorrowingRequest,
)
from invenio_app_ils.internal_locations.api import (
    INTERNAL_LOCATION_PID_TYPE,
    InternalLocation,
)
from invenio_app_ils.items.api import ITEM_PID_TYPE, Item
from invenio_app_ils.locations.api import LOCATION_PID_TYPE, Location
from invenio_app_ils.providers.api import PROVIDER_PID_TYPE, Provider
from invenio_app_ils.series.api import SERIES_PID_TYPE, Series
from tests.helpers import (
    document_ref_builder,
    internal_location_ref_builder,
    load_json_from_datadir,
    mint_record_pid,
)


@pytest.fixture(scope="module")
def app_config(app_config):
    """Get app config."""
    tests_config = {
        "REST_CSRF_ENABLED": False,
        "ACCOUNTS_SESSION_REDIS_URL": "",  # in-memory
        "RATELIMIT_GUEST_USER": "1000 per minute",
        "RATELIMIT_AUTHENTICATED_USER": "1000 per minute",
        "CIRCULATION_TRANSACTION_USER_VALIDATOR": lambda x: True,
        "EXTEND_LOANS_LOCATION_UPDATED": False,
        "ILS_NOTIFICATIONS_TEMPLATES": {"footer": "footer.html"},
    }
    app_config.update(tests_config)
    return app_config


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


def _create_records(db, objs, cls, pid_type):
    """Create records and index."""
    recs = []
    for obj in objs:
        record = cls.create(obj)
        mint_record_pid(pid_type, "pid", record)
        recs.append(record)
    db.session.commit()
    return recs


@pytest.fixture()
def testdata(app, db, es_clear, users):
    """Create, index and return test data."""
    data = load_json_from_datadir("locations.json")
    locations = _create_records(db, data, Location, LOCATION_PID_TYPE)

    data = load_json_from_datadir("internal_locations.json")
    int_locs = _create_records(
        db, data, InternalLocation, INTERNAL_LOCATION_PID_TYPE
    )

    data = load_json_from_datadir("series.json")
    series = _create_records(db, data, Series, SERIES_PID_TYPE)

    data = load_json_from_datadir("documents.json")
    documents = _create_records(db, data, Document, DOCUMENT_PID_TYPE)

    data = load_json_from_datadir("items.json")
    items = _create_records(db, data, Item, ITEM_PID_TYPE)

    data = load_json_from_datadir("eitems.json")
    eitems = _create_records(db, data, EItem, EITEM_PID_TYPE)

    data = load_json_from_datadir("loans.json")
    loans = _create_records(db, data, Loan, CIRCULATION_LOAN_PID_TYPE)

    data = load_json_from_datadir("acq_providers.json")
    acq_providers = _create_records(db, data, Provider, PROVIDER_PID_TYPE)

    data = load_json_from_datadir("acq_orders.json")
    acq_orders = _create_records(db, data, Order, ORDER_PID_TYPE)

    data = load_json_from_datadir("ill_providers.json")
    ill_providers = _create_records(db, data, Provider, PROVIDER_PID_TYPE)

    data = load_json_from_datadir("ill_borrowing_requests.json")
    ill_brw_reqs = _create_records(
        db, data, BorrowingRequest, BORROWING_REQUEST_PID_TYPE
    )

    data = load_json_from_datadir("document_requests.json")
    doc_reqs = _create_records(
        db, data, DocumentRequest, DOCUMENT_REQUEST_PID_TYPE
    )

    # index
    ri = RecordIndexer()
    for rec in (
        locations
        + int_locs
        + series
        + documents
        + items
        + eitems
        + loans
        + doc_reqs
        + acq_providers
        + acq_orders
        + ill_providers
        + ill_brw_reqs
    ):
        ri.index(rec)

    current_search.flush_and_refresh(index="*")

    return {
        "document_requests": doc_reqs,
        "documents": documents,
        "internal_locations": int_locs,
        "items": items,
        "eitems": eitems,
        "loans": loans,
        "locations": locations,
        "series": series,
        "acq_providers": acq_providers,
        "acq_orders": acq_orders,
        "ill_providers": ill_providers,
        "ill_brw_reqs": ill_brw_reqs,
    }


@pytest.fixture()
def testdata_most_loaned(db, testdata):
    """Create, index and return test data for most loans tests."""
    most_loaned = load_json_from_datadir("loans_most_loaned.json")
    recs = _create_records(db, most_loaned, Loan, CIRCULATION_LOAN_PID_TYPE)

    ri = RecordIndexer()
    for rec in recs:
        ri.index(rec)

    current_search.flush_and_refresh(index="loans")

    return {
        "locations": testdata["locations"],
        "internal_locations": testdata["internal_locations"],
        "documents": testdata["documents"],
        "items": testdata["items"],
        "loans": most_loaned,
        "series": testdata["series"],
    }


@pytest.fixture()
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


@pytest.fixture()
def loan_params():
    """Params for API REST payload."""
    return dict(
        transaction_user_pid="4",
        patron_pid="1",
        document_pid="docid-1",
        item_pid=dict(type="pitmid", value="itemid-2"),
        transaction_location_pid="locid-1",
        transaction_date="2018-02-01T09:30:00+02:00",
    )


@pytest.fixture()
def bucket(bucket_from_dir):
    """Create temporary bucket fixture."""
    with tempfile.TemporaryDirectory(prefix="ils-test-") as temp_dir:
        bucket = bucket_from_dir(temp_dir)
        yield bucket


@pytest.fixture()
def with_access(app):
    """Enable explicit permission check (`_access`)."""
    app.config["ILS_RECORDS_EXPLICIT_PERMISSIONS_ENABLED"] = True
    yield
    app.config["ILS_RECORDS_EXPLICIT_PERMISSIONS_ENABLED"] = False
