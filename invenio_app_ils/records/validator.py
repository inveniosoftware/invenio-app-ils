# -*- coding: utf-8 -*-
#
# Copyright (C) 2019 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""Ils Record Validators."""

from __future__ import absolute_import, print_function

from elasticsearch import VERSION as ES_VERSION
from invenio_circulation.proxies import current_circulation
from invenio_pidstore.errors import PIDDoesNotExistError

from invenio_app_ils.errors import DocumentRequestError, \
    ItemDocumentNotFoundError, ItemHasActiveLoanError
from invenio_app_ils.search.api import DocumentRequestSearch

lt_es7 = ES_VERSION[0] < 7


class RecordValidator(object):
    """ILS record validator."""

    def validate(self, record, **kwargs):
        """Validate record before create and commit.

        :param record: Record to be validated.
        :param kwargs: Keyword arguments passed from RecordBase:validate.
        """
        pass


class DocumentRequestValidator(RecordValidator):
    """Document request record validator."""

    def validate_state(self, state, valid_states):
        """Validate state."""
        if state not in valid_states:
            raise DocumentRequestError(
                "Invalid state: {}".format(state)
            )

    def validate_document_pid(self, document_pid, state, reject_reason):
        """Validate data for accepted state."""
        # Accepted requests must have a document
        if document_pid and state == "REJECTED" and \
                reject_reason != "IN_CATALOG":
            raise DocumentRequestError(
                "document_pid cannot be provided with state {} and reject "
                "type {}".format(state, reject_reason)
            )
        if state == "ACCEPTED":
            if document_pid:
                try:
                    search = DocumentRequestSearch()
                    count = search.search_by_document_pid(document_pid).count()
                    if count > 0:
                        raise DocumentRequestError(
                            "Document PID {} already has a request".format(
                                document_pid
                            )
                        )
                except PIDDoesNotExistError:
                    # Invalid document_pid
                    raise DocumentRequestError(
                        "State cannot be ACCEPTED because a document with "
                        "PID {} doesn't exist".format(document_pid)
                    )
            else:
                raise DocumentRequestError(
                    "State cannot be ACCEPTED without a document"
                )

    def validate_rejection(self, state, reject_reason):
        """Validate rejection is correct."""
        if state == "REJECTED" and not reject_reason:
            raise DocumentRequestError(
                "Need to provide a reason when rejecting a request"
            )

    def validate(self, record, **kwargs):
        """Validate record before create and commit."""
        super(DocumentRequestValidator, self).validate(record, **kwargs)

        valid_states = record.STATES

        document_pid = record.get("document_pid", None)
        state = record.get("state", None)
        reject_reason = record.get("reject_reason", None)

        self.validate_state(state, valid_states)
        self.validate_document_pid(document_pid, state, reject_reason)
        self.validate_rejection(state, reject_reason)


class ItemValidator(RecordValidator):
    """Item record validator."""

    def ensure_document_exists(self, document_pid):
        """Ensure document exists or raise."""
        from invenio_app_ils.documents.api import Document
        try:
            Document.get_record_by_pid(document_pid)
        except PIDDoesNotExistError:
            raise ItemDocumentNotFoundError(document_pid)

    def ensure_item_can_be_updated(self, record):
        """Raises an exception if the item's status cannot be updated."""
        latest_version = record.revisions[-1]
        if latest_version:
            status = latest_version.get("status", None)
        else:
            status = None
        pid = record["pid"]
        if status == "CAN_CIRCULATE":
            search = current_circulation.loan_search
            active_loan = (
                search.get_active_loan_by_item_pid(pid).execute().hits
            )
            total = active_loan.total if lt_es7 else active_loan.total.value
            if total > 0:
                raise ItemHasActiveLoanError(active_loan[0]["pid"])

    def validate(self, record, **kwargs):
        """Validate record before create and commit."""
        super(ItemValidator, self).validate(record, **kwargs)

        document_pid = record.get("document_pid", None)
        if document_pid:
            self.ensure_document_exists(document_pid)
        if record.created:
            self.ensure_item_can_be_updated(record)
