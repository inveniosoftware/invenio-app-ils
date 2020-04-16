# -*- coding: utf-8 -*-
#
# Copyright (C) 2018 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""Ils serializers."""

from flask import current_app
from invenio_pidstore.errors import PIDDeletedError, PIDDoesNotExistError
from invenio_records_rest.serializers.json import JSONSerializer

from invenio_app_ils.circulation.utils import circulation_overdue_loan_days
from invenio_app_ils.jsonresolver.api import pick
from invenio_app_ils.proxies import current_app_ils


class LoanJSONSerializer(JSONSerializer):
    """Serialize loan."""

    def transform_record(self, pid, record, links_factory=None, **kwargs):
        """Transform record into an intermediate representation."""
        loan = super(LoanJSONSerializer, self).transform_record(
            pid, record, links_factory=links_factory, **kwargs
        )
        self.is_overdue(loan["metadata"])
        self.pickup_location(loan["metadata"])
        self.transaction_location(loan["metadata"])
        self.transaction_user(loan["metadata"])
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
        is_loan_active = metadata["state"] in current_app.config[
            "CIRCULATION_STATES_LOAN_ACTIVE"]
        if is_loan_active and "end_date" in metadata:
            metadata["is_overdue"] = \
                circulation_overdue_loan_days(metadata) > 0

    def pickup_location(self, metadata):
        """Get the pickup location object and add it a property."""
        pickup_location_pid = metadata.get("pickup_location_pid")
        if not pickup_location_pid:
            return
        Location = current_app_ils.location_record_cls
        try:
            pickup_location = Location.get_record_by_pid(
                pickup_location_pid)
        except PIDDeletedError:
            metadata["pickup_location"] = {
                "name": "This location was deleted."}
            return
        except PIDDoesNotExistError:
            metadata["pickup_location"] = {"name": "Location PID invalid."}
            return
        metadata["pickup_location"] = pick(
            pickup_location,
            "name")

    def transaction_location(self, metadata):
        """Get the transaction location object and add it a property."""
        transaction_location_pid = metadata.get("transaction_location_pid")
        if not transaction_location_pid:
            return
        Location = current_app_ils.location_record_cls
        try:
            transaction_location = Location.get_record_by_pid(
                transaction_location_pid)
        except PIDDeletedError:
            metadata["transaction_location"] = {
                "name": "This location was deleted."}
            return
        except PIDDoesNotExistError:
            metadata["transaction_location"] = {
                "name": "Location PID invalid."}
            return
        metadata["transaction_location"] = pick(
            transaction_location,
            "name")

    def transaction_user(self, metadata):
        """Get the transaction location object and add it a property."""
        transaction_user_pid = metadata.get("transaction_user_pid")
        if not transaction_user_pid:
            return
        Patron = current_app_ils.patron_cls
        try:
            transaction_user = Patron.get_patron(
                transaction_user_pid)
        except PIDDeletedError:
            return
        metadata["transaction_user"] = pick(
            transaction_user,
            "name")
