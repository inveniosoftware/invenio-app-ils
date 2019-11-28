# -*- coding: utf-8 -*-
#
# Copyright (C) 2018 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""Ils serializers."""

from flask import current_app
from invenio_records_rest.serializers.json import JSONSerializer

from invenio_app_ils.circulation.utils import circulation_overdue_loan_days


class LoanJSONSerializer(JSONSerializer):
    """Serialize loan."""

    def transform_record(self, pid, record, links_factory=None, **kwargs):
        """Transform record into an intermediate representation."""
        loan = super(LoanJSONSerializer, self).transform_record(
            pid, record, links_factory=links_factory, **kwargs
        )
        self.is_overdue(loan["metadata"])
        return loan

    def transform_search_hit(
        self, pid, record_hit, links_factory=None, **kwargs
    ):
        """Transform search result hit into an intermediate representation."""
        hit = super(LoanJSONSerializer, self).transform_search_hit(
            pid, record_hit, links_factory=links_factory, **kwargs
        )
        self.is_overdue(hit["metadata"])
        return hit

    def is_overdue(self, metadata):
        """Calculate if the loan is overdue and add it as a property."""
        metadata["is_overdue"] = False
        if (
            metadata["state"] in current_app.config["CIRCULATION_STATES_LOAN_ACTIVE"]
            and "end_date" in metadata
        ):
            metadata["is_overdue"] = (
                circulation_overdue_loan_days(metadata) > 0
            )
