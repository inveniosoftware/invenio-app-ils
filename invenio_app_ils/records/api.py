# -*- coding: utf-8 -*-
#
# Copyright (C) 2018-2019 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""Ils Records API."""

from __future__ import absolute_import, print_function

from elasticsearch import VERSION as ES_VERSION
from flask import current_app
from invenio_circulation.search.api import search_by_pid
from invenio_jsonschemas import current_jsonschemas
from invenio_pidstore.models import PersistentIdentifier
from invenio_pidstore.resolver import Resolver
from invenio_records.api import Record
from invenio_rest.errors import FieldError
from invenio_userprofiles.api import UserProfile
from jsonschema.exceptions import ValidationError
from werkzeug.utils import cached_property

from invenio_app_ils.errors import DocumentTagNotFoundError, \
    IlsValidationError, PatronNotFoundError, RecordHasReferencesError
from invenio_app_ils.records_relations.api import RecordRelationsMetadata, \
    RecordRelationsRetriever
from invenio_app_ils.search.api import DocumentRequestSearch, DocumentSearch, \
    InternalLocationSearch, ItemSearch

from ..pidstore.pids import DOCUMENT_PID_TYPE, DOCUMENT_REQUEST_PID_TYPE, \
    EITEM_PID_TYPE, INTERNAL_LOCATION_PID_TYPE, ITEM_PID_TYPE, \
    LOCATION_PID_TYPE, SERIES_PID_TYPE, TAG_PID_TYPE
from .validator import DocumentRequestValidator, ItemValidator, RecordValidator

lt_es7 = ES_VERSION[0] < 7


class IlsRecord(Record):
    """Ils record class."""

    _validator = RecordValidator()

    @cached_property
    def pid(self):
        """Get the PersistentIdentifier for this record."""
        return PersistentIdentifier.get(
            pid_type=self._pid_type, pid_value=self["pid"]
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
        """Create IlsRecord record."""
        data["$schema"] = current_jsonschemas.path_to_url(cls._schema)
        return super(IlsRecord, cls).create(data, id_=id_, **kwargs)

    def clear(self):
        """Clear IlsRecord data."""
        super(IlsRecord, self).clear()
        self["$schema"] = current_jsonschemas.path_to_url(self._schema)

    def validate(self, **kwargs):
        """Validate ILS record."""
        # JSON schema validation
        try:
            super(IlsRecord, self).validate(**kwargs)
        except ValidationError as jve:
            path = ".".join(str(x) for x in jve.path)
            errors = [FieldError(path, jve.message)]
            raise IlsValidationError(
                description="Record validation error",
                errors=errors,
                original_exception=jve
            )

        # Custom record validation
        if self._validator:
            self._validator.validate(self, **kwargs)


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

    def clear(self):
        """Clear IlsRecordWithRelations record."""
        relations_metadata_field_name = RecordRelationsMetadata.field_name()
        relations_metadata = self.get(relations_metadata_field_name, {})
        super(IlsRecordWithRelations, self).clear()
        self[relations_metadata_field_name] = relations_metadata

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
                ref_ids=sorted(ref for ref in related_refs),
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
    def build_resolver_fields(cls, data):
        """Build all resolver fields."""
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
        data["request"] = {
            "$ref": cls._document_request_resolver_path.format(
                scheme=current_app.config["JSONSCHEMAS_URL_SCHEME"],
                host=current_app.config["JSONSCHEMAS_HOST"],
                document_pid=data["pid"],
            )
        }

    @classmethod
    def create(cls, data, id_=None, **kwargs):
        """Create Document record."""
        cls.build_resolver_fields(data)
        return super(Document, cls).create(data, id_=id_, **kwargs)

    def update(self, data):
        """Update Document record."""
        super(Document, self).update(data)
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

        item_search = ItemSearch()
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

        req_search = DocumentRequestSearch()
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
            raise DocumentTagNotFoundError(self["pid"], tag["pid"])

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
    MEDIUMS = [
        "NOT_SPECIFIED",
        "ONLINE",
        "PAPER",
        "CDROM",
        "DVD",
        "VHS",
    ]

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
        return super(Item, cls).create(data, id_=id_, **kwargs)

    def update(self, data):
        """Update Item record."""
        super(Item, self).update(data)
        self.build_resolver_fields(self)

    def delete(self, **kwargs):
        """Delete Item record."""
        loan_search_res = search_by_pid(
            item_pid=self["pid"],
            filter_states=current_app.config["CIRCULATION_STATES_LOAN_ACTIVE"],
        )
        if loan_search_res.count():
            raise RecordHasReferencesError(
                record_type="Item",
                record_id=self["pid"],
                ref_type="Loan",
                ref_ids=sorted([res["pid"] for res in loan_search_res.scan()]),
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
    def build_resolver_fields(cls, data):
        """Build all resolver fields."""
        data["document"] = {
            "$ref": cls._document_resolver_path.format(
                scheme=current_app.config["JSONSCHEMAS_URL_SCHEME"],
                host=current_app.config["JSONSCHEMAS_HOST"],
                eitem_pid=data["pid"],
            )
        }

    @classmethod
    def create(cls, data, id_=None, **kwargs):
        """Create EItem record."""
        cls.build_resolver_fields(data)
        return super(EItem, cls).create(data, id_=id_, **kwargs)

    def update(self, data):
        """Update EItem record."""
        super(EItem, self).update(data)
        self.build_resolver_fields(self)


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
                ref_ids=sorted([res["pid"] for res in iloc_search_res.scan()]),
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
    def build_resolver_fields(cls, data):
        """Build all resolver fields."""
        data["location"] = {
            "$ref": cls._location_resolver_path.format(
                scheme=current_app.config["JSONSCHEMAS_URL_SCHEME"],
                host=current_app.config["JSONSCHEMAS_HOST"],
                internal_location_pid=data["pid"],
            )
        }

    @classmethod
    def create(cls, data, id_=None, **kwargs):
        """Create Internal Location record."""
        cls.build_resolver_fields(data)
        return super(InternalLocation, cls).create(data, id_=id_, **kwargs)

    def update(self, data):
        """Update InternalLocation data."""
        super(InternalLocation, self).update(data)
        self.build_resolver_fields(self)

    def delete(self, **kwargs):
        """Delete Location record."""
        item_search = ItemSearch()
        item_search_res = item_search.search_by_internal_location_pid(
            internal_location_pid=self["pid"]
        )

        if item_search_res.count():
            raise RecordHasReferencesError(
                record_type="Internal Location",
                record_id=self["pid"],
                ref_type="Item",
                ref_ids=sorted([res["pid"] for res in item_search_res.scan()]),
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
        doc_search_res = doc_search.search_by_tag_pid(tag_pid=self["pid"])
        if doc_search_res.count():
            raise RecordHasReferencesError(
                record_type="Tag",
                record_id=self["pid"],
                ref_type="Document",
                ref_ids=sorted([res["pid"] for res in doc_search_res.scan()]),
            )
        return super(Tag, self).delete(**kwargs)


class Patron(dict):
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
        _id = int(id)  # internally it is an int
        _datastore = current_app.extensions["security"].datastore
        # if not _id throw PatronNotFoundError(_id)
        user = _datastore.get_user(_id)
        if not user:
            raise PatronNotFoundError(_id)

        self._user = user
        self.id = self._user.id
        # set revision as it is needed by the indexer but always to the same
        # value as we don't need it
        self.revision_id = 1
        self._profile = UserProfile.get_by_userid(id)
        self.name = self._profile.full_name if self._profile else ""
        self.email = self._user.email

    def dumps(self):
        """Return python representation of Patron metadata."""
        return {
            "$schema": self._schema,
            "id": str(self.id),  # expose it as a string
            "name": self.name,
            "email": self.email,
        }

    def dumps_loader(self, **kwargs):
        """Return a simpler patron representation for loaders."""
        return {
            "id": str(self.id),
            "name": self.name,
            "email": self.email,
        }

    @staticmethod
    def get_patron(patron_pid):
        """Return the patron object given the patron_pid."""
        if not patron_pid:
            raise PatronNotFoundError(patron_pid)

        return Patron(patron_pid)


class Series(IlsRecordWithRelations):
    """Series record class."""

    _pid_type = SERIES_PID_TYPE
    _schema = "series/series-v1.0.0.json"
    _relations_path = (
        "{scheme}://{host}/api/resolver/series/{series_pid}/relations"
    )

    @classmethod
    def build_resolver_fields(cls, data):
        """Build all resolver fields."""
        data.setdefault("relations", {})
        data["relations"] = {
            "$ref": cls._relations_path.format(
                scheme=current_app.config["JSONSCHEMAS_URL_SCHEME"],
                host=current_app.config["JSONSCHEMAS_HOST"],
                series_pid=data["pid"],
            )
        }

    @classmethod
    def create(cls, data, id_=None, **kwargs):
        """Create Series record."""
        cls.build_resolver_fields(data)
        return super(Series, cls).create(data, id_=id_, **kwargs)

    def update(self, data):
        """Update Series record."""
        super(Series, self).update(data)
        self.build_resolver_fields(self)


class DocumentRequest(IlsRecord):
    """DocumentRequest record class."""

    STATES = ["ACCEPTED", "PENDING", "REJECTED"]

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
    def create(cls, data, id_=None, **kwargs):
        """Create DocumentRequest record."""
        if "state" not in data:
            data["state"] = "PENDING"
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
        return super(DocumentRequest, cls).create(data, id_=id_, **kwargs)
