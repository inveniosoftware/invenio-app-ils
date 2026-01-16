# -*- coding: utf-8 -*-
#
# Copyright (C) 2025 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""Test document request stats histogram functionality."""

import datetime

import pytest
from flask import url_for
from invenio_db import db
from invenio_indexer.api import RecordIndexer
from invenio_search import current_search

from invenio_app_ils.acquisition.api import ORDER_PID_TYPE, Order
from invenio_app_ils.acquisition.search import OrderSearch
from invenio_app_ils.document_requests.api import DocumentRequest
from invenio_app_ils.document_requests.search import DocumentRequestSearch
from invenio_app_ils.ill.api import BORROWING_REQUEST_PID_TYPE, BorrowingRequest
from invenio_app_ils.ill.search import BorrowingRequestsSearch
from tests.api.ils.stats.helpers import (
    extract_buckets_from_histogram,
    query_histogram,
)
from tests.helpers import user_login

DOCUMENT_REQUEST_HISTOGRAM_ENDPOINT = (
    "invenio_app_ils_document_request_stats.document_request_histogram"
)

HISTOGRAM_DOCUMENT_REQUESTS_DOCUMENT_PID = "docid-dreq-histogram"


def _query_document_request_histogram(client, group_by, metrics=[], q=""):
    """Query the document request histogram endpoint via the HTTP API."""

    # Filter to only document requests for the test document
    if q != "":
        q += " AND "
    q += "document_pid: " + HISTOGRAM_DOCUMENT_REQUESTS_DOCUMENT_PID

    url = url_for(DOCUMENT_REQUEST_HISTOGRAM_ENDPOINT)
    response = query_histogram(client, url, group_by, metrics, q)
    assert response.status_code == 200

    buckets = extract_buckets_from_histogram(response)
    return buckets


def test_document_request_stats_histogram_single_group(
    client,
    users,
    empty_event_queues,
    empty_search,
    testdata_document_request_histogram,
):
    """Test histogram with single field grouping."""
    user_login(client, "admin", users)

    group_by = [{"field": "state"}]
    buckets = _query_document_request_histogram(client, group_by)

    # Should have 3 states: PENDING, ACCEPTED, DECLINED
    assert len(buckets) == 3

    state_counts = {bucket["key"]["state"]: bucket["doc_count"] for bucket in buckets}
    assert state_counts["PENDING"] == 2
    assert state_counts["ACCEPTED"] == 2
    assert state_counts["DECLINED"] == 1


def test_document_request_stats_histogram_multiple_groups(
    client,
    users,
    empty_event_queues,
    empty_search,
    testdata_document_request_histogram,
):
    """Test histogram with multiple fields to group by."""
    user_login(client, "admin", users)

    group_by = [
        {"field": "state"},
        {"field": "request_type"},
    ]

    buckets = _query_document_request_histogram(client, group_by)

    # Should have 4 different (state, request_type) groups
    assert len(buckets) == 4

    combo_counts = {
        (bucket["key"]["state"], bucket["key"]["request_type"]): bucket["doc_count"]
        for bucket in buckets
    }

    assert combo_counts[("PENDING", "LOAN")] == 1
    assert combo_counts[("PENDING", "BUY")] == 1
    assert combo_counts[("ACCEPTED", "LOAN")] == 2
    assert combo_counts[("DECLINED", "BUY")] == 1


def test_document_request_stats_histogram_search_query(
    client,
    users,
    empty_event_queues,
    empty_search,
    testdata_document_request_histogram,
):
    """Test that the q search query works in document request stats histogram."""
    user_login(client, "admin", users)

    group_by = [{"field": "state"}]
    metrics = []
    q = "request_type:LOAN"

    buckets = _query_document_request_histogram(client, group_by, metrics, q)

    # Should have 2 states: PENDING and ACCEPTED (only LOAN requests)
    assert len(buckets) == 2

    state_counts = {bucket["key"]["state"]: bucket["doc_count"] for bucket in buckets}
    assert state_counts["PENDING"] == 1
    assert state_counts["ACCEPTED"] == 2
    assert "DECLINED" not in state_counts


@pytest.mark.parametrize(
    "provider_class, provider_search, expected_delay_days",
    [
        (Order, OrderSearch, 5),
        (BorrowingRequest, BorrowingRequestsSearch, 10),
    ],
    ids=["order", "borrowing_request"],
)
def test_document_request_stats_provider_creation_delay_indexed_field(
    client,
    users,
    empty_event_queues,
    empty_search,
    testdata,
    with_stats_index_extensions,
    provider_class,
    provider_search,
    expected_delay_days,
):
    """Test provider_creation_delay stat is indexed for document requests.

    The provider_creation_delay time is:
    Provider creation date - Document request creation date.
    """
    provider_pid_type = provider_class._pid_type
    provider_pid = f"{provider_pid_type}-1"
    doc_request_pid = "dreq-3"

    provider = provider_class.get_record_by_pid(provider_pid)
    doc_request = DocumentRequest.get_record_by_pid(doc_request_pid)

    doc_request["physical_item_provider"] = {
        "pid": provider_pid,
        "pid_type": provider_pid_type,
    }

    now = datetime.datetime.now(datetime.timezone.utc).replace(tzinfo=None)
    doc_request.model.created = now
    doc_request.commit()
    db.session.commit()

    provider_creation_date = now + datetime.timedelta(days=expected_delay_days)
    provider.model.created = provider_creation_date
    provider.commit()
    db.session.commit()
    RecordIndexer().index(provider)
    current_search.flush_and_refresh(index=provider_search.Meta.index)

    RecordIndexer().index(doc_request)
    current_search.flush_and_refresh(index=DocumentRequestSearch.Meta.index)

    hits = list(DocumentRequestSearch().filter("term", pid=doc_request_pid).scan())
    assert len(hits) == 1

    stats = hits[0].get("stats", {})
    assert stats.get("provider_creation_delay") == expected_delay_days

    user_login(client, "admin", users)
    group_by = [{"field": "state"}]
    metrics = [
        {"field": "stats.provider_creation_delay", "aggregation": "sum"},
    ]
    q = f"pid:{doc_request_pid}"

    url = url_for(DOCUMENT_REQUEST_HISTOGRAM_ENDPOINT)
    response = query_histogram(client, url, group_by, metrics, q)
    assert response.status_code == 200

    buckets = extract_buckets_from_histogram(response)
    assert len(buckets) == 1
    metrics_bucket = buckets[0]["metrics"]

    assert metrics_bucket["sum__stats.provider_creation_delay"] == expected_delay_days


# Permission and input validation tests are also in test_histogram_common.py
