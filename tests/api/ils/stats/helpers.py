#
# Copyright (C) 2025 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""Helpers for ILS stats tests."""

import json

from flask import url_for
from invenio_search import current_search
from invenio_stats import current_stats
from invenio_stats.tasks import aggregate_events, process_events


def process_and_aggregate_stats(event_types=None, aggregation_types=None):
    """Process and aggregate stats events."""
    process_events(event_types or current_stats.events)
    current_search.flush_and_refresh(index="events-stats-*")

    aggregate_events(aggregation_types or current_stats.aggregations)
    current_search.flush_and_refresh(index="stats-*")


def query_stats(client, stat, params):
    """Query stats via the HTTP API.

    :param client: Flask test client.
    :param stat: The stat to query.
    :param params: The parameters for the stat query.
    """

    query = {
        "queried_stat": {
            "stat": stat,
            "params": params,
        }
    }

    response = client.post(
        url_for("invenio_stats.stat_query"),
        data=json.dumps(query),
        content_type="application/json",
    )

    return response


def extract_buckets_from_stats_query(response):
    """Extract buckets from the stats query response.

    :param response: The HTTP response from the query_stats function.
    """

    data = json.loads(response.data)
    buckets = data.get("queried_stat").get("buckets", [])
    return buckets


def query_histogram(client, url, group_by, metrics=None, q=None):
    """Query a histogram endpoint via the HTTP API.

    :param client: Flask test client.
    :param url: The histogram endpoint URL.
    :param group_by: List of dicts defining the grouping fields.
    :param metrics: List of dicts defining the aggregation metrics.
    :param q: The search query.
    """

    params = {
        "group_by": json.dumps(group_by),
    }
    if metrics:
        params["metrics"] = json.dumps(metrics)
    if q:
        params["q"] = q

    response = client.get(
        url,
        query_string=params,
    )

    return response


def extract_buckets_from_histogram(response):
    """Extract buckets from the histogram response.

    :param response: The HTTP response from the histogram endpoint.
    """
    data = json.loads(response.data)
    return data.get("buckets", [])
