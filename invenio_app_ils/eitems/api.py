# -*- coding: utf-8 -*-
#
# Copyright (C) 2020 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""ILS Eitems APIs."""

from functools import partial

from flask import current_app
from invenio_files_rest.models import ObjectVersion
from invenio_pidstore.errors import PIDDoesNotExistError
from invenio_pidstore.models import PIDStatus
from invenio_pidstore.providers.recordid_v2 import RecordIdProviderV2

from invenio_app_ils.errors import DocumentNotFoundError
from invenio_app_ils.fetchers import pid_fetcher
from invenio_app_ils.minters import pid_minter
from invenio_app_ils.proxies import current_app_ils
from invenio_app_ils.records.api import IlsRecord, RecordValidator

EITEM_PID_TYPE = "eitmid"
EITEM_PID_MINTER = "eitmid"
EITEM_PID_FETCHER = "eitmid"

EItemIdProvider = type(
    "EItemIdProvider",
    (RecordIdProviderV2,),
    dict(pid_type=EITEM_PID_TYPE, default_status=PIDStatus.REGISTERED),
)
eitem_pid_minter = partial(pid_minter, provider_cls=EItemIdProvider)
eitem_pid_fetcher = partial(pid_fetcher, provider_cls=EItemIdProvider)


class EItemValidator(RecordValidator):
    """EItem record validator."""

    def ensure_document_exists(self, document_pid):
        """Ensure document exists or raise."""
        Document = current_app_ils.document_record_cls
        try:
            Document.get_record_by_pid(document_pid)
        except PIDDoesNotExistError:
            raise DocumentNotFoundError(document_pid)

    def validate(self, record, **kwargs):
        """Validate record before create and commit."""
        super().validate(record, **kwargs)

        document_pid = record["document_pid"]

        self.ensure_document_exists(document_pid)


class EItem(IlsRecord):
    """EItem record class."""

    _pid_type = EITEM_PID_TYPE
    _schema = "eitems/eitem-v1.0.0.json"
    _document_resolver_path = (
        "{scheme}://{host}/api/resolver/eitems/{eitem_pid}/document"
    )
    _files_resolver_path = (
        "{scheme}://{host}/api/resolver/eitems/{eitem_pid}/files"
    )
    _validator = EItemValidator()

    @classmethod
    def get_document_pid(cls, eitem_pid):
        """Retrieve the referenced document PID of the given item PID."""
        eitem = cls.get_record_by_pid(eitem_pid)
        return eitem["document_pid"]

    @classmethod
    def build_resolver_fields(cls, data):
        """Build all resolver fields."""
        data["document"] = {
            "$ref": cls._document_resolver_path.format(
                scheme=current_app.config["JSONSCHEMAS_URL_SCHEME"],
                host=current_app.config["JSONSCHEMAS_HOST"],
                eitem_pid=data["pid"],
            )
        }
        data["files"] = {
            "$ref": cls._files_resolver_path.format(
                scheme=current_app.config["JSONSCHEMAS_URL_SCHEME"],
                host=current_app.config["JSONSCHEMAS_HOST"],
                eitem_pid=data["pid"],
            )
        }

    @classmethod
    def create(cls, data, id_=None, **kwargs):
        """Create EItem record."""
        cls.build_resolver_fields(data)
        return super().create(data, id_=id_, **kwargs)

    def update(self, *args, **kwargs):
        """Update EItem record."""
        super().update(*args, **kwargs)
        self.build_resolver_fields(self)

    @property
    def files(self):
        """Get EItem files."""
        if "bucket_id" not in self:
            return []
        return ObjectVersion.get_by_bucket(self["bucket_id"]).limit(1000).all()


def eitem_event_builder(event, sender_app, obj=None, **kwargs):
    """Add eitem metadata to the event."""
    record = kwargs["record"]
    event.update(
        dict(eitem_pid=record["pid"], document_pid=record.get("document_pid"))
    )
    return event
