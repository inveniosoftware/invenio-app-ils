# -*- coding: utf-8 -*-
#
# Copyright (C) 2018 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""Facets tests."""

from __future__ import absolute_import, print_function

from datetime import timedelta

import arrow
import pytest
from elasticsearch_dsl.query import Bool, Q, Range, Terms
from flask import current_app

from invenio_app_ils.facets import date_range_filter, \
    default_value_when_missing_filter, keyed_range_filter, \
    overdue_loans_filter


def test_keyed_range_filter():
    """Test range filter."""
    range_query = {
        "None": {"lt": 1},
        "1+": {"gte": 1}
    }
    rfilter = keyed_range_filter("field", range_query)

    assert rfilter(["None"]) == Range(field={"lt": 1})
    assert rfilter(["1+"]) == Range(field={"gte": 1})
    assert rfilter(["None", "1+"]) == Range(field={"gte": 1, "lt": 1})


def test_current_ranged_loans_filter(app):
    """Test ranged current loans filter."""
    with app.app_context():
        rfilter = overdue_loans_filter("field")

        current_loans_query = Terms(
            state=current_app.config["CIRCULATION_STATES_LOAN_ACTIVE"])

        assert rfilter(["Overdue"]) == Range(
            field={"lt": str(arrow.utcnow().date())}) & current_loans_query
        assert rfilter(["Upcoming return"]) == Range(
            field={"gte": str(arrow.utcnow().date()), "lte": str(
                (arrow.utcnow() + timedelta(
                    days=7)).date())}) & current_loans_query


def test_default_value_when_missing_filter(app):
    """Test custom exists filter."""
    with app.app_context():
        rfilter = default_value_when_missing_filter("field", "missing val")

        assert rfilter("test") == Terms(field="test")
        assert rfilter("missing val") == Bool(
            **{'must_not': {'exists': {'field': "field"}}})


@pytest.mark.parametrize("input_date", ["",  "a string", "2020-02-02"])
def test_date_range_filter(app, input_date):
    """Test date range filter date validation and query."""
    from_filter = date_range_filter("field", "gte")
    to_filter = date_range_filter("field", "lte")

    try:
        assert from_filter([input_date]) == Range(field={"gte": input_date})
        assert to_filter([input_date]) == Range(field={"lte": input_date})
    except:
        with pytest.raises(ValueError) as err:
            from_filter([input_date])
            to_filter([input_date])
