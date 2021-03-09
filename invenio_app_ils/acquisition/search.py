# -*- coding: utf-8 -*-
#
# Copyright (C) 2018-2019 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""Acquisition search module."""

from invenio_search.api import RecordsSearch

from invenio_app_ils.errors import MissingRequiredParameterError


class OrderSearch(RecordsSearch):
    """Search for acquisition Acquisition orders."""

    class Meta:
        """Search only on orders index."""

        index = "acq_orders"
        doc_types = None

    def search_by_document_pid(self, document_pid=None):
        """Search by document pid."""
        search = self

        if document_pid:
            search = search.filter(
                "term", order_lines__document_pid=document_pid
            )
        else:
            raise MissingRequiredParameterError(
                description="document_pid is required"
            )
        return search

    def search_by_patron_pid(self, patron_pid=None):
        """Search by patron pid."""
        search = self

        if patron_pid:
            search = search.filter("term", order_lines__patron_pid=patron_pid)
        else:
            raise MissingRequiredParameterError(
                description="patron_pid is required"
            )
        return search

    def get_ongoing_orders_by_patron_pid(self, patron_pid=None):
        """Get pending and ordered orders by patron pid."""
        active_states = ["PENDING", "ORDERED"]
        if patron_pid:
            search = self.search_by_patron_pid(patron_pid).filter(
                "terms", status=active_states
            )
        else:
            raise MissingRequiredParameterError(
                description="patron_pid is required"
            )
        return search

    def search_by_provider_pid(self, provider_pid=None):
        """Search by provider pid."""
        search = self

        if provider_pid:
            search = search.filter("term", provider_pid=provider_pid)
        else:
            raise MissingRequiredParameterError(
                description="provider_pid is required"
            )
        return search
