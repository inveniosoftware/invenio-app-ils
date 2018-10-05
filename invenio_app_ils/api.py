# -*- coding: utf-8 -*-
#
# Copyright (C) 2018 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""Ils API."""

from __future__ import absolute_import, print_function

from invenio_jsonschemas import current_jsonschemas
from invenio_pidstore.resolver import Resolver
from invenio_records.api import Record


class IlsRecord(Record):
    """Ils record class."""

    @classmethod
    def get_record_by_pid(cls, pid, with_deleted=False):
        """Get ils record by pid value."""
        resolver = Resolver(
            pid_type=cls._pid_type,
            object_type="rec",
            getter=cls.get_record,
        )
        persistent_identifier, record = resolver.resolve(str(pid))
        return record


class Document(IlsRecord):
    """Document record class."""

    _pid_type = 'docid'
    _schema = "documents/document-v1.0.0.json"

    def __init__(self, data, model=None):
        """."""
        super(Document, self).__init__(data, model)

    @classmethod
    def create(cls, data, id_=None, **kwargs):
        """Create Document record"""
        data["$schema"] = current_jsonschemas.path_to_url(cls._schema)
        return super(Document, cls).create(data, id_=id_, **kwargs)


class Item(IlsRecord):
    """Item record class."""

    _pid_type = 'itemid'
    _schema = "items/item-v1.0.0.json"

    def __init__(self, data, model=None):
        """."""
        super(Item, self).__init__(data, model)

    @classmethod
    def create(cls, data, id_=None, **kwargs):
        """Create Item record"""
        data["$schema"] = current_jsonschemas.path_to_url(cls._schema)
        return super(Item, cls).create(data, id_=id_, **kwargs)


class Location(IlsRecord):
    """Location record class."""

    _pid_type = 'locid'
    _schema = "locations/location-v1.0.0.json"

    def __init__(self, data, model=None):
        """."""
        super(Location, self).__init__(data, model)

    @classmethod
    def create(cls, data, id_=None, **kwargs):
        """Create Location record"""
        data["$schema"] = current_jsonschemas.path_to_url(cls._schema)
        return super(Location, cls).create(data, id_=id_, **kwargs)
