# -*- coding: utf-8 -*-
#
# Copyright (C) 2020 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""ILS EItems search APIs."""

from flask import current_app
from invenio_search.api import RecordsSearch

from invenio_app_ils.errors import MissingRequiredParameterError


class EItemSearch(RecordsSearch):
    """RecordsSearch for EItem."""

    class Meta:
        """Search only on items index."""

        index = "eitems"
        doc_types = None

    def search_by_document_pid(
        self, document_pid=None, filter_states=None, exclude_states=None
    ):
        """Retrieve items based on the given document pid."""
        search = self

        if document_pid:
            search = search.filter("term", document_pid=document_pid)
        else:
            raise MissingRequiredParameterError(description="document_pid is required")

        if filter_states:
            search = search.filter("terms", status=filter_states)
        elif exclude_states:
            search = search.exclude("terms", status=exclude_states)

        return search

    def search_by_bucket_id(self, bucket_id=None):
        """Search EItems by bucket id."""
        search = self

        if bucket_id:
            search = search.filter("term", bucket_id=bucket_id)
        else:
            raise MissingRequiredParameterError(description="bucket_id is required")

        results = search.execute()
        if len(results) != 1:
            # There should always be one bucket associated with an eitem when
            # downloading a file.
            msg = "found 0 or multiple records with bucket {0}".format(bucket_id)
            current_app.logger.warning(msg)
        return results
