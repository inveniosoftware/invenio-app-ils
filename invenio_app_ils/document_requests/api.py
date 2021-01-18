# -*- coding: utf-8 -*-
#
# Copyright (C) 2020 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""DocumentRequest API."""

from functools import partial

from flask import current_app
from invenio_pidstore.errors import PIDDoesNotExistError
from invenio_pidstore.models import PIDStatus
from invenio_pidstore.providers.recordid_v2 import RecordIdProviderV2

from invenio_app_ils.document_requests.search import DocumentRequestSearch
from invenio_app_ils.errors import DocumentRequestError
from invenio_app_ils.fetchers import pid_fetcher
from invenio_app_ils.minters import pid_minter
from invenio_app_ils.records.api import IlsRecord, RecordValidator

DOCUMENT_REQUEST_PID_TYPE = "dreqid"
DOCUMENT_REQUEST_PID_MINTER = "dreqid"
DOCUMENT_REQUEST_PID_FETCHER = "dreqid"

DocumentRequestIdProvider = type(
    'DocumentRequestIdProvider',
    (RecordIdProviderV2,),
    dict(pid_type=DOCUMENT_REQUEST_PID_TYPE, default_status=PIDStatus.REGISTERED)
)
document_request_pid_minter = partial(pid_minter, provider_cls=DocumentRequestIdProvider)
document_request_pid_fetcher = partial(pid_fetcher, provider_cls=DocumentRequestIdProvider)


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

    def validate_acceptance(self, document_pid, physical_item_provider, state):
        """Validate rejection is correct."""
        if state == "ACCEPTED" and (
            not document_pid or not physical_item_provider
        ):
            raise DocumentRequestError(
                "Need to provide a document_pid and a physical_item_provider "
                "when accepting a request"
            )

    def validate(self, record, **kwargs):
        """Validate record before create and commit."""
        super().validate(record, **kwargs)

        valid_states = record.STATES

        document_pid = record.get("document_pid", None)
        state = record.get("state", None)
        reject_reason = record.get("reject_reason", None)
        physical_item_provider = record.get("physical_item_provider", None)

        self.validate_state(state, valid_states)
        self.validate_document_pid(document_pid, state, reject_reason)
        self.validate_rejection(document_pid, state, reject_reason)
        self.validate_acceptance(document_pid, physical_item_provider, state)


class DocumentRequest(IlsRecord):
    """DocumentRequest record class."""

    STATES = ["ACCEPTED", "PENDING", "REJECTED"]
    REJECT_TYPES = ["USER_CANCEL", "IN_CATALOG", "NOT_FOUND", "OTHER"]

    _pid_type = DOCUMENT_REQUEST_PID_TYPE
    _schema = "document_requests/document_request-v1.0.0.json"
    _validator = DocumentRequestValidator()

    _document_resolver_path = (
        "{scheme}://{host}/api/resolver/document-requests/"
        "{document_request_pid}/document"
    )
    _patron_resolver_path = (
        "{scheme}://{host}/api/resolver/document-requests/"
        "{document_request_pid}/patron"
    )

    @classmethod
    def build_resolver_fields(cls, data):
        """Build all resolver fields."""
        data["document"] = {
            "$ref": cls._document_resolver_path.format(
                scheme=current_app.config["JSONSCHEMAS_URL_SCHEME"],
                host=current_app.config["JSONSCHEMAS_HOST"],
                document_request_pid=data["pid"],
            )
        }
        data["patron"] = {
            "$ref": cls._patron_resolver_path.format(
                scheme=current_app.config["JSONSCHEMAS_URL_SCHEME"],
                host=current_app.config["JSONSCHEMAS_HOST"],
                document_request_pid=data["pid"],
            )
        }

    @classmethod
    def create(cls, data, id_=None, **kwargs):
        """Create DocumentRequest record."""
        if "state" not in data:
            data["state"] = "PENDING"
        cls.build_resolver_fields(data)
        return super().create(data, id_=id_, **kwargs)

    def update(self, *args, **kwargs):
        """Update DocumentRequest record."""
        super().update(*args, **kwargs)
        self.build_resolver_fields(self)
