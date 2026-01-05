# -*- coding: utf-8 -*-
#
# Copyright (C) 2025 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""Test loan transitions stats functionality."""


import json
from copy import deepcopy

from tests.api.ils.stats.helpers import (
    extract_buckets_from_stats_query,
    process_and_aggregate_stats,
    query_stats,
)
from tests.helpers import user_login, user_logout


def _query_loan_extensions_stats(client, trigger):
    """Query stats via the HTTP API."""
    response = query_stats(
        client,
        "loan-transitions",
        {
            "trigger": trigger,
        },
    )
    assert response.status_code == 200
    buckets = extract_buckets_from_stats_query(response)

    total_count = sum(bucket.get("count") for bucket in buckets)
    return total_count


def test_loan_transition_histogram(
    client,
    json_headers,
    users,
    empty_event_queues,
    empty_search,
    testdata,
    loan_params,
    checkout_loan,
):
    """Test that certain transitions are tracked correctly.

    The following transitions are tested checkout, extend and checkin
    """

    process_and_aggregate_stats()
    user_login(client, "admin", users)
    initial_checkout_count = _query_loan_extensions_stats(client, "checkout")
    initial_extend_count = _query_loan_extensions_stats(client, "extend")
    initial_checkin_count = _query_loan_extensions_stats(client, "checkin")

    # checkout loan
    loan_pid = "loanid-1"
    params = deepcopy(loan_params)
    params["document_pid"] = "docid-1"
    params["item_pid"]["value"] = "itemid-2"
    del params["transaction_date"]
    loan = checkout_loan(loan_pid, params)

    # extend loan
    urls = loan["links"]["actions"]
    extend_url = urls["extend"]
    user_login(client, "admin", users)
    res = client.post(
        extend_url,
        headers=json_headers,
        data=json.dumps(params),
    )
    assert res.status_code == 202

    # checkin loan
    checkin_url = urls["checkin"]
    user_login(client, "librarian", users)
    res = client.post(
        checkin_url,
        headers=json_headers,
        data=json.dumps(params),
    )
    assert res.status_code == 202

    process_and_aggregate_stats()
    final_checkout_count = _query_loan_extensions_stats(client, "checkout")
    final_extend_count = _query_loan_extensions_stats(client, "extend")
    final_checkin_count = _query_loan_extensions_stats(client, "checkin")

    assert final_extend_count == initial_extend_count + 1
    assert final_checkout_count == initial_checkout_count + 1
    assert final_checkin_count == initial_checkin_count + 1


def test_loan_transition_stats_permissions(client, users):
    """Test that only certain users can access the stats."""

    stat = "loan-transitions"
    tests = [
        ("admin", 200),
        ("patron1", 403),
        ("librarian", 200),
        ("readonly", 200),
        ("anonymous", 401),
    ]

    params = {
        "trigger": "request",
    }
    for username, expected_resp_code in tests:
        user_login(client, username, users)
        response = query_stats(
            client,
            stat,
            params,
        )
        assert response.status_code == expected_resp_code, username
        user_logout(client)
