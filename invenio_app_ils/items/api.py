# -*- coding: utf-8 -*-
#
# Copyright (C) 2020 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""ILS Items APIs."""

from functools import partial

from elasticsearch import VERSION as ES_VERSION
from flask import current_app
from invenio_circulation.search.api import search_by_pid
from invenio_pidstore.errors import (PersistentIdentifierError,
                                     PIDDoesNotExistError)
from invenio_pidstore.models import PIDStatus
from invenio_pidstore.providers.recordid_v2 import RecordIdProviderV2

from invenio_app_ils.errors import (ItemDocumentNotFoundError,
                                    ItemHasPastLoansError)
from invenio_app_ils.fetchers import pid_fetcher
from invenio_app_ils.minters import pid_minter
from invenio_app_ils.records.api import IlsRecord, RecordValidator

from ..circulation.utils import resolve_item_from_loan
from ..errors import RecordHasReferencesError
from ..proxies import current_app_ils

lt_es7 = ES_VERSION[0] < 7

ITEM_PID_TYPE = "pitmid"
ITEM_PID_MINTER = "pitmid"
ITEM_PID_FETCHER = "pitmid"

ItemIdProvider = type(
    "ItemIdProvider",
    (RecordIdProviderV2,),
    dict(pid_type=ITEM_PID_TYPE, default_status=PIDStatus.REGISTERED),
)
item_pid_minter = partial(pid_minter, provider_cls=ItemIdProvider)
item_pid_fetcher = partial(pid_fetcher, provider_cls=ItemIdProvider)


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
            latest_version_document_pid = latest_version.get("document_pid", None)
        document_changed = latest_version_document_pid != record.get("document_pid", None)
        if document_changed:
            pid = record["pid"]
            item_pid = dict(value=pid, type=ITEM_PID_TYPE)
            if search_by_pid(
                item_pid=item_pid,
                filter_states=current_app.config["CIRCULATION_STATES_LOAN_ACTIVE"]
                              + current_app.config["CIRCULATION_STATES_LOAN_COMPLETED"]
                              + current_app.config["CIRCULATION_STATES_LOAN_CANCELLED"],
            ).count():
                raise ItemHasPastLoansError("Not possible to update the document field if "
                                            "the item already has past or active loans.")

    def validate(self, record, **kwargs):
        """Validate record before create and commit."""
        super().validate(record, **kwargs)

        document_pid = record.get("document_pid", None)
        if document_pid:
            self.ensure_document_exists(document_pid)
        if record.created:
            self.ensure_item_can_be_updated(record)


class Item(IlsRecord):
    """Item record class."""

    _pid_type = ITEM_PID_TYPE
    _schema = "items/item-v1.0.0.json"
    _validator = ItemValidator()
    _loan_resolver_path = (
        "{scheme}://{host}/api/resolver/items/{item_pid}/loan"
    )
    _internal_location_resolver_path = (
        "{scheme}://{host}/api/resolver/items/{item_pid}/internal-location"
    )
    _document_resolver_path = (
        "{scheme}://{host}/api/resolver/items/{item_pid}/document"
    )
    STATUSES = [
        "CAN_CIRCULATE",
        "FOR_REFERENCE_ONLY",
        "MISSING",
        "IN_BINDING",
        "SCANNING",
    ]
    CIRCULATION_RESTRICTIONS = [
        "NO_RESTRICTION",
        "ONE_WEEK",
        "TWO_WEEKS",
        "THREE_WEEKS",
        "FOUR_WEEKS",
    ]

    @classmethod
    def get_document_pid(cls, item_pid):
        """Retrieve the referenced document PID of the given item PID."""
        item = cls.get_record_by_pid(item_pid)
        return item["document_pid"]

    @classmethod
    def build_resolver_fields(cls, data):
        """Build all resolver fields."""
        data["circulation"] = {
            "$ref": cls._loan_resolver_path.format(
                scheme=current_app.config["JSONSCHEMAS_URL_SCHEME"],
                host=current_app.config["JSONSCHEMAS_HOST"],
                item_pid=data["pid"],
            )
        }
        data["internal_location"] = {
            "$ref": cls._internal_location_resolver_path.format(
                scheme=current_app.config["JSONSCHEMAS_URL_SCHEME"],
                host=current_app.config["JSONSCHEMAS_HOST"],
                item_pid=data["pid"],
            )
        }
        data["document"] = {
            "$ref": cls._document_resolver_path.format(
                scheme=current_app.config["JSONSCHEMAS_URL_SCHEME"],
                host=current_app.config["JSONSCHEMAS_HOST"],
                item_pid=data["pid"],
            )
        }

    @classmethod
    def create(cls, data, id_=None, **kwargs):
        """Create Item record."""
        cls.build_resolver_fields(data)
        return super().create(data, id_=id_, **kwargs)

    def update(self, *args, **kwargs):
        """Update Item record."""
        super().update(*args, **kwargs)
        self.build_resolver_fields(self)

    def delete(self, **kwargs):
        """Delete Item record."""
        item_pid = dict(type=ITEM_PID_TYPE, value=self["pid"])
        loan_search_res = search_by_pid(
            item_pid=item_pid,
            filter_states=current_app.config["CIRCULATION_STATES_LOAN_ACTIVE"],
        )
        if loan_search_res.count():
            raise RecordHasReferencesError(
                record_type="Item",
                record_id=self["pid"],
                ref_type="Loan",
                ref_ids=sorted([res["pid"] for res in loan_search_res.scan()]),
            )
        return super().delete(**kwargs)


def get_item_pids_by_document_pid(document_pid):
    """Retrieve Items PIDs given a Document PID."""
    ItemSearch = current_app_ils.item_search_cls
    search = ItemSearch().search_by_document_pid(document_pid)
    for item in search.scan():
        yield dict(value=item["pid"], type=ITEM_PID_TYPE)


def get_document_pid_by_item_pid(item_pid):
    """Retrieve the Document PID of the given Item PID."""
    rec = resolve_item_from_loan(item_pid)
    return rec.get("document_pid")


def item_exists(item_pid):
    """Return True if the Item exists given a PID."""
    try:
        resolve_item_from_loan(item_pid)
    except PersistentIdentifierError:
        return False
    return True
