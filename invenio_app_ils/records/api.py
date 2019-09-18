# -*- coding: utf-8 -*-
#
# Copyright (C) 2018-2019 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""Ils Records API."""

from __future__ import absolute_import, print_function

from flask import current_app
from invenio_accounts.models import User
from invenio_circulation.proxies import current_circulation
from invenio_circulation.search.api import search_by_pid
from invenio_jsonschemas import current_jsonschemas
from invenio_pidstore.errors import PIDDoesNotExistError
from invenio_pidstore.models import PersistentIdentifier
from invenio_pidstore.resolver import Resolver
from invenio_records.api import Record
from invenio_userprofiles.api import UserProfile
from werkzeug.utils import cached_property

from invenio_app_ils.errors import DocumentRequestError, \
    DocumentTagNotFoundError, ItemDocumentNotFoundError, \
    ItemHasActiveLoanError, MissingRequiredParameterError, \
    PatronNotFoundError, RecordHasReferencesError
from invenio_app_ils.records_relations.api import RecordRelationsRetriever
from invenio_app_ils.search.api import DocumentRequestSearch, DocumentSearch, \
    InternalLocationSearch, ItemSearch

from ..pidstore.pids import (  # isort:skip
    DOCUMENT_PID_TYPE,
    DOCUMENT_REQUEST_PID_TYPE,
    EITEM_PID_TYPE,
    INTERNAL_LOCATION_PID_TYPE,
    ITEM_PID_TYPE,
    LOCATION_PID_TYPE,
    SERIES_PID_TYPE,
    TAG_PID_TYPE,
)


class IlsRecord(Record):
    """Ils record class."""

    @cached_property
    def pid(self):
        """Get the PersistentIdentifier for this record."""
        return PersistentIdentifier.get(
            pid_type=self._pid_type,
            pid_value=self["pid"],
        )

    @staticmethod
    def pid_type_to_record_class(pid_type):
        """Get the record class from the pid_type."""
        endpoints_cfg = current_app.config["RECORDS_REST_ENDPOINTS"]
        return endpoints_cfg[pid_type]["record_class"]

    @classmethod
    def get_record_by_pid(cls, pid, with_deleted=False, pid_type=None):
        """Get ils record by pid value."""
        if pid_type is None:
            pid_type = cls._pid_type
        else:
            new_cls = cls.pid_type_to_record_class(pid_type)
            return new_cls.get_record_by_pid(pid, with_deleted=with_deleted)

        resolver = Resolver(
            pid_type=pid_type, object_type="rec", getter=cls.get_record
        )
        _, record = resolver.resolve(str(pid))
        return record

    @classmethod
    def create(cls, data, id_=None, **kwargs):
        """Create Document record."""
        data["$schema"] = current_jsonschemas.path_to_url(cls._schema)
        getattr(cls, 'validate_create', lambda x: x)(data)
        return super(IlsRecord, cls).create(data, id_=id_, **kwargs)

    def patch(self, patch):
        """Validate patch metadata."""
        getattr(self, 'validate_patch', lambda x: x)(patch)
        return super(IlsRecord, self).patch(patch)

    def update(self, data):
        """Validate update metadata."""
        getattr(self, 'validate_update', lambda x: x)(data)
        super(IlsRecord, self).update(data)


class IlsRecordWithRelations(IlsRecord):
    """Add relations functionalities to records."""

    def __init__(self, data, model=None):
        """Record with relations."""
        super(IlsRecordWithRelations, self).__init__(data, model)
        self._relations = RecordRelationsRetriever(self)

    @property
    def relations(self):
        """Get record relations."""
        return self._relations

    def delete(self, **kwargs):
        """Delete record with relations."""
        related_refs = set()
        relations = self.relations.get()
        for name, related_objects in relations.items():
            for obj in related_objects:
                related_refs.add("{pid}:{pid_type}".format(**obj))
        if related_refs:
            raise RecordHasReferencesError(
                record_type=self.__class__.__name__,
                record_id=self["pid"],
                ref_type="related",
                ref_ids=sorted(ref for ref in related_refs)
            )


class Document(IlsRecordWithRelations):
    """Document record class."""

    _pid_type = DOCUMENT_PID_TYPE
    _schema = "documents/document-v1.0.0.json"
    _circulation_resolver_path = (
        "{scheme}://{host}/api/resolver/documents/{document_pid}/circulation"
    )
    _tag_resolver_path = (
        "{scheme}://{host}/api/resolver/documents/{document_pid}/tags"
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
    _document_request_resolver_path = (
        "{scheme}://{host}/api/resolver/documents/{document_pid}/request"
    )

    @classmethod
    def create(cls, data, id_=None, **kwargs):
        """Create Document record."""
        data["circulation"] = {
            "$ref": cls._circulation_resolver_path.format(
                scheme=current_app.config["JSONSCHEMAS_URL_SCHEME"],
                host=current_app.config["JSONSCHEMAS_HOST"],
                document_pid=data["pid"],
            )
        }
        data.setdefault("tag_pids", [])
        data["tags"] = {
            "$ref": cls._tag_resolver_path.format(
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
                document_pid=data["pid"]
            )
        }
        data.setdefault("items", {})
        data["items"] = {
            "$ref": cls._item_resolver_path.format(
                scheme=current_app.config["JSONSCHEMAS_URL_SCHEME"],
                host=current_app.config["JSONSCHEMAS_HOST"],
                document_pid=data["pid"]
            )
        }
        data["request"] = {
            "$ref": cls._document_request_resolver_path.format(
                scheme=current_app.config["JSONSCHEMAS_URL_SCHEME"],
                host=current_app.config["JSONSCHEMAS_HOST"],
                document_pid=data["pid"]
            )
        }
        return super(Document, cls).create(data, id_=id_, **kwargs)

    def delete(self, **kwargs):
        """Delete Document record."""
        loan_search_res = search_by_pid(
            document_pid=self["pid"],
            filter_states=['PENDING'] +
            current_app.config['CIRCULATION_STATES_LOAN_ACTIVE'],
        )
        if loan_search_res.count():
            raise RecordHasReferencesError(
                record_type="Document",
                record_id=self["pid"],
                ref_type="Loan",
                ref_ids=sorted(
                    [res["pid"] for res in loan_search_res.scan()]
                ),
            )

        item_search = ItemSearch()
        item_search_res = item_search.search_by_document_pid(
            document_pid=self["pid"]
        )
        if item_search_res.count():
            raise RecordHasReferencesError(
                record_type="Document",
                record_id=self["pid"],
                ref_type="Item",
                ref_ids=sorted(
                    [res["pid"] for res in item_search_res.scan()]
                ),
            )

        req_search = DocumentRequestSearch()
        req_search_res = req_search.search_by_document_pid(
            document_pid=self["pid"]
        )
        if req_search_res.count():
            raise RecordHasReferencesError(
                record_type="Document",
                record_id=self["pid"],
                ref_type="DocumentRequest",
                ref_ids=sorted(
                    [res["pid"] for res in req_search_res.scan()]
                ),
            )

        return super(Document, self).delete(**kwargs)

    def add_tag(self, tag):
        """Add a new tag to the document."""
        if tag["pid"] not in self["tag_pids"]:
            self["tag_pids"].append(tag["pid"])

    def remove_tag(self, tag):
        """Remove a tag from the document.

        :returns: True if tag was removed
        """
        if tag["pid"] not in self["tag_pids"]:
            raise DocumentTagNotFoundError(
                self["pid"], tag["pid"]
            )

        self["tag_pids"].remove(tag["pid"])
        return True


class _Item(IlsRecord):
    """Base class for items."""

    @classmethod
    def get_document_pid(cls, item_pid):
        """Retrieve the referenced document PID of the given item PID."""
        item = cls.get_record_by_pid(item_pid)
        return item.get("document_pid")


class Item(_Item):
    """Item record class."""

    _pid_type = ITEM_PID_TYPE
    _schema = "items/item-v1.0.0.json"
    _loan_resolver_path = (
        "{scheme}://{host}/api/resolver/items/{item_pid}/loan"
    )
    _internal_location_resolver_path = (
        "{scheme}://{host}/api/resolver/items/{item_pid}/internal-location"
    )
    _document_resolver_path = (
        "{scheme}://{host}/api/resolver/items/{item_pid}/document"
    )

    @classmethod
    def create(cls, data, id_=None, **kwargs):
        """Create Item record."""
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
        return super(Item, cls).create(data, id_=id_, **kwargs)

    def ensure_document_exists(self, document_pid):
        """Ensure document exists or raise."""
        try:
            Document.get_record_by_pid(document_pid)
        except PIDDoesNotExistError:
            raise ItemDocumentNotFoundError(document_pid)

    def validate_patch(self, patch):
        """Validate patch for Document."""
        for change in patch:
            if change['path'] == "/document_pid":
                self.ensure_document_exists(change['value'])

    def ensure_item_can_be_updated(self):
        """Raises an exception if the item's status cannot be updated."""
        loan_search = current_circulation.loan_search
        active_loan = loan_search\
            .get_active_loan_by_item_pid(self["pid"]).execute().hits
        if self["status"] == "CAN_CIRCULATE" and active_loan.total > 0:
            raise ItemHasActiveLoanError(active_loan[0]["pid"])

    def patch(self, patch):
        """Update Item record."""
        self.ensure_item_can_be_updated()
        return super(Item, self).patch(patch=patch)

    def delete(self, **kwargs):
        """Delete Item record."""
        loan_search_res = search_by_pid(
            item_pid=self["pid"],
            filter_states=current_app.config['CIRCULATION_STATES_LOAN_ACTIVE']
        )
        if loan_search_res.count():
            raise RecordHasReferencesError(
                record_type='Item',
                record_id=self["pid"],
                ref_type='Loan',
                ref_ids=sorted([res["pid"]
                                for res in loan_search_res.scan()])
            )
        return super(Item, self).delete(**kwargs)


class EItem(_Item):
    """EItem record class."""

    _pid_type = EITEM_PID_TYPE
    _schema = "eitems/eitem-v1.0.0.json"
    _document_resolver_path = (
        "{scheme}://{host}/api/resolver/eitems/{eitem_pid}/document"
    )

    @classmethod
    def create(cls, data, id_=None, **kwargs):
        """Create EItem record."""
        data["document"] = {
            "$ref": cls._document_resolver_path.format(
                scheme=current_app.config["JSONSCHEMAS_URL_SCHEME"],
                host=current_app.config["JSONSCHEMAS_HOST"],
                eitem_pid=data["pid"],
            )
        }
        return super(EItem, cls).create(data, id_=id_, **kwargs)


class Location(IlsRecord):
    """Location record class."""

    _pid_type = LOCATION_PID_TYPE
    _schema = "locations/location-v1.0.0.json"

    @classmethod
    def create(cls, data, id_=None, **kwargs):
        """Create Location record."""
        return super(Location, cls).create(data, id_=id_, **kwargs)

    def delete(self, **kwargs):
        """Delete Location record."""
        iloc_search = InternalLocationSearch()
        iloc_search_res = iloc_search.search_by_location_pid(
            location_pid=self["pid"]
        )
        if iloc_search_res.count():
            raise RecordHasReferencesError(
                record_type="Location",
                record_id=self["pid"],
                ref_type="Internal Location",
                ref_ids=sorted(
                    [
                        res["pid"]
                        for res in iloc_search_res.scan()
                    ]
                ),
            )
        return super(Location, self).delete(**kwargs)


class InternalLocation(IlsRecord):
    """Internal Location record class."""

    _pid_type = INTERNAL_LOCATION_PID_TYPE
    _schema = "internal_locations/internal_location-v1.0.0.json"
    _location_resolver_path = (
        "{scheme}://{host}/api/resolver/"
        "internal-locations/{internal_location_pid}/location"
    )

    @classmethod
    def create(cls, data, id_=None, **kwargs):
        """Create Internal Location record."""
        data["location"] = {
            "$ref": cls._location_resolver_path.format(
                scheme=current_app.config["JSONSCHEMAS_URL_SCHEME"],
                host=current_app.config["JSONSCHEMAS_HOST"],
                internal_location_pid=data["pid"],
            )
        }
        return super(InternalLocation, cls).create(data, id_=id_, **kwargs)

    def delete(self, **kwargs):
        """Delete Location record."""
        item_search = ItemSearch()
        item_search_res = item_search.search_by_internal_location_pid(
            internal_location_pid=self["pid"]
        )

        if item_search_res.count():
            raise RecordHasReferencesError(
                record_type='Internal Location',
                record_id=self["pid"],
                ref_type='Item',
                ref_ids=sorted([res["pid"]
                                for res in item_search_res.scan()])
            )
        return super(InternalLocation, self).delete(**kwargs)


class Tag(IlsRecord):
    """Tag record class."""

    _pid_type = TAG_PID_TYPE
    _schema = "tags/tag-v1.0.0.json"

    @classmethod
    def create(cls, data, id_=None, **kwargs):
        """Create Tag record."""
        return super(Tag, cls).create(data, id_=id_, **kwargs)

    def delete(self, **kwargs):
        """Delete Tag record."""
        doc_search = DocumentSearch()
        doc_search_res = doc_search.search_by_tag_pid(
            tag_pid=self["pid"]
        )
        if doc_search_res.count():
            raise RecordHasReferencesError(
                record_type='Tag',
                record_id=self["pid"],
                ref_type='Document',
                ref_ids=sorted([res["pid"]
                                for res in doc_search_res.scan()])
            )
        return super(Tag, self).delete(**kwargs)


class Patron:
    """Patron record class."""

    _index = "patrons-patron-v1.0.0"
    _doc_type = "patron-v1.0.0"
    # Fake schema used to identify pid type from ES hit
    _schema = "patrons/patron-v1.0.0.json"

    def __init__(self, id, revision_id=None):
        """Create a `Patron` instance.

        Patron instances are not stored in the database
        but are indexed in ElasticSearch.
        """
        self.user = User.query.filter_by(id=id).one()
        self.id = self.user.id
        # set revision as it is needed by the indexer but always to the same
        # value as we dont need it
        self.revision_id = 1
        self.profile = UserProfile.get_by_userid(id)

    def dumps(self):
        """Return python representation of Patron metadata."""
        return {
            "$schema": self._schema,
            "id": self.id,
            "name": self.profile.full_name if self.profile else "",
            "email": self.user.email,
        }

    @staticmethod
    def get_patron(patron_pid):
        """Return the patron object given the patron_pid."""
        if not patron_pid:
            raise PatronNotFoundError(patron_pid)

        _datastore = current_app.extensions["security"].datastore
        # if not patron_pid throw PatronNotFoundError(patron_pid)
        patron = _datastore.get_user(patron_pid)

        if not patron:
            raise PatronNotFoundError(patron_pid)
        if not patron.email:
            msg = "Patron with PID {} has no email address".format(patron_pid)
            raise MissingRequiredParameterError(description=msg)
        return patron


class Series(IlsRecordWithRelations):
    """Series record class."""

    _pid_type = SERIES_PID_TYPE
    _schema = "series/series-v1.0.0.json"

    _tag_resolver_path = (
        "{scheme}://{host}/api/resolver/series/{series_pid}/tags"
    )
    _relations_path = (
        "{scheme}://{host}/api/resolver/series/{series_pid}/relations"
    )

    @classmethod
    def create(cls, data, id_=None, **kwargs):
        """Create Series record."""
        data.setdefault("relations", {})
        data["relations"] = {
            "$ref": cls._relations_path.format(
                scheme=current_app.config["JSONSCHEMAS_URL_SCHEME"],
                host=current_app.config["JSONSCHEMAS_HOST"],
                series_pid=data["pid"],
            )
        }
        return super(Series, cls).create(data, id_=id_, **kwargs)


class DocumentRequest(IlsRecord):
    """DocumentRequest record class."""

    STATES = ["CANCELLED", "PENDING", "FULFILLED"]

    _pid_type = DOCUMENT_REQUEST_PID_TYPE
    _schema = "document_requests/document_request-v1.0.0.json"

    _document_resolver_path = (
        "{scheme}://{host}/api/resolver/document-requests/"
        "{document_request_pid}/document"
    )

    @classmethod
    def _validate_fulfilled(cls, document_pid):
        """Validate data for fulfilled state."""
        # Fulfilled requests must have a document
        if not document_pid:
            raise DocumentRequestError(
                "State cannot be 'FULFILLED' without a document"
            )
        try:
            document = Document.get_record_by_pid(document_pid)
            document = document.replace_refs()
            request = document["request"]
            if request:
                # The document cannot already have a request
                raise DocumentRequestError(
                    "Document with PID {} already has a request".format(
                        document_pid
                    )
                )
        except PIDDoesNotExistError:
            # Invalid document_pid
            raise DocumentRequestError(
                "State cannot be 'FULFILLED' because a document with "
                "PID {} doesn't exist".format(document_pid)
            )

    @classmethod
    def validate_create(cls, data):
        """Validate document request data."""
        if data.get("state", "") == "FULFILLED":
            cls._validate_fulfilled(data.get("document_pid", None))

    def validate_patch(self, ops):
        """Validate document request data."""
        # Check if state == 'FULFILLED' has been passed
        fulfilled_state = any(
            op['path'] == '/state' and op['value'] == 'FULFILLED'
            for op in ops
        )
        if fulfilled_state:
            # Fetch document_pid from ops
            document_pid = next((
                op['value']
                for op in ops if op['path'] == '/document_pid'
            ), None)
            self._validate_fulfilled(document_pid=document_pid)

    def validate_update(self, data):
        """Validate document request data."""
        if data.get("state", "") == "FULFILLED":
            self._validate_fulfilled(data.get("document_pid", None))

    @classmethod
    def create(cls, data, id_=None, **kwargs):
        """Create DocumentRequest record."""
        data["state"] = "PENDING"
        if "document_pid" in data:
            del data["document_pid"]
        data["document"] = {
            "$ref": cls._document_resolver_path.format(
                scheme=current_app.config["JSONSCHEMAS_URL_SCHEME"],
                host=current_app.config["JSONSCHEMAS_HOST"],
                document_request_pid=data["pid"],
            )
        }
        return super(DocumentRequest, cls).create(data, id_=id_, **kwargs)
