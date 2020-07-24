# -*- coding: utf-8 -*-
#
# Copyright (C) 2018-2020 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""Loan JSON serializers."""

from invenio_records_rest.serializers.json import JSONSerializer

from invenio_app_ils.literature.serializers.custom_fields import \
    field_cover_metadata

from .custom_fields import (field_is_overdue, field_pickup_location,
                            field_transaction_location, field_transaction_user)


class LoanJSONSerializer(JSONSerializer):
    """Serialize loan."""

    def transform_record(self, pid, record, links_factory=None, **kwargs):
        """Transform record into an intermediate representation."""
        loan = super().transform_record(
            pid, record, links_factory=links_factory, **kwargs
        )
        field_is_overdue(loan["metadata"])
        field_pickup_location(loan["metadata"])
        field_transaction_location(loan["metadata"])
        field_transaction_user(loan["metadata"])
        field_cover_metadata(loan["metadata"].get("document", {}))
        return loan

    def transform_search_hit(
        self, pid, record_hit, links_factory=None, **kwargs
    ):
        """Transform search result hit into an intermediate representation."""
        hit = super().transform_search_hit(
            pid, record_hit, links_factory=links_factory, **kwargs
        )
        field_is_overdue(hit["metadata"])
        field_cover_metadata(hit["metadata"].get("document", {}))
        return hit
