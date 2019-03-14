# -*- coding: utf-8 -*-
#
# Copyright (C) 2018-2019 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""Ils Records API."""

from __future__ import absolute_import, print_function

from flask import current_app
from invenio_jsonschemas import current_jsonschemas
from invenio_pidstore.resolver import Resolver
from invenio_records.api import Record

from invenio_app_ils.errors import DocumentKeywordNotFoundError

from ..pidstore.pids import (  # isort:skip
    DOCUMENT_PID_TYPE,
    INTERNAL_LOCATION_PID_TYPE,
    ITEM_PID_TYPE,
    KEYWORD_PID_TYPE,
    LOCATION_PID_TYPE,
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

    @classmethod
    def create(cls, data, id_=None, **kwargs):
        """Create Item record."""
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


class Item(IlsRecord):
    """Item record class."""

    pid_field = "item_pid"
    _pid_type = ITEM_PID_TYPE
    _schema = "items/item-v1.0.0.json"
    _loan_resolver_path = (
        "{scheme}://{host}/api/resolver/circulation/items/{item_pid}/loan"
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


class Location(IlsRecord):
    """Location record class."""

    pid_field = "location_pid"
    _pid_type = LOCATION_PID_TYPE
    _schema = "locations/location-v1.0.0.json"

    @classmethod
    def create(cls, data, id_=None, **kwargs):
        """Create Location record."""
        return super(Location, cls).create(data, id_=id_, **kwargs)


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


class Keyword(IlsRecord):
    """Keyword record class."""

    pid_field = "keyword_pid"
    _pid_type = KEYWORD_PID_TYPE
    _schema = "keywords/keyword-v1.0.0.json"

    @classmethod
    def create(cls, data, id_=None, **kwargs):
        """Create Keyword record."""
        return super(Keyword, cls).create(data, id_=id_, **kwargs)
