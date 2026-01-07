# -*- coding: utf-8 -*-
#
# Copyright (C) 2019-2025 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""APIs for ILS histogram statistics."""

from invenio_search.engine import dsl

from invenio_app_ils.stats.histogram.schemas import (
    _OS_NATIVE_AGGREGATE_FUNCTION_TYPES,
)


def _generate_metric_agg_field_name(metric):
    """Return the aggregation name used for a metric.

    :param metric: Must include 'field' and 'aggregation' keys.
    :returns: The aggregation field name in the form '<aggregation>_<field>'.
    """

    return f"{metric['aggregation']}__{metric['field']}"


def get_record_statistics(date_fields, search, requested_group_by, requested_metrics):
    """Aggregate record statistics for requested metrics.

    :param date_fields: List of date fields for the record type.
        Date fields require different handling when using them to group by.
    :param search: The base search object to apply aggregations on.
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

    search.aggs.bucket("aggregations", composite_agg)

    # Only retrieve aggregation results
    search = search[:0]
    result = search.execute()

    # Parse aggregation results
    buckets = []
    if hasattr(result.aggregations, "aggregations"):
        for bucket in getattr(result.aggregations, "aggregations").buckets:
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
