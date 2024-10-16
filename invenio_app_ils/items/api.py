# -*- coding: utf-8 -*-
#
# Copyright (C) 2020 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""ILS Items APIs."""

from functools import partial

from flask import current_app
from invenio_circulation.search.api import search_by_pid
from invenio_pidstore.errors import PersistentIdentifierError, PIDDoesNotExistError
from invenio_pidstore.models import PIDStatus
from invenio_pidstore.providers.recordid_v2 import RecordIdProviderV2

from invenio_app_ils.errors import (
    DocumentNotFoundError,
    InternalLocationNotFoundError,
    ItemHasPastLoansError,
)
from invenio_app_ils.fetchers import pid_fetcher
from invenio_app_ils.minters import pid_minter
from invenio_app_ils.records.api import IlsRecord, RecordValidator

from ..circulation.utils import resolve_item_from_loan
from ..errors import RecordHasReferencesError
from ..proxies import current_app_ils

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
        Document = current_app_ils.document_record_cls

        try:
            Document.get_record_by_pid(document_pid)
        except PIDDoesNotExistError:
            raise DocumentNotFoundError(document_pid)

    def ensure_internal_location_exists(self, internal_location_pid):
        """Ensure internal location exists or raise."""
        InternalLocation = current_app_ils.internal_location_record_cls

        try:
            InternalLocation.get_record_by_pid(internal_location_pid)
        except PIDDoesNotExistError:
            raise InternalLocationNotFoundError(internal_location_pid)

    def ensure_item_can_be_updated(self, record):
        """Raises an exception if the item's status cannot be updated."""
        document_changed = False
        has_previous_version = len(record.revisions) > 0
        if has_previous_version:
            latest_version = record.revisions[-1]
            latest_version_document_pid = latest_version["document_pid"]
            current_version_document_pid = record["document_pid"]
            document_changed = (
                latest_version_document_pid != current_version_document_pid
            )
        if document_changed:
            pid = record["pid"]
            item_pid = dict(value=pid, type=ITEM_PID_TYPE)
            has_loans = (
                search_by_pid(
                    item_pid=item_pid,
                    filter_states=current_app.config["CIRCULATION_STATES_LOAN_ACTIVE"]
                    + current_app.config["CIRCULATION_STATES_LOAN_COMPLETED"]
                    + current_app.config["CIRCULATION_STATES_LOAN_CANCELLED"],
                ).count()
                > 0
            )
            if has_loans:
                raise ItemHasPastLoansError(
                    "Not possible to update the document field if "
                    "the item already has past or active loans."
                )

    def validate(self, record, **kwargs):
        """Validate record before create and commit."""
        super().validate(record, **kwargs)

        document_pid = record["document_pid"]
        self.ensure_document_exists(document_pid)
        if record.created:
            self.ensure_item_can_be_updated(record)

        internal_location_pid = record["internal_location_pid"]
        self.ensure_internal_location_exists(internal_location_pid)


class Item(IlsRecord):
    """Item record class."""

    _pid_type = ITEM_PID_TYPE
    _schema = "items/item-v2.0.0.json"
    _validator = ItemValidator()
    _loan_resolver_path = "{scheme}://{host}/api/resolver/items/{item_pid}/loan"
    _internal_location_resolver_path = (
        "{scheme}://{host}/api/resolver/items/{item_pid}/internal-location"
    )
    _document_resolver_path = "{scheme}://{host}/api/resolver/items/{item_pid}/document"
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
    def enforce_constraints(cls, data, **kwargs):
        """Enforce constraints.

        :param data (dict): dict that can be mutated to enforce constraints.
        """
        # barcode is a required field and it should be always uppercase
        data["barcode"] = data["barcode"].upper()

    @classmethod
    def create(cls, data, id_=None, **kwargs):
        """Create Item record."""
        cls.build_resolver_fields(data)
        cls.enforce_constraints(data, **kwargs)
        created = super().create(data, id_=id_, **kwargs)
        return created

    def update(self, *args, **kwargs):
        """Update Item record."""
        super().update(*args, **kwargs)
        self.enforce_constraints(self)
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
