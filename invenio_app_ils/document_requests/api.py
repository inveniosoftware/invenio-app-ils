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

from invenio_app_ils.acquisition.api import ORDER_PID_TYPE
from invenio_app_ils.acquisition.proxies import current_ils_acq
from invenio_app_ils.errors import DocumentRequestError
from invenio_app_ils.fetchers import pid_fetcher
from invenio_app_ils.ill.api import BORROWING_REQUEST_PID_TYPE
from invenio_app_ils.ill.proxies import current_ils_ill
from invenio_app_ils.minters import pid_minter
from invenio_app_ils.proxies import current_app_ils
from invenio_app_ils.records.api import IlsRecord, RecordValidator

DOCUMENT_REQUEST_PID_TYPE = "dreqid"
DOCUMENT_REQUEST_PID_MINTER = "dreqid"
DOCUMENT_REQUEST_PID_FETCHER = "dreqid"

DocumentRequestIdProvider = type(
    "DocumentRequestIdProvider",
    (RecordIdProviderV2,),
    dict(
        pid_type=DOCUMENT_REQUEST_PID_TYPE, default_status=PIDStatus.REGISTERED
    ),
)
document_request_pid_minter = partial(
    pid_minter, provider_cls=DocumentRequestIdProvider
)
document_request_pid_fetcher = partial(
    pid_fetcher, provider_cls=DocumentRequestIdProvider
)


class DocumentRequestValidator(RecordValidator):
    """Document request record validator."""

    def validate_state(self, state, valid_states):
        """Validate state."""
        if state not in valid_states:
            raise DocumentRequestError("Invalid state: {}".format(state))

    def validate_document_pid(self, document_pid):
        """Validate document existence."""
        if document_pid:
            try:
                Document = current_app_ils.document_record_cls
                Document.get_record_by_pid(document_pid)
            except PIDDoesNotExistError:
                raise DocumentRequestError(
                    "The document with PID {} doesn't exist".format(
                        document_pid
                    )
                )

    def validate_physical_item_provider(self, physical_item_provider):
        """Validate physical_item_provider existence."""
        if physical_item_provider:

            pid = physical_item_provider.get("pid", None)
            pid_type = physical_item_provider.get("pid_type", None)
            if not pid or not pid_type:
                raise DocumentRequestError(
                    "The physical item provider must have both pid_type and "
                    "pid fields."
                )

            if pid_type == ORDER_PID_TYPE:
                Provider = current_ils_acq.order_record_cls
            elif pid_type == BORROWING_REQUEST_PID_TYPE:
                Provider = current_ils_ill.borrowing_request_record_cls
            else:
                raise DocumentRequestError(
                    "Unknown pid_type {}".format(pid_type)
                )

            try:
                Provider.get_record_by_pid(pid)
            except PIDDoesNotExistError:
                raise DocumentRequestError(
                    "Record with PID {0}:{1} doesn't exist".format(
                        pid_type, pid
                    )
                )

    def validate_decline(self, document_pid, state, decline_reason):
        """Validate decline is correct."""
        if state == "DECLINED" and not decline_reason:
            raise DocumentRequestError(
                "You have to provide a reason when declining a request"
            )

        if (
            state == "DECLINING"
            and decline_reason == "IN_CATALOG"
            and not document_pid
        ):
            raise DocumentRequestError(
                "Document Request cannot be declined with reason IN_CATALOG "
                "without providing a document_pid."
            )

    def validate_accept(self, document_pid, physical_item_provider, state):
        """Validate accept is correct."""
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
        decline_reason = record.get("decline_reason", None)
        physical_item_provider = record.get("physical_item_provider", None)

        self.validate_state(state, valid_states)
        self.validate_document_pid(document_pid)
        self.validate_physical_item_provider(physical_item_provider)
        self.validate_decline(document_pid, state, decline_reason)
        self.validate_accept(document_pid, physical_item_provider, state)


class DocumentRequest(IlsRecord):
    """DocumentRequest record class."""

    STATES = ["ACCEPTED", "PENDING", "DECLINED"]
    DECLINE_TYPES = ["USER_CANCEL", "IN_CATALOG", "NOT_FOUND", "OTHER"]

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
