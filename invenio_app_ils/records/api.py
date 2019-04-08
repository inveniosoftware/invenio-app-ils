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
from invenio_jsonschemas import current_jsonschemas
from invenio_pidstore.resolver import Resolver
from invenio_records.api import Record
from invenio_userprofiles.api import UserProfile

from invenio_app_ils.errors import DocumentKeywordNotFoundError, \
    RecordHasReferencesError
from invenio_app_ils.search.api import DocumentSearch, \
    InternalLocationSearch, ItemSearch

from ..pidstore.pids import (  # isort:skip
    DOCUMENT_PID_TYPE,
    ITEM_PID_TYPE,
    EITEM_PID_TYPE,
    LOCATION_PID_TYPE,
    INTERNAL_LOCATION_PID_TYPE,
    KEYWORD_PID_TYPE,
)


class IlsRecord(Record):
    """Ils record class."""

    @classmethod
    def get_record_by_pid(cls, pid, with_deleted=False):
        """Get ils record by pid value."""
        resolver = Resolver(
            pid_type=cls._pid_type, object_type="rec", getter=cls.get_record
        )
        _, record = resolver.resolve(str(pid))
        return record

    @classmethod
    def create(cls, data, id_=None, **kwargs):
        """Create Document record."""
        data["$schema"] = current_jsonschemas.path_to_url(cls._schema)
        return super(IlsRecord, cls).create(data, id_=id_, **kwargs)


class Document(IlsRecord):
    """Document record class."""

    pid_field = "document_pid"
    _pid_type = DOCUMENT_PID_TYPE
    _schema = "documents/document-v1.0.0.json"
    _circulation_resolver_path = (
        "{scheme}://{host}/api/resolver/documents/{document_pid}/circulation"
    )
    _keyword_resolver_path = (
        "{scheme}://{host}/api/resolver/documents/{document_pid}/keywords"
    )
    _eitem_resolver_path = (
        "{scheme}://{host}/api/resolver/documents/{document_pid}/eitems"
    )

    @classmethod
    def create(cls, data, id_=None, **kwargs):
        """Create Document record."""
        data["circulation"] = {
            "$ref": cls._circulation_resolver_path.format(
                scheme=current_app.config["JSONSCHEMAS_URL_SCHEME"],
                host=current_app.config["JSONSCHEMAS_HOST"],
                document_pid=data[cls.pid_field],
            )
        }
        data["keywords"] = {
            "$ref": cls._keyword_resolver_path.format(
                scheme=current_app.config["JSONSCHEMAS_URL_SCHEME"],
                host=current_app.config["JSONSCHEMAS_HOST"],
                document_pid=data[cls.pid_field],
            )
        }
        data.setdefault("keyword_pids", [])
        data["eitems"] = {
            "$ref": cls._eitem_resolver_path.format(
                scheme=current_app.config["JSONSCHEMAS_URL_SCHEME"],
                host=current_app.config["JSONSCHEMAS_HOST"],
                document_pid=data[cls.pid_field],
            )
        }
        return super(Document, cls).create(data, id_=id_, **kwargs)

    def add_keyword(self, keyword):
        """Add a new keyword to the document."""
        if keyword["keyword_pid"] not in self["keyword_pids"]:
            self["keyword_pids"].append(keyword["keyword_pid"])

    def remove_keyword(self, keyword):
        """Remove a keyword from the document.

        :returns: True if keyword was removed
        """
        if keyword["keyword_pid"] not in self["keyword_pids"]:
            raise DocumentKeywordNotFoundError(
                self["document_pid"],
                keyword["keyword_pid"]
            )

        self["keyword_pids"].remove(keyword["keyword_pid"])
        return True


class _Item(IlsRecord):
    """Base class for items."""

    @classmethod
    def get_document_pid(cls, item_pid):
        """Retrieve the referenced document PID of the given item PID."""
        item = cls.get_record_by_pid(item_pid)
        item = item.replace_refs()
        if item.get("document") and item["document"].get(Document.pid_field):
            return item["document"][Document.pid_field]
        return None


class Item(_Item):
    """Item record class."""

    pid_field = "item_pid"
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
        data["circulation_status"] = {
            "$ref": cls._loan_resolver_path.format(
                scheme=current_app.config["JSONSCHEMAS_URL_SCHEME"],
                host=current_app.config["JSONSCHEMAS_HOST"],
                item_pid=data[cls.pid_field],
            )
        }
        data["internal_location"] = {
            "$ref": cls._internal_location_resolver_path.format(
                scheme=current_app.config["JSONSCHEMAS_URL_SCHEME"],
                host=current_app.config["JSONSCHEMAS_HOST"],
                item_pid=data[cls.pid_field],
            )
        }
        data["document"] = {
            "$ref": cls._document_resolver_path.format(
                scheme=current_app.config["JSONSCHEMAS_URL_SCHEME"],
                host=current_app.config["JSONSCHEMAS_HOST"],
                item_pid=data[cls.pid_field],
            )
        }
        return super(Item, cls).create(data, id_=id_, **kwargs)


class EItem(_Item):
    """EItem record class."""

    pid_field = "eitem_pid"
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
                eitem_pid=data[cls.pid_field],
            )
        }
        return super(EItem, cls).create(data, id_=id_, **kwargs)


class Location(IlsRecord):
    """Location record class."""

    pid_field = "location_pid"
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
            location_pid=self[Location.pid_field]
        )
        if iloc_search_res.count():
            raise RecordHasReferencesError(
                record_type='Location',
                record_id=self[Location.pid_field],
                ref_type='Internal Location',
                ref_ids=sorted([res[InternalLocation.pid_field]
                                for res in iloc_search_res.scan()])
            )
        return super(Location, self).delete(**kwargs)


class InternalLocation(IlsRecord):
    """Internal Location record class."""

    pid_field = "internal_location_pid"
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
                internal_location_pid=data[cls.pid_field],
            )
        }
        return super(InternalLocation, cls).create(data, id_=id_, **kwargs)

    def delete(self, **kwargs):
        """Delete Location record."""
        item_search = ItemSearch()
        item_search_res = item_search.search_by_internal_location_pid(
            internal_location_pid=self[InternalLocation.pid_field]
        )

        if item_search_res.count():
            raise RecordHasReferencesError(
                record_type='Internal Location',
                record_id=self[InternalLocation.pid_field],
                ref_type='Item',
                ref_ids=sorted([res[Item.pid_field]
                                for res in item_search_res.scan()])
            )
        return super(InternalLocation, self).delete(**kwargs)


class Keyword(IlsRecord):
    """Keyword record class."""

    pid_field = "keyword_pid"
    _pid_type = KEYWORD_PID_TYPE
    _schema = "keywords/keyword-v1.0.0.json"

    @classmethod
    def create(cls, data, id_=None, **kwargs):
        """Create Keyword record."""
        return super(Keyword, cls).create(data, id_=id_, **kwargs)

    def delete(self, **kwargs):
        """Delete Keyword record."""
        doc_search = DocumentSearch()
        doc_search_res = doc_search.search_by_keyword_pid(
            keyword_pid=self[Keyword.pid_field]
        )
        if doc_search_res.count():
            raise RecordHasReferencesError(
                record_type='Keyword',
                record_id=self[Keyword.pid_field],
                ref_type='Document',
                ref_ids=sorted([res[Document.pid_field]
                                for res in doc_search_res.scan()])
            )
        return super(Keyword, self).delete(**kwargs)


class Patron():
    """Patron record class."""

    _index = "patrons-patron-v1.0.0"
    _doc_type = "patron-v1.0.0"

    def __init__(self, id, revision_id=None):
        """Create a `Patron` instance.

        Patron instances are not stored in the database
        but are indexed in elasticsearch.
        """
        self.user = User.query.filter_by(id=id).one()
        self.id = self.user.id
        # set revision as it is needed by the indexer but always to the same
        # value as we dont need it
        self.revision_id = 1
        self.profile = UserProfile.get_by_userid(id)

    def dumps(self):
        """Return python representation of Patron meatadata."""
        return dict(
            id=self.id,
            name=self.profile.full_name if self.profile else '',
            email=self.user.email,
        )
