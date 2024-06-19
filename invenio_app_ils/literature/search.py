# -*- coding: utf-8 -*-
#
# Copyright (C) 2019 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""Literature search module."""

from invenio_search.api import DefaultFilter, RecordsSearch

from invenio_app_ils.search_permissions import (
    ils_search_factory,
    search_filter_record_permissions,
)


def search_factory_literature(self, search, query_parser=None):
    """Search factory for literature (series and documents)."""

    def filter_serial_issues(search, query_string=None):
        """Filter periodical issues unless include_all is specified."""
        from distutils.util import strtobool

        from flask import request

        include_all = request.values.get("include_all", "no")
        if include_all == "":
            include_all = "yes"

        if not strtobool(include_all):
            issue_query_string = "NOT document_type:SERIAL_ISSUE"
            if query_string:
                query_string = "({}) AND ({})".format(query_string, issue_query_string)
            else:
                query_string = issue_query_string
        return search, query_string

    return ils_search_factory(self, search, query_parser, filter_serial_issues)


class LiteratureSearch(RecordsSearch):
    """Literature search that searches both documents and series."""

    boosted_fields = [
        "identifiers.value^12.0",
        "identifiers.value.text^12.0",
        "title^8.0",
        "authors.full_name^6.0",
        "imprint.publisher^4.0",
        "edition^4.0",
        "keywords^2.0",
        "abstract^2.0",
    ]

    class Meta:
        """Search for documents and series."""

        index = ["documents", "series"]
        doc_types = None
        default_filter = DefaultFilter(search_filter_record_permissions)
