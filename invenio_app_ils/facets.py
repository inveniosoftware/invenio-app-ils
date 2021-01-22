# -*- coding: utf-8 -*-
#
# Copyright (C) 2019 CERN.
#
# Invenio-App-Ils is free software; you can redistribute it and/or modify
# it under the terms of the MIT License; see LICENSE file for more details.

"""Facets and factories for result filtering and aggregation."""

import arrow
from elasticsearch_dsl.query import Bool, Q, Range
from flask import current_app


def keyed_range_filter(field, range_query, **kwargs):
    """Create a range filter.

    :param field: Field name.
    :param range_query: Dictionary with available keys and their range options.
    """

    def inner(values):
        args = {}
        for range_key, mappings in range_query.items():
            if range_key in values:
                for key, value in mappings.items():
                    args[key] = value

        args.update(kwargs.copy())

        return Range(**{field: args})

    return inner


def default_value_when_missing_filter(field, missing_val):
    """Create a custom exists filter.

    :param field: Field name.
    :missing_val
    :returns: Function that returns the Terms query.
    """

    def inner(values):
        if missing_val in values:
            return Bool(**{"must_not": {"exists": {"field": field}}})
        else:
            return Q("terms", **{field: values})

    return inner


def exists_value_filter(field, filter_value):
    """Create a custom filter that filters by existing value.

    :param field: Field name.
    :param filter_value: Filter value.
    """

    def inner(values):
        if filter_value in values:
            return Bool(**{"must": {"exists": {"field": field}}})
        else:
            return Bool(**{"must_not": {"exists": {"field": field}}})

    return inner


def overdue_loans_filter(field):
    """Create a custom filter for ongoing loans.

    :param field: Field to filter.
    :param range_query: Dictionary with available keys and their range options.
    """

    def inner(values):
        range_query = {
            "Overdue": {"lt": str(arrow.utcnow().date())},
            "Upcoming return": {
                "lte": str(
                    current_app.config["CIRCULATION_POLICIES"][
                        "upcoming_return_range"
                    ]().date()
                ),
                "gte": str(arrow.utcnow().date()),
            },
        }

        args = {}
        for range_key, mappings in range_query.items():
            if range_key in values:
                for key, value in mappings.items():
                    args[key] = value

        return Range(**{field: args}) & Q(
            "terms",
            **{"state": current_app.config["CIRCULATION_STATES_LOAN_ACTIVE"]}
        )

    return inner


def overdue_agg():
    """Create a custom aggregation with dynamic dates."""
    return dict(
        filter=dict(
            terms=dict(
                state=current_app.config["CIRCULATION_STATES_LOAN_ACTIVE"]
            )
        ),
        aggs=dict(
            end_date=dict(
                range=dict(
                    field="end_date",
                    ranges=[
                        {"key": "Overdue", "to": str((arrow.utcnow()).date())},
                        {
                            "key": "Upcoming return",
                            "from": str(arrow.utcnow().date()),
                            "to": str(
                                current_app.config["CIRCULATION_POLICIES"][
                                    "upcoming_return_range"
                                ]().date()
                            ),
                        },
                    ],
                )
            )
        ),
    )


def date_range_filter(field, comparator):
    """Create a range filter.

    :param field: Field name.
    :param comparator: Comparison we want with the supplied date.
    """

    def inner(values):
        try:
            input_date = str(arrow.get(values[0]).date())
        except arrow.parser.ParserError:
            raise ValueError("Input should be a date")
        return Range(**{field: {comparator: input_date}})

    return inner
