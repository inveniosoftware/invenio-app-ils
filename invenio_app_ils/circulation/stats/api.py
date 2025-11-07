# -*- coding: utf-8 -*-
#
# Copyright (C) 2019-2025 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""APIs for ILS circulation statistics."""

from invenio_search.engine import dsl

from invenio_app_ils.circulation.search import get_most_loaned_documents
from invenio_app_ils.circulation.stats.schemas import (
    _OS_NATIVE_AGGREGATE_FUNCTION_TYPES,
)
from invenio_app_ils.proxies import current_app_ils


def fetch_most_loaned_documents(from_date, to_date, bucket_size):
    """Fetch the documents with the most loans within the date interval."""
    # Create loans aggregation
    most_loaned = get_most_loaned_documents(from_date, to_date, bucket_size)

    # Prepare the loan and extension count
    document_pids = []
    document_metadata = {}
    loan_result = most_loaned.execute()
    for bucket in loan_result.aggregations.most_loaned_documents.buckets:
        document_pid = bucket["key"]
        loan_count = bucket["doc_count"]
        loan_extensions = int(bucket["extensions"]["value"])
        document_pids.append(document_pid)
        document_metadata[document_pid] = dict(
            loans=loan_count, extensions=loan_extensions
        )

    # Enhance the document serializer
    doc_search = current_app_ils.document_search_cls()
    doc_search = doc_search.with_preference_param().params(version=True)
    doc_search = doc_search.search_by_pid(*document_pids)
    doc_search = doc_search[0:bucket_size]
    result = doc_search.execute()

    for hit in result.hits:
        pid = hit["pid"]
        hit["loan_count"] = document_metadata[pid]["loans"]
        hit["loan_extensions"] = document_metadata[pid]["extensions"]

    res = result.to_dict()
    res["hits"]["hits"] = sorted(
        res["hits"]["hits"],
        key=lambda hit: hit["_source"]["loan_count"],
        reverse=True,
    )

    return res


def _generate_metric_agg_field_name(metric):
    """Return the aggregation name used for a metric.

    :param metric: Must include 'field' and 'aggregation' keys.
    :returns: The aggregation field name in the form '<aggregation>_<field>'.
    """

    return f"{metric['aggregation']}__{metric['field']}"


def get_loan_statistics(date_fields, search, requested_group_by, requested_metrics):
    """Aggregate loan statistics for requested metrics.

    :param date_fields: List of date fields for the record type.
        Date fields require different handling when using them to group by.
    :param search: The base search object to apply aggregations on
    :param requested_group_by: List of group dictionaries with 'field' and optional 'interval' keys.
        Example: [{"field": "start_date", "interval": "monthly"}, {"field": "state"}]
    :param requested_metrics: List of metric dictionaries with 'field' and 'aggregation' keys.
        Example: [{"field": "loan_duration", "aggregation": "avg"}]
    :returns: OpenSearch aggregation results with multi-terms histogram and optional metrics
    """

    # Build composite aggregation
    sources = []
    for grouping in requested_group_by:
        grouping_field = grouping["field"]

        if grouping_field in date_fields:
            sources.append(
                {
                    grouping_field: {
                        "date_histogram": {
                            "field": grouping_field,
                            "calendar_interval": grouping["interval"],
                            "format": "yyyy-MM-dd",
                        }
                    }
                }
            )
        else:
            sources.append({grouping_field: {"terms": {"field": grouping_field}}})

    composite_agg = dsl.A("composite", sources=sources, size=1000)

    for metric in requested_metrics:
        agg_name = _generate_metric_agg_field_name(metric)

        grouping_field = metric["field"]
        agg_type = metric["aggregation"]
        field_config = {"field": grouping_field}
        if agg_type in _OS_NATIVE_AGGREGATE_FUNCTION_TYPES:
            composite_agg = composite_agg.metric(
                agg_name, dsl.A(agg_type, **field_config)
            )
        elif agg_type == "median":
            composite_agg = composite_agg.metric(
                agg_name, dsl.A("percentiles", percents=[50], **field_config)
            )

    search.aggs.bucket("loan_aggregations", composite_agg)

    # Only retrieve aggregation results
    search = search[:0]
    result = search.execute()

    # Parse aggregation results
    buckets = []
    if hasattr(result.aggregations, "loan_aggregations"):
        for bucket in result.aggregations.loan_aggregations.buckets:
            metrics_data = {}
            for metric in requested_metrics:
                agg_name = _generate_metric_agg_field_name(metric)

                if hasattr(bucket, agg_name):
                    agg_result = getattr(bucket, agg_name)
                    agg_type = metric["aggregation"]

                    if agg_type in _OS_NATIVE_AGGREGATE_FUNCTION_TYPES:
                        metrics_data[agg_name] = agg_result.value
                    elif agg_type == "median":
                        median_value = agg_result.values.get("50.0")
                        metrics_data[agg_name] = median_value

            bucket_data = {
                "key": bucket.key.to_dict(),
                "doc_count": bucket.doc_count,
                "metrics": metrics_data,
            }

            buckets.append(bucket_data)

    return buckets
