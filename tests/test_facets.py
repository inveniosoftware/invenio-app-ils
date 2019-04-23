# -*- coding: utf-8 -*-
#
# Copyright (C) 2018 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""Facets tests."""

from __future__ import absolute_import, print_function

from elasticsearch_dsl.query import Range

from invenio_app_ils.facets import keyed_range_filter


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
