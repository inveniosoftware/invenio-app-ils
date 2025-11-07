# -*- coding: utf-8 -*-
#
# Copyright (C) 2025 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""Test loan stats histogram functionality."""

import datetime
import json
from copy import deepcopy

from flask import url_for
from invenio_circulation.proxies import current_circulation
from invenio_db import db
from invenio_search import current_search

from invenio_app_ils.items.api import Item
from invenio_app_ils.proxies import current_app_ils
from tests.api.ils.stats.helpers import (
    extract_buckets_from_histogram,
    process_and_aggregate_stats,
    query_histogram,
)
from tests.helpers import user_login, user_logout

LOAN_HISTOGRAM_ENDPOINT = "invenio_app_ils_circulation_stats.loan_histogram"


HISTOGRAM_LOANS_DOCUMENT_PID = "docid-loan-histogram"
HISTOGRAM_LOANS_AVAILABLE_ITEM_PID = "itemid-loan-histogram-2"


def _refresh_loans_index():
    search_cls = current_circulation.loan_search_cls
    current_search.flush_and_refresh(index=search_cls.Meta.index)


def _query_loan_histogram(client, group_by, metrics=[], q=""):
    """Query the loan histogram endpoint via the HTTP API."""

    # We have a certain document in the testdata that is assigned to all loans used for the tests in this file.
    # This allows us expect fixed values from the histogram in our tests,
    # even after future changes the standard testdata for loans.
    if q != "":
        q += " AND "
    q += "document_pid: " + HISTOGRAM_LOANS_DOCUMENT_PID

    url = url_for(LOAN_HISTOGRAM_ENDPOINT)
    response = query_histogram(client, url, group_by, metrics, q)
    assert response.status_code == 200

    buckets = extract_buckets_from_histogram(response)
    return buckets


def test_loan_stats_histogram_single_group(
    client,
    users,
    empty_event_queues,
    empty_search,
    testdata_loan_histogram,
):
    """Test histogram with single field grouping."""
    user_login(client, "admin", users)

    group_by = [{"field": "state"}]
    buckets = _query_loan_histogram(client, group_by)

    # Should have 3 states: ITEM_ON_LOAN, ITEM_RETURNED, PENDING
    assert len(buckets) == 3

    state_counts = {bucket["key"]["state"]: bucket["doc_count"] for bucket in buckets}
    assert state_counts["ITEM_ON_LOAN"] == 1
    assert state_counts["ITEM_RETURNED"] == 2
    assert state_counts["PENDING"] == 1


def test_loan_stats_histogram_date_groups(
    client,
    users,
    empty_event_queues,
    empty_search,
    testdata_loan_histogram,
):
    """Test histogram with date field to group by."""
    user_login(client, "admin", users)

    group_by = [{"field": "start_date", "interval": "1M"}]
    buckets = _query_loan_histogram(client, group_by)

    # Should have 3 different date groups: 2024-01, 2024-07, 2025-07
    assert len(buckets) == 3

    date_counts = {
        bucket["key"]["start_date"]: bucket["doc_count"] for bucket in buckets
    }
    assert date_counts["2024-01-01"] == 1
    assert date_counts["2024-07-01"] == 1
    assert date_counts["2025-07-01"] == 2


def test_loan_stats_histogram_multiple_groups(
    client,
    users,
    empty_event_queues,
    empty_search,
    testdata_loan_histogram,
):
    """Test histogram with multiple fields to group by."""

    user_login(client, "admin", users)

    group_by = [
        {"field": "start_date", "interval": "1M"},
        {"field": "state"},
    ]

    buckets = _query_loan_histogram(client, group_by)

    # Should have 4 different (date,state) groups
    assert len(buckets) == 4

    date_counts = {
        (bucket["key"]["start_date"], bucket["key"]["state"]): bucket["doc_count"]
        for bucket in buckets
    }

    assert date_counts[("2024-01-01", "ITEM_RETURNED")] == 1
    assert date_counts[("2024-07-01", "ITEM_RETURNED")] == 1
    assert date_counts[("2025-07-01", "ITEM_ON_LOAN")] == 1
    assert date_counts[("2025-07-01", "PENDING")] == 1


def test_loan_stats_histogram_metrics_aggregation(
    client, users, empty_event_queues, empty_search, testdata_loan_histogram
):
    """Test histogram with various aggregation metrics."""

    user_login(client, "admin", users)

    group_by = [{"field": "state"}]
    field = "extension_count"

    tests = {
        "ITEM_ON_LOAN": {"avg": 1.0, "sum": 1, "min": 1, "max": 1, "median": 1},
        "PENDING": {"avg": 2.0, "sum": 2, "min": 2, "max": 2, "median": 2},
        "ITEM_RETURNED": {"avg": 2.0, "sum": 4, "min": 1, "max": 3, "median": 2},
    }

    metrics = [
        {"field": field, "aggregation": agg}
        for agg in ["avg", "sum", "min", "max", "median"]
    ]
    buckets = _query_loan_histogram(client, group_by, metrics)
    # Place the buckets in a dict for easier access
    histogram_metrics = {bucket["key"]["state"]: bucket for bucket in buckets}

    for group_key, expected_metrics in tests.items():
        for aggregation_type, expected_value in expected_metrics.items():
            assert (
                histogram_metrics[group_key]["metrics"][f"{aggregation_type}__{field}"]
                == expected_value
            )


def test_loan_stats_histogram_search_query(
    client,
    users,
    empty_event_queues,
    empty_search,
    testdata_loan_histogram,
):
    """Test that the q search query works in loan stats histogram."""

    user_login(client, "admin", users)

    group_by = [{"field": "state"}]
    metrics = []
    q = "start_date:[2025-01-01 TO 2026-01-01]"

    buckets = _query_loan_histogram(client, group_by, metrics, q)

    # Should have 2 states: ITEM_ON_LOAN, PENDING
    assert len(buckets) == 2

    state_counts = {bucket["key"]["state"]: bucket["doc_count"] for bucket in buckets}
    assert state_counts["ITEM_ON_LOAN"] == 1
    assert state_counts["PENDING"] == 1


def test_loan_stats_histogram_group_by_document_availability(
    client,
    users,
    empty_event_queues,
    empty_search,
    json_headers,
    testdata_loan_histogram,
    loan_params,
):
    """Test that the availability of an item during loan request can be used for grouping loans in the histogram."""

    user_login(client, "admin", users)

    def _request_loan(patron_pid):
        url = url_for("invenio_app_ils_circulation.loan_request")

        new_loan = deepcopy(loan_params)
        new_loan["patron_pid"] = patron_pid
        new_loan["delivery"] = {"method": "PICKUP"}
        new_loan["document_pid"] = "docid-loan-histogram"
        res = client.post(url, headers=json_headers, data=json.dumps(new_loan))
        assert res.status_code == 202, res.get_json()
        loan = res.get_json()["metadata"]
        assert loan["state"] == "PENDING"

    group_by = [{"field": "extra_data.stats.available_items_during_request"}]

    # There should be no loans that have the field available_items_during_request indexed on them
    process_and_aggregate_stats()
    buckets = _query_loan_histogram(client, group_by)
    assert len(buckets) == 0

    # Create loan while one item of the document is available
    _request_loan("3")
    process_and_aggregate_stats()
    _refresh_loans_index()

    buckets = _query_loan_histogram(client, group_by)
    assert len(buckets) == 1

    # Make the documents last available item unavailable
    item = Item.get_record_by_pid(HISTOGRAM_LOANS_AVAILABLE_ITEM_PID)
    item.update(dict(status="IN_BINDING"))
    item.commit()
    db.session.commit()
    current_app_ils.item_indexer.index(item)
    item_search = current_app_ils.item_search_cls
    current_search.flush_and_refresh(index=item_search.Meta.index)

    # Now request another loan for the same document
    # We need to request this loan with another patron, as it will fail otherwise
    _request_loan("4")
    process_and_aggregate_stats()
    _refresh_loans_index()

    buckets = _query_loan_histogram(client, group_by)
    assert len(buckets) == 2

    # There should be one loan that was requested when no item was available
    # and one that was requested when an item was available
    availability_counts = {
        bucket["key"]["extra_data.stats.available_items_during_request"]: bucket[
            "doc_count"
        ]
        for bucket in buckets
    }
    assert availability_counts["True"] == 1
    assert availability_counts["False"] == 1


def test_loan_stats_indexed_fields(
    client,
    users,
    empty_event_queues,
    empty_search,
    testdata_loan_histogram,
):
    """Test loan time ranges being indexed onto loans

    The following time ranges are added to a loan during indexing
    * loan_duration
    * waiting_time
    """
    expected_waiting_time_days = 3
    expected_loan_duration_days = 6

    # Update the loan to have the expecting waiting_time and loan_duration
    loan_pid = "loan-hist-3"

    loan_cls = current_circulation.loan_record_cls
    loan = loan_cls.get_record_by_pid(loan_pid)

    now = datetime.datetime.now(datetime.timezone.utc).replace(tzinfo=None)
    loan["start_date"] = (
        (now + datetime.timedelta(days=expected_waiting_time_days)).date().isoformat()
    )
    loan["end_date"] = (
        (
            now
            + datetime.timedelta(days=expected_waiting_time_days)
            + datetime.timedelta(days=expected_loan_duration_days)
        )
        .date()
        .isoformat()
    )

    loan.commit()
    db.session.commit()
    current_circulation.loan_indexer().index(loan)
    _refresh_loans_index()

    # test if the information is indexed to the loan
    loan_search_cls = current_circulation.loan_search_cls
    hits = [hit for hit in loan_search_cls().filter("term", pid=loan_pid).scan()]
    assert len(hits) == 1

    stats = hits[0]["extra_data"]["stats"]
    assert stats["waiting_time"] == expected_waiting_time_days
    assert stats["loan_duration"] == expected_loan_duration_days

    # test if the information is available to be aggregated through the histogram endpoint
    user_login(client, "admin", users)
    group_by = [{"field": "state"}]
    metrics = [
        {"field": "extra_data.stats.waiting_time", "aggregation": "sum"},
        {"field": "extra_data.stats.loan_duration", "aggregation": "sum"},
    ]
    q = f"pid:{loan_pid}"

    buckets = _query_loan_histogram(client, group_by, metrics, q)
    assert len(buckets) == 1
    metrics_bucket = buckets[0]["metrics"]

    assert (
        metrics_bucket["sum__extra_data.stats.waiting_time"]
        == expected_waiting_time_days
    )
    assert (
        metrics_bucket["sum__extra_data.stats.loan_duration"]
        == expected_loan_duration_days
    )


def test_loan_stats_permissions(client, users):
    """Test that only certain users can access the loan histogram endpoint."""

    tests = [
        ("admin", 200),
        ("librarian", 200),
        ("readonly", 200),
        ("patron1", 403),
        ("anonymous", 401),
    ]

    for username, expected_resp_code in tests:
        user_login(client, username, users)

        url = url_for(LOAN_HISTOGRAM_ENDPOINT)
        response = query_histogram(
            client,
            url,
            group_by=[{"field": "state"}],
            metrics=[],
            q="",
        )

        assert (
            response.status_code == expected_resp_code
        ), f"Failed for user: {username}"

        user_logout(client)


def test_loan_stats_input_validation(client, users):
    user_login(client, "admin", users)
    url = url_for(LOAN_HISTOGRAM_ENDPOINT)

    # Attempt to use wrong aggregation type
    group_by = [{"field": "state"}]
    metrics = [{"field": "loan_duration", "aggregation": "script"}]
    resp = query_histogram(client, url, group_by, metrics)
    assert resp.status_code == 400

    # Attempt to pass a field with special characters as the metric field
    group_by = [{"field": "state"}]
    metrics = [{"field": "doc['loan_duration'].value", "aggregation": "avg"}]
    resp = query_histogram(client, url, group_by, metrics)
    assert resp.status_code == 400

    # Attempt to pass a field with special characters as the group by field
    group_by = [{"field": "doc['loan_duration'].value"}]
    metrics = []
    resp = query_histogram(client, url, group_by, metrics)
    assert resp.status_code == 400

    # Attempt to use an invalid date interval
    group_by = [{"field": "start_date", "interval": "1z"}]
    metrics = []
    resp = query_histogram(client, url, group_by, metrics)
    assert resp.status_code == 400

    # Attempt to use a date field without an interval
    group_by = [{"field": "start_date"}]
    metrics = []
    resp = query_histogram(client, url, group_by, metrics)
    assert resp.status_code == 400

    # Attempt to use a  non date field with an interval
    group_by = [{"field": "state", "interval": "1M"}]
    metrics = []
    resp = query_histogram(client, url, group_by, metrics)
    assert resp.status_code == 400

    # Missing group_by parameter
    group_by = None
    metrics = []
    resp = query_histogram(client, url, group_by, metrics)
    assert resp.status_code == 400

    # Empty group_by parameter
    group_by = []
    metrics = []
    resp = query_histogram(client, url, group_by, metrics)
    assert resp.status_code == 400
