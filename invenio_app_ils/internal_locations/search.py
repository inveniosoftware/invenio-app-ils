# -*- coding: utf-8 -*-
#
# Copyright (C) 2020 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""ILS Internal Locations search APIs."""

from invenio_search.api import RecordsSearch

from invenio_app_ils.errors import MissingRequiredParameterError


class InternalLocationSearch(RecordsSearch):
    """RecordsSearch for internal locations."""

    class Meta:
        """Search only on internal locations index."""

        index = "internal_locations"
        doc_types = None

    def search_by_location_pid(
        self, location_pid=None, filter_states=None, exclude_states=None
    ):
        """Retrieve internal locations based on the given location pid."""
        search = self

        if location_pid:
            search = search.filter("term", location_pid=location_pid)
        else:
            raise MissingRequiredParameterError(description="location_pid is required")

        if filter_states:
            search = search.filter("terms", state=filter_states)
        elif exclude_states:
            search = search.exclude("terms", state=exclude_states)

        return search
