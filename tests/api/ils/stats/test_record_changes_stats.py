# -*- coding: utf-8 -*-
#
# Copyright (C) 2025 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""Test ILS record changes stats functionality."""

from collections import defaultdict

import pytest

from invenio_app_ils.document_requests.api import (
    DOCUMENT_REQUEST_PID_TYPE,
    DocumentRequest,
)
from invenio_app_ils.documents.api import DOCUMENT_PID_TYPE, Document
from invenio_app_ils.eitems.api import EITEM_PID_TYPE, EItem
from invenio_app_ils.internal_locations.api import (
    INTERNAL_LOCATION_PID_TYPE,
    InternalLocation,
)
from invenio_app_ils.items.api import ITEM_PID_TYPE, Item
from invenio_app_ils.locations.api import LOCATION_PID_TYPE, Location
from invenio_app_ils.series.api import SERIES_PID_TYPE, Series
from tests.api.ils.stats.helpers import (
    extract_buckets_from_stats_query,
    process_and_aggregate_stats,
    query_stats,
)
from tests.helpers import mint_record_pid, user_login, user_logout


def _query_record_changes_stats(client, pid_type, method):
    """Query stats via the HTTP API."""
    response = query_stats(
        client,
        "ils-record-changes",
        {
            "pid_type": pid_type,
            "method": method,
            "interval": "year",
        },
    )
    assert response.status_code == 200
    buckets = extract_buckets_from_stats_query(response)

    total_count = sum(bucket.get("count") for bucket in buckets)
    return total_count


def _query_record_changes_stats_per_user(client, pid_type, method):
    """Query stats via the HTTP API."""
    response = query_stats(
        client,
        "ils-record-changes-per-user",
        {
            "pid_type": pid_type,
            "method": method,
        },
    )
    assert response.status_code == 200
    buckets = extract_buckets_from_stats_query(response)

    res = {}
    for bucket in buckets:
        user_id = bucket.get("key")
        count = bucket.get("count")
        res[user_id] = count

    return res


def test_record_change_stats_histogram(
    app, users, empty_event_queues, empty_search, testdata
):
    """Test that insertions, updates and deletions are tracked correctly."""

    methods = ["insert", "update", "delete"]

    client = app.test_client()
    user_login(client, "admin", users)
    process_and_aggregate_stats()

    tests = [
        ("documents", DOCUMENT_PID_TYPE, Document),
        ("items", ITEM_PID_TYPE, Item),
        ("eitems", EITEM_PID_TYPE, EItem),
        ("locations", LOCATION_PID_TYPE, Location),
        ("series", SERIES_PID_TYPE, Series),
        ("internal_locations", INTERNAL_LOCATION_PID_TYPE, InternalLocation),
        ("document_requests", DOCUMENT_REQUEST_PID_TYPE, DocumentRequest),
    ]

    initial_counts = defaultdict(dict)
    for testdata_key, pid_type, record_class in tests:
        for method in methods:
            initial_counts[pid_type][method] = _query_record_changes_stats(
                client, pid_type, method
            )

        # Generate events
        record_data = testdata[testdata_key][0].copy()
        record_data["pid"] += "-stats"

        # Insert
        record = record_class.create(record_data)
        mint_record_pid(pid_type, "pid", record)

        # Update
        record.update(record_data)
        record.commit()

        # Delete
        record.delete()

    process_and_aggregate_stats()
    for _, pid_type, _ in tests:
        for method in methods:
            final_count = _query_record_changes_stats(client, pid_type, method)
            assert (
                final_count == initial_counts[pid_type][method] + 1
            ), f"{pid_type} {method} count mismatch"


def test_record_change_stats_per_user(
    client, users, empty_event_queues, empty_search, testdata
):
    """Test that insertions by different users are tracked correctly."""

    pid_type = DOCUMENT_PID_TYPE
    method = "insert"

    user_login(client, "admin", users)
    # Create one record with admin to have a user with existing stats
    data = testdata["documents"][0].copy()
    data["pid"] += "-stats"
    Document.create(data)

    process_and_aggregate_stats()
    initial_counts = _query_record_changes_stats_per_user(client, pid_type, method)
    user_logout(client)

    test_users = [
        ("admin", users["admin"].id),
        ("librarian", users["librarian"].id),
        ("librarian2", users["librarian2"].id),
    ]

    for username, _ in test_users:
        user_login(client, username, users)

        data = testdata["documents"][0].copy()
        data["pid"] += "-stats-" + username
        Document.create(data)

        user_logout(client)

    process_and_aggregate_stats()

    user_login(client, "admin", users)
    final_counts = dict(_query_record_changes_stats_per_user(client, pid_type, method))
    user_logout(client)

    for username, user_id in test_users:
        initial_user_count = initial_counts.get(str(user_id), 0)  # can be None
        final_user_count = final_counts.get(str(user_id))
        assert (
            final_user_count == initial_user_count + 1
        ), f"User {username} count mismatch"


def test_patron_record_changes_not_tracked_per_user(
    client, users, empty_event_queues, empty_search, testdata
):
    """Test that patron users are not tracked in per-user stats."""

    pid_type = DOCUMENT_PID_TYPE
    method = "insert"

    user_login(client, "admin", users)
    # Create one record with admin to have a user with existing stats
    data = testdata["documents"][0].copy()
    data["pid"] += "-stats"
    Document.create(data)

    process_and_aggregate_stats()

    initial_total_count = _query_record_changes_stats(client, pid_type, method)
    initial_per_user_counts = _query_record_changes_stats_per_user(
        client, pid_type, method
    )
    user_logout(client)

    patron_users = [
        ("patron1", users["patron1"].id),
        ("patron2", users["patron2"].id),
    ]

    for username, _ in patron_users:
        user_login(client, username, users)

        data = testdata["documents"][0].copy()
        data["pid"] += "-stats-" + username
        Document.create(data)

        user_logout(client)

    process_and_aggregate_stats()

    user_login(client, "admin", users)
    final_total_count = _query_record_changes_stats(client, pid_type, method)
    final_per_user_counts = _query_record_changes_stats_per_user(
        client, pid_type, method
    )
    user_logout(client)

    assert final_total_count == initial_total_count + len(patron_users)

    for _, user_id in patron_users:
        assert str(user_id) not in final_per_user_counts
        assert str(user_id) not in initial_per_user_counts


def test_record_change_stats_permissions(app, users):
    """Test that only certain users can access the stats."""

    def test_stats_permissions(stat, tests):
        params = {"pid_type": DOCUMENT_PID_TYPE, "method": "insert"}
        client = app.test_client()
        for username, expected_resp_code in tests:
            user_login(client, username, users)
            response = query_stats(
                client,
                stat,
                params,
            )
            assert response.status_code == expected_resp_code, username
            user_logout(client)

    stat = "ils-record-changes"
    tests = [
        ("admin", 200),
        ("patron1", 403),
        ("librarian", 200),
        ("readonly", 200),
        ("anonymous", 401),
    ]
    test_stats_permissions(stat, tests)

    stat = "ils-record-changes-per-user"
    tests = [
        ("admin", 200),
        ("patron1", 403),
        ("librarian", 403),
        ("readonly", 403),
        ("anonymous", 401),
    ]
    test_stats_permissions(stat, tests)
