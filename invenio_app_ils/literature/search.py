# -*- coding: utf-8 -*-
#
# Copyright (C) 2019 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""Literature search module."""

from invenio_search.api import DefaultFilter, RecordsSearch

from invenio_app_ils.search_permissions import (
    _ils_search_factory, search_filter_record_permissions)


def search_factory_literature(self, search):
    """Search factory for literature (series and documents)."""
    def filter_periodical_issues(search, query_string=None):
        """Filter periodical issues unless include_all is specified."""
        from distutils.util import strtobool

        from flask import request

        include_all = request.values.get("include_all", "no")
        if include_all == "":
            include_all = "yes"

        if not strtobool(include_all):
            issue_query_string = "NOT document_type:PERIODICAL_ISSUE"
            if query_string:
                query_string = "{} AND {}".format(
                    query_string,
                    issue_query_string
                )
            else:
                query_string = issue_query_string
        return search, query_string

    return _ils_search_factory(self, search, filter_periodical_issues)


class LiteratureSearch(RecordsSearch):
    """Literature search that searches both documents and series."""

    class Meta:
        """Search for documents and series."""

        index = ["documents", "series"]
        doc_types = None
        default_filter = DefaultFilter(search_filter_record_permissions)
