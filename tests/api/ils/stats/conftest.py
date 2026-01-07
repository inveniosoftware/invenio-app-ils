#
# Copyright (C) 2025 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""Pytest fixtures and plugins for ILS stats."""


import datetime

import pytest
from invenio_circulation.api import Loan
from invenio_circulation.pidstore.pids import CIRCULATION_LOAN_PID_TYPE
from invenio_indexer.api import RecordIndexer
from invenio_search import current_search
from invenio_stats import current_stats
from invenio_stats.tasks import process_events

from invenio_app_ils.acquisition.api import ORDER_PID_TYPE, Order
from tests.api.conftest import create_records
from tests.helpers import (
    load_json_from_datadir,
)


@pytest.fixture()
def empty_event_queues():
    """Make sure the event queues exist and are empty."""
    for event in current_stats.events:
        queue = current_stats.events[event].queue
        queue.queue.declare()
        queue.consume()


@pytest.fixture()
def testdata_loan_histogram(db, testdata):
    """Create, index and return test data for loans histogram."""
    loans_histogram = load_json_from_datadir("loans_histogram.json")
    recs = create_records(db, loans_histogram, Loan, CIRCULATION_LOAN_PID_TYPE)

    ri = RecordIndexer()
    for rec in recs:
        ri.index(rec)

    current_search.flush_and_refresh(index="loans")

    testdata["loans_histogram"] = loans_histogram

    return testdata


@pytest.fixture()
def testdata_order_histogram(db, testdata):
    """Create, index and return test data for orders histogram."""
    orders_histogram = load_json_from_datadir("acq_orders_histogram.json")
    recs = create_records(db, orders_histogram, Order, ORDER_PID_TYPE)

    ri = RecordIndexer()
    for rec in recs:
        ri.index(rec)

    current_search.flush_and_refresh(index="acq_orders")

    testdata["orders_histogram"] = orders_histogram

    return testdata


@pytest.fixture()
def with_stats_index_extensions(app, ensure_loan_transitions_index):
    """Enable indices to be extended with stats data."""
    app.config["ILS_EXTEND_INDICES_WITH_STATS_ENABLED"] = True
    yield
    app.config["ILS_EXTEND_INDICES_WITH_STATS_ENABLED"] = False


@pytest.fixture()
def ensure_loan_transitions_index(app, empty_event_queues):
    """Ensure the loan-transitions events index exists.

    The loan indexer requires this index to be present when indexing loans
    with stats extensions enabled. This fixture publishes a dummy event
    and processes it to trigger index creation.
    """
    index_name = "events-stats-loan-transitions"

    # Publish a dummy loan transition event to trigger index creation
    dummy_event = {
        "timestamp": datetime.datetime.now(datetime.timezone.utc)
        .replace(tzinfo=None)
        .isoformat(),
        "trigger": "extend",
        "pid_value": "loanid-1",
        "unique_id": "loanid-1__extend",
    }
    current_stats.publish("loan-transitions", [dummy_event])

    # Process events to create the index
    process_events(["loan-transitions"])
    current_search.flush_and_refresh(index=index_name)
