# -*- coding: utf-8 -*-
#
# Copyright (C) 2018 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""Facets tests."""

from datetime import timedelta

import arrow
import pytest
from flask import current_app
from invenio_search.engine import dsl

from invenio_app_ils.facets import (
    date_range_filter,
    default_value_when_missing_filter,
    keyed_range_filter,
    overdue_loans_filter,
)


def test_keyed_range_filter():
    """Test range filter."""
    range_query = {"None": {"lt": 1}, "1+": {"gte": 1}}
    rfilter = keyed_range_filter("field", range_query)

    assert rfilter(["None"]) == dsl.query.Range(field={"lt": 1})
    assert rfilter(["1+"]) == dsl.query.Range(field={"gte": 1})
    assert rfilter(["None", "1+"]) == dsl.query.Range(field={"gte": 1, "lt": 1})


def test_current_ranged_loans_filter(app):
    """Test ranged current loans filter."""
    with app.app_context():
        rfilter = overdue_loans_filter("field")

        current_loans_query = dsl.query.Terms(
            state=current_app.config["CIRCULATION_STATES_LOAN_ACTIVE"]
        )

        overdue = rfilter(["Overdue"])
        field = {"lt": str(arrow.utcnow().date())}
        assert overdue == dsl.query.Bool(
            [dsl.RangeField(field=field), current_loans_query]
        )

        upcoming = rfilter(["Upcoming return"])
        field = {
            "gte": str(arrow.utcnow().date()),
            "lte": str((arrow.utcnow() + timedelta(days=7)).date()),
        }
        assert upcoming == dsl.query.Bool(
            [dsl.RangeField(field=field), current_loans_query]
        )


def test_default_value_when_missing_filter(app):
    """Test custom exists filter."""
    with app.app_context():
        rfilter = default_value_when_missing_filter("field", "missing val")

        assert rfilter("test") == dsl.query.Terms(field="test")
        assert rfilter("missing val") == dsl.query.Bool(
            **{"must_not": {"exists": {"field": "field"}}}
        )


def test_date_range_filter(app):
    """Test date range filter date validation and query."""

    tests = ["", "a string", "2020-02-02"]

    for input_date in tests:
        from_filter = date_range_filter("field", "gte")
        to_filter = date_range_filter("field", "lte")

        try:
            assert from_filter([input_date]) == dsl.RangeField(
                field={"gte": input_date}
            )
            assert to_filter([input_date]) == dsl.RangeField(field={"lte": input_date})
        except (ValueError, AssertionError):
            with pytest.raises(ValueError):
                from_filter([input_date])
                to_filter([input_date])
