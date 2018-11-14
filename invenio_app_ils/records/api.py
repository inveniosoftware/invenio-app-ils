# -*- coding: utf-8 -*-
#
# Copyright (C) 2018 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""Ils Records API."""

from __future__ import absolute_import, print_function

from flask import current_app
from invenio_jsonschemas import current_jsonschemas
from invenio_pidstore.resolver import Resolver
from invenio_records.api import Record

from ..errors import IlsException

from ..pidstore.pids import (  # isort:skip
    DOCUMENT_PID_TYPE,
    INTERNAL_LOCATION_PID_TYPE,
    ITEM_PID_TYPE,
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


class Item(IlsRecord):
    """Item record class."""

    pid_field = "item_pid"
    _pid_type = ITEM_PID_TYPE
    _schema = "items/item-v1.0.0.json"

    @classmethod
    def create(cls, data, id_=None, **kwargs):
        """Create Item record."""
        data["circulation_status"] = {
            "$ref": "{scheme}://{host}/api/circulation/items/{pid_value}/loan".format(
                scheme=current_app.config["JSONSCHEMAS_URL_SCHEME"],
                host=current_app.config["JSONSCHEMAS_HOST"],
                pid_value=data[cls.pid_field],
            )
        }
        if InternalLocation.pid_field not in data:
            raise IlsException("Internal Location pid is required")

        data["internal_location"] = {
            "$ref": "{scheme}://{host}/api/internal-locations/{pid_value}".format(
                scheme=current_app.config["JSONSCHEMAS_URL_SCHEME"],
                host=current_app.config["JSONSCHEMAS_HOST"],
                pid_value=data[InternalLocation.pid_field],
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

    @classmethod
    def create(cls, data, id_=None, **kwargs):
        """Create Internal Location record."""
        if Location.pid_field not in data:
            raise IlsException("Location pid is required")

        data["location"] = {
            "$ref": "{scheme}://{host}/api/locations/{pid_value}".format(
                scheme=current_app.config["JSONSCHEMAS_URL_SCHEME"],
                host=current_app.config["JSONSCHEMAS_HOST"],
                pid_value=data[Location.pid_field],
            )
        }
        return super(InternalLocation, cls).create(data, id_=id_, **kwargs)
