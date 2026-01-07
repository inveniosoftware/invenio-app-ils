# -*- coding: utf-8 -*-
#
# Copyright (C) 2025 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""Test order stats histogram functionality."""

import datetime

from flask import url_for
from invenio_db import db
from invenio_indexer.api import RecordIndexer
from invenio_search import current_search

from invenio_app_ils.acquisition.api import ORDER_PID_TYPE, Order
from invenio_app_ils.acquisition.search import OrderSearch
from invenio_app_ils.document_requests.api import DocumentRequest
from invenio_app_ils.document_requests.search import DocumentRequestSearch
from tests.api.ils.stats.helpers import (
    extract_buckets_from_histogram,
    query_histogram,
)
from tests.helpers import user_login

ORDER_HISTOGRAM_ENDPOINT = "invenio_app_ils_acquisition_stats.order_histogram"

HISTOGRAM_ORDERS_DOCUMENT_PID = "docid-order-histogram"


def _query_order_histogram(client, group_by, metrics=[], q=""):
    """Query the order histogram endpoint via the HTTP API."""

    # Filter to only orders for the test document
    if q != "":
        q += " AND "
    q += "order_lines.document_pid: " + HISTOGRAM_ORDERS_DOCUMENT_PID

    url = url_for(ORDER_HISTOGRAM_ENDPOINT)
    response = query_histogram(client, url, group_by, metrics, q)
    assert response.status_code == 200

    buckets = extract_buckets_from_histogram(response)
    return buckets


def test_order_stats_histogram_single_group(
    client,
    users,
    empty_event_queues,
    empty_search,
    testdata_order_histogram,
):
    """Test histogram with single field grouping."""
    user_login(client, "admin", users)

    group_by = [{"field": "status"}]
    buckets = _query_order_histogram(client, group_by)

    # Should have 3 states: PENDING, ORDERED, RECEIVED
    assert len(buckets) == 3

    status_counts = {bucket["key"]["status"]: bucket["doc_count"] for bucket in buckets}
    assert status_counts["PENDING"] == 1
    assert status_counts["ORDERED"] == 1
    assert status_counts["RECEIVED"] == 2


def test_order_stats_histogram_date_groups(
    client,
    users,
    empty_event_queues,
    empty_search,
    testdata_order_histogram,
):
    """Test histogram with date field to group by."""
    user_login(client, "admin", users)

    group_by = [{"field": "order_date", "interval": "1M"}]
    buckets = _query_order_histogram(client, group_by)

    # Should have 3 different date groups: 2024-01, 2024-06, 2025-01
    assert len(buckets) == 3

    date_counts = {
        bucket["key"]["order_date"]: bucket["doc_count"] for bucket in buckets
    }
    assert date_counts["2024-01-01"] == 2
    assert date_counts["2024-06-01"] == 1
    assert date_counts["2025-01-01"] == 1


def test_order_stats_histogram_multiple_groups(
    client,
    users,
    empty_event_queues,
    empty_search,
    testdata_order_histogram,
):
    """Test histogram with multiple fields to group by."""

    user_login(client, "admin", users)

    group_by = [
        {"field": "order_date", "interval": "1M"},
        {"field": "status"},
    ]

    buckets = _query_order_histogram(client, group_by)

    # Should have 4 different (date,status) groups
    assert len(buckets) == 4

    date_counts = {
        (bucket["key"]["order_date"], bucket["key"]["status"]): bucket["doc_count"]
        for bucket in buckets
    }

    assert date_counts[("2024-01-01", "PENDING")] == 1
    assert date_counts[("2024-01-01", "RECEIVED")] == 1
    assert date_counts[("2024-06-01", "ORDERED")] == 1
    assert date_counts[("2025-01-01", "RECEIVED")] == 1


def test_order_stats_histogram_search_query(
    client,
    users,
    empty_event_queues,
    empty_search,
    testdata_order_histogram,
):
    """Test that the q search query works in order stats histogram."""

    user_login(client, "admin", users)

    group_by = [{"field": "status"}]
    metrics = []
    q = "order_date:[2025-01-01 TO 2026-01-01]"

    buckets = _query_order_histogram(client, group_by, metrics, q)

    # Should have 1 status: RECEIVED
    assert len(buckets) == 1

    status_counts = {bucket["key"]["status"]: bucket["doc_count"] for bucket in buckets}
    assert status_counts["RECEIVED"] == 1


def test_order_stats_indexed_fields(
    client,
    users,
    empty_event_queues,
    empty_search,
    testdata_order_histogram,
    with_stats_index_extensions
):
    """Test order time ranges being indexed onto orders.

    The following time ranges are added to an order during indexing:
    * order_processing_time: received_date - order creation date
    * document_request_waiting_time: received_date - related document request creation date
    """
    expected_order_processing_time_days = 10
    expected_doc_request_waiting_time_days = 15

    order_pid = "order-hist-3"

    order = Order.get_record_by_pid(order_pid)

    # Update the order to have the expected order_processing_time
    now = datetime.datetime.now(datetime.timezone.utc).replace(tzinfo=None)
    received_date = now + datetime.timedelta(days=expected_order_processing_time_days)
    order["received_date"] = received_date.date().isoformat()

    order.commit()
    db.session.commit()

    # Use an existing document request and update it to reference this order
    doc_request_pid = "dreq-1"
    doc_request = DocumentRequest.get_record_by_pid(doc_request_pid)

    # Update the physical_item_provider to point to our test order
    doc_request["physical_item_provider"] = {
        "pid": order_pid,
        "pid_type": ORDER_PID_TYPE,
    }

    # Manually set the _created field to simulate the document request being created earlier
    doc_req_creation_date = received_date - datetime.timedelta(
        days=expected_doc_request_waiting_time_days
    )
    doc_request.model.created = doc_req_creation_date
    doc_request.commit()
    db.session.commit()
    RecordIndexer().index(doc_request)
    current_search.flush_and_refresh(index=DocumentRequestSearch.Meta.index)

    # Now reindex the order - it should pick up the document request
    RecordIndexer().index(order)
    current_search.flush_and_refresh(index=OrderSearch.Meta.index)

    # Test if the information is indexed to the order
    hits = [hit for hit in OrderSearch().filter("term", pid=order_pid).scan()]
    assert len(hits) == 1

    stats = hits[0]["stats"]
    assert stats["order_processing_time"] == expected_order_processing_time_days
    assert (
        stats["document_request_waiting_time"] == expected_doc_request_waiting_time_days
    )

    # Test if the information is available to be aggregated through the histogram endpoint
    user_login(client, "admin", users)
    group_by = [{"field": "status"}]
    metrics = [
        {"field": "stats.order_processing_time", "aggregation": "sum"},
        {"field": "stats.document_request_waiting_time", "aggregation": "sum"},
    ]
    q = f"pid:{order_pid}"

    buckets = _query_order_histogram(client, group_by, metrics, q)
    assert len(buckets) == 1
    metrics_bucket = buckets[0]["metrics"]

    assert (
        metrics_bucket["sum__stats.order_processing_time"]
        == expected_order_processing_time_days
    )
    assert (
        metrics_bucket["sum__stats.document_request_waiting_time"]
        == expected_doc_request_waiting_time_days
    )


# Permission and input validation tests are in test_histogram_common.py
