# -*- coding: utf-8 -*-
#
# Copyright (C) 2020 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""DocumentRequest API."""

from functools import partial

from flask import current_app
from invenio_pidstore.models import PIDStatus
from invenio_pidstore.providers.recordid_v2 import RecordIdProviderV2

from invenio_app_ils.fetchers import pid_fetcher
from invenio_app_ils.minters import pid_minter
from invenio_app_ils.records.api import IlsRecord

from .validator import DocumentRequestValidator

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


class DocumentRequest(IlsRecord):
    """DocumentRequest record class."""

    STATES = ["ACCEPTED", "PENDING", "REJECTED"]
    REJECT_TYPES = ["USER_CANCEL", "IN_CATALOG", "NOT_FOUND"]

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
