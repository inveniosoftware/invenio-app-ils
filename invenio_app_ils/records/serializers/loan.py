# -*- coding: utf-8 -*-
#
# Copyright (C) 2018 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""Ils serializers."""

from datetime import datetime

import ciso8601
from invenio_records_rest.serializers.json import JSONSerializer


class LoanJSONSerializer(JSONSerializer):
    """Serialize loan."""

    def transform_record(self, pid, record, links_factory=None, **kwargs):
        """Transform record into an intermediate representation."""
        loan = super(LoanJSONSerializer, self).transform_record(
            pid,
            record,
            links_factory=links_factory,
            **kwargs
        )
        self.is_overdue(loan)
        return loan

    def transform_search_hit(self, pid, record_hit, links_factory=None,
                             **kwargs):
        """Transform search result hit into an intermediate representation."""
        hit = super(LoanJSONSerializer, self).transform_search_hit(
            pid,
            record_hit,
            links_factory=links_factory,
            **kwargs
        )
        self.is_overdue(hit)
        return hit

    # FIXME: remove the date manipulation when dates are globally fixed
    def is_overdue(self, data):
        """Calculate if the loan is overdue and add it as a property."""
        data["metadata"]["is_overdue"] = False
        if "end_date" in data["metadata"]:
            data["metadata"]["is_overdue"] = ciso8601.parse_datetime(
                data["metadata"]["end_date"]
            ).replace(tzinfo=None) < datetime.utcnow()
        return data
