# -*- coding: utf-8 -*-
#
# Copyright (C) 2018 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""Ils API."""

from __future__ import absolute_import, print_function

from invenio_jsonschemas import current_jsonschemas
from invenio_pidstore.models import PersistentIdentifier
from invenio_records.api import Record

from .config import _DOCUMENT_PID_TYPE, _ITEM_PID_TYPE, _LOCATION_PID_TYPE


class IlsRecord(Record):
    """Ils record class."""

    @classmethod
    def get_record_by_pid(cls, pid_value):
        """Return the record given a pid value."""
        pid = PersistentIdentifier.get(
            pid_type=cls._pid_type, pid_value=pid_value
        )
        return cls.get_record(pid.object_uuid)


class Document(IlsRecord):
    """Document record class."""

    _pid_type = _DOCUMENT_PID_TYPE
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

    _pid_type = _ITEM_PID_TYPE
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

    _pid_type = _LOCATION_PID_TYPE
    _schema = "locations/location-v1.0.0.json"

    def __init__(self, data, model=None):
        """."""
        super(Location, self).__init__(data, model)

    @classmethod
    def create(cls, data, id_=None, **kwargs):
        """Create Location record"""
        data["$schema"] = current_jsonschemas.path_to_url(cls._schema)
        return super(Location, cls).create(data, id_=id_, **kwargs)
