# -*- coding: utf-8 -*-
#
# Copyright (C) 2019 CERN.
#
# Invenio-App-Ils is free software; you can redistribute it and/or modify
# it under the terms of the MIT License; see LICENSE file for more details.

"""Facets and factories for result filtering and aggregation."""

from elasticsearch_dsl.query import Range


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
