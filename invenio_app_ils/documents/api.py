# -*- coding: utf-8 -*-
#
# Copyright (C) 2020 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""ILS Document APIs."""

from functools import partial
from urllib.parse import quote_plus

from flask import current_app
from invenio_circulation.search.api import search_by_pid
from invenio_pidstore.errors import PersistentIdentifierError
from invenio_pidstore.models import PIDStatus
from invenio_pidstore.providers.recordid_v2 import RecordIdProviderV2

from invenio_app_ils.acquisition.proxies import current_ils_acq
from invenio_app_ils.errors import RecordHasReferencesError
from invenio_app_ils.fetchers import pid_fetcher
from invenio_app_ils.ill.proxies import current_ils_ill
from invenio_app_ils.minters import pid_minter
from invenio_app_ils.proxies import current_app_ils
from invenio_app_ils.records_relations.api import IlsRecordWithRelations
from invenio_app_ils.vocabularies.jsonresolvers.licenses import (
    REF_LICENSE_URL_ABSOLUTE_PATH,
)

DOCUMENT_PID_TYPE = "docid"
DOCUMENT_PID_MINTER = "docid"
DOCUMENT_PID_FETCHER = "docid"

DocumentIdProvider = type(
    "DocumentIdProvider",
    (RecordIdProviderV2,),
    dict(pid_type=DOCUMENT_PID_TYPE, default_status=PIDStatus.REGISTERED),
)
document_pid_minter = partial(pid_minter, provider_cls=DocumentIdProvider)
document_pid_fetcher = partial(pid_fetcher, provider_cls=DocumentIdProvider)


class Document(IlsRecordWithRelations):
    """Document record class."""

    DOCUMENT_TYPES = [
        "BOOK",
        "PROCEEDINGS",
        "STANDARD",
        "SERIAL_ISSUE",
        "ARTICLE",
    ]

    _pid_type = DOCUMENT_PID_TYPE
    _schema = "documents/document-v1.0.0.json"
    _circulation_resolver_path = (
        "{scheme}://{host}/api/resolver/documents/{document_pid}/circulation"
    )
    _item_resolver_path = (
        "{scheme}://{host}/api/resolver/documents/{document_pid}/items"
    )
    _eitem_resolver_path = (
        "{scheme}://{host}/api/resolver/documents/{document_pid}/eitems"
    )
    _relations_path = (
        "{scheme}://{host}/api/resolver/documents/{document_pid}/relations"
    )
    _stock_resolver_path = (
        "{scheme}://{host}/api/resolver/documents/{document_pid}/stock"
    )
    _license_resolver_path = REF_LICENSE_URL_ABSOLUTE_PATH

    @classmethod
    def build_resolver_fields(cls, data):
        """Build all resolver fields."""
        data["circulation"] = {
            "$ref": cls._circulation_resolver_path.format(
                scheme=current_app.config["JSONSCHEMAS_URL_SCHEME"],
                host=current_app.config["JSONSCHEMAS_HOST"],
                document_pid=data["pid"],
            )
        }
        data.setdefault("relations", {})
        data["relations"] = {
            "$ref": cls._relations_path.format(
                scheme=current_app.config["JSONSCHEMAS_URL_SCHEME"],
                host=current_app.config["JSONSCHEMAS_HOST"],
                document_pid=data["pid"],
            )
        }
        data.setdefault("eitems", {})
        data["eitems"] = {
            "$ref": cls._eitem_resolver_path.format(
                scheme=current_app.config["JSONSCHEMAS_URL_SCHEME"],
                host=current_app.config["JSONSCHEMAS_HOST"],
                document_pid=data["pid"],
            )
        }
        data.setdefault("items", {})
        data["items"] = {
            "$ref": cls._item_resolver_path.format(
                scheme=current_app.config["JSONSCHEMAS_URL_SCHEME"],
                host=current_app.config["JSONSCHEMAS_HOST"],
                document_pid=data["pid"],
            )
        }
        data["stock"] = {
            "$ref": cls._stock_resolver_path.format(
                scheme=current_app.config["JSONSCHEMAS_URL_SCHEME"],
                host=current_app.config["JSONSCHEMAS_HOST"],
                document_pid=data["pid"],
            )
        }

        for lic in data.get("licenses", []):
            license_id = quote_plus(lic["license"]["id"])
            lic["license"]["$ref"] = cls._license_resolver_path.format(
                scheme=current_app.config["JSONSCHEMAS_URL_SCHEME"],
                host=current_app.config["JSONSCHEMAS_HOST"],
                license_id=license_id,
            )

    @classmethod
    def create(cls, data, id_=None, **kwargs):
        """Create Document record."""
        cls.build_resolver_fields(data)
        return super().create(data, id_=id_, **kwargs)

    def update(self, *args, **kwargs):
        """Update Document record."""
        super().update(*args, **kwargs)
        self.build_resolver_fields(self)

    def delete(self, **kwargs):
        """Delete Document record."""
        loan_search_res = search_by_pid(
            document_pid=self["pid"],
            filter_states=["PENDING"]
            + current_app.config["CIRCULATION_STATES_LOAN_ACTIVE"],
        )
        if loan_search_res.count():
            raise RecordHasReferencesError(
                record_type="Document",
                record_id=self["pid"],
                ref_type="Loan",
                ref_ids=sorted([res["pid"] for res in loan_search_res.scan()]),
            )

        item_search = current_app_ils.item_search_cls()
        item_search_res = item_search.search_by_document_pid(
            document_pid=self["pid"]
        )
        if item_search_res.count():
            raise RecordHasReferencesError(
                record_type="Document",
                record_id=self["pid"],
                ref_type="Item",
                ref_ids=sorted([res["pid"] for res in item_search_res.scan()]),
            )

        eitem_search = current_app_ils.eitem_search_cls()
        eitem_search_res = eitem_search.search_by_document_pid(
            document_pid=self["pid"]
        )
        if eitem_search_res.count():
            raise RecordHasReferencesError(
                record_type="Document",
                record_id=self["pid"],
                ref_type="EItem",
                ref_ids=sorted([res["pid"] for res
                                in eitem_search_res.scan()]),
            )

        req_search = current_app_ils.document_request_search_cls()
        req_search_res = req_search.search_by_document_pid(
            document_pid=self["pid"]
        )
        if req_search_res.count():
            raise RecordHasReferencesError(
                record_type="Document",
                record_id=self["pid"],
                ref_type="DocumentRequest",
                ref_ids=sorted([res["pid"] for res in req_search_res.scan()]),
            )
        order_search = current_ils_acq.order_search_cls()
        orders_refs_search = order_search.search_by_document_pid(
            document_pid=self["pid"],
        )
        if orders_refs_search.count():
            raise RecordHasReferencesError(
                record_type="Document",
                record_id=self["pid"],
                ref_type="AcquisitionOrder",
                ref_ids=sorted([res["pid"] for
                                res in orders_refs_search.scan()]),
            )
        brw_req_search = current_ils_ill.borrowing_request_search_cls()
        brw_req_refs_search = brw_req_search.search_by_document_pid(
            document_pid=self["pid"],
        )
        if brw_req_refs_search.count():
            raise RecordHasReferencesError(
                record_type="Document",
                record_id=self["pid"],
                ref_type="BorrowingRequest",
                ref_ids=sorted([res["pid"] for
                                res in brw_req_refs_search.scan()]),
            )
        return super().delete(**kwargs)


def document_exists(document_pid):
    """Return True if the Document exists given a PID."""
    Document = current_app_ils.document_record_cls
    try:
        Document.get_record_by_pid(document_pid)
    except PersistentIdentifierError:
        return False
    return True
