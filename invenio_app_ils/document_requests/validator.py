# -*- coding: utf-8 -*-
#
# Copyright (C) 2020 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""Document Request validator."""

from invenio_pidstore.errors import PIDDoesNotExistError

from invenio_app_ils.document_requests.search import DocumentRequestSearch
from invenio_app_ils.errors import DocumentRequestError
from invenio_app_ils.records.validator import RecordValidator


class DocumentRequestValidator(RecordValidator):
    """Document request record validator."""

    def validate_state(self, state, valid_states):
        """Validate state."""
        if state not in valid_states:
            raise DocumentRequestError("Invalid state: {}".format(state))

    def validate_document_pid(self, document_pid, state, reject_reason):
        """Validate data for accepted state."""
        # Requests must have a document and a provider (ILL, ACQ)
        if document_pid:
            try:
                search = DocumentRequestSearch()
                search.search_by_document_pid(document_pid)
            except PIDDoesNotExistError:
                # Missing document_pid
                raise DocumentRequestError(
                    "State cannot be ACCEPTED because a document with "
                    "PID {} doesn't exist".format(document_pid)
                )

        if state == "ACCEPTED" and not document_pid:
            raise DocumentRequestError(
                "State cannot be ACCEPTED without a document"
            )

    def validate_rejection(self, document_pid, state, reject_reason):
        """Validate rejection is correct."""
        if state == "REJECTED" and not reject_reason:
            raise DocumentRequestError(
                "Need to provide a reason when rejecting a request"
            )

        if state == "REJECTED" and reject_reason == 'IN_CATALOG' and \
                not document_pid:
            raise DocumentRequestError(
                "Document Request cannot be Rejected with reason IN_CATALOG "
                "without providing a document_pid."
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
        self.validate_rejection(document_pid, state, reject_reason)
