# -*- coding: utf-8 -*-
#
# Copyright (C) 2025 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""Test common histogram functionality across all record types."""

import pytest
from flask import url_for

from tests.api.ils.stats.helpers import query_histogram
from tests.helpers import user_login, user_logout

# All histogram endpoints that should share the same behavior.
# Add new histogram endpoints here as they are implemented.
HISTOGRAM_ENDPOINTS = [
    {
        "endpoint": "invenio_app_ils_circulation_stats.loan_histogram",
        "keyword_field": "state",
        "date_field": "start_date",
    },
    {
        "endpoint": "invenio_app_ils_acquisition_stats.order_histogram",
        "keyword_field": "status",
        "date_field": "order_date",
    },
]


@pytest.mark.parametrize("endpoint_config", HISTOGRAM_ENDPOINTS)
def test_histogram_permissions(client, users, endpoint_config):
    """Test that permission rules apply consistently to all histogram endpoints."""
    endpoint = endpoint_config["endpoint"]
    keyword_field = endpoint_config["keyword_field"]

    permission_tests = [
        ("admin", 200),
        ("librarian", 200),
        ("readonly", 200),
        ("patron1", 403),
        ("anonymous", 401),
    ]

    for username, expected_resp_code in permission_tests:
        user_login(client, username, users)

        url = url_for(endpoint)
        response = query_histogram(
            client,
            url,
            group_by=[{"field": keyword_field}],
            metrics=[],
            q="",
        )

        assert response.status_code == expected_resp_code, (
            f"Failed for user '{username}' on endpoint '{endpoint}': "
            f"expected {expected_resp_code}, got {response.status_code}"
        )

        user_logout(client)


@pytest.mark.parametrize("endpoint_config", HISTOGRAM_ENDPOINTS)
def test_histogram_input_validation(client, users, endpoint_config):
    """Test input validation applies consistently to all histogram endpoints."""
    endpoint = endpoint_config["endpoint"]
    keyword_field = endpoint_config["keyword_field"]
    date_field = endpoint_config["date_field"]

    user_login(client, "admin", users)
    url = url_for(endpoint)

    # Attempt to use wrong aggregation type
    group_by = [{"field": keyword_field}]
    metrics = [{"field": "some_field", "aggregation": "script"}]
    resp = query_histogram(client, url, group_by, metrics)
    assert resp.status_code == 400, "Should reject invalid aggregation type 'script'"

    # Attempt to pass a field with special characters as the metric field
    group_by = [{"field": keyword_field}]
    metrics = [{"field": "doc['field'].value", "aggregation": "avg"}]
    resp = query_histogram(client, url, group_by, metrics)
    assert resp.status_code == 400, "Should reject metric field with special characters"

    # Attempt to pass a field with special characters as the group by field
    group_by = [{"field": "doc['field'].value"}]
    metrics = []
    resp = query_histogram(client, url, group_by, metrics)
    assert (
        resp.status_code == 400
    ), "Should reject group_by field with special characters"

    # Attempt to use an invalid date interval
    group_by = [{"field": date_field, "interval": "1z"}]
    metrics = []
    resp = query_histogram(client, url, group_by, metrics)
    assert resp.status_code == 400, "Should reject invalid date interval '1z'"

    # Attempt to use a date field without an interval
    group_by = [{"field": date_field}]
    metrics = []
    resp = query_histogram(client, url, group_by, metrics)
    assert resp.status_code == 400, "Should reject date field without interval"

    # Attempt to use a non-date field with an interval
    group_by = [{"field": keyword_field, "interval": "1M"}]
    metrics = []
    resp = query_histogram(client, url, group_by, metrics)
    assert resp.status_code == 400, "Should reject non-date field with interval"

    # Missing group_by parameter
    group_by = None
    metrics = []
    resp = query_histogram(client, url, group_by, metrics)
    assert resp.status_code == 400, "Should reject missing group_by parameter"

    # Empty group_by parameter
    group_by = []
    metrics = []
    resp = query_histogram(client, url, group_by, metrics)
    assert resp.status_code == 400, "Should reject empty group_by parameter"
