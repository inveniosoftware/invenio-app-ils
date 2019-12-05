# -*- coding: utf-8 -*-
#
# Copyright (C) 2019 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""Acquisition API."""

from invenio_jsonschemas import current_jsonschemas
from invenio_pidstore.models import PersistentIdentifier
from invenio_records.api import Record
from werkzeug.utils import cached_property


class AcquisitionRecord(Record):
    """Acquisition base record."""

    @classmethod
    def create(cls, data, id_=None, **kwargs):
        """Create IlsRecord record."""
        data["$schema"] = current_jsonschemas.path_to_url(cls._schema)
        return super(AcquisitionRecord, cls).create(data, id_=id_, **kwargs)


class Vendor(AcquisitionRecord):
    """Acquisition vendor class."""

    _schema = "acq-vendors/vendor-v1.0.0.json"

    @cached_property
    def pid(self):
        """Get the PersistentIdentifier for this record."""
        return PersistentIdentifier.get(
            pid_type=self._pid_type, pid_value=self["pid"]
        )


class Order(AcquisitionRecord):
    """Acquisition order class."""

    _schema = "acq-orders/order-v1.0.0.json"

    STATUSES = [
        "PENDING",
        "ORDERED",
        "PARTIALLY_RECEIVED",
        "RECEIVED",
        "CANCELLED"
    ]

    @cached_property
    def pid(self):
        """Get the PersistentIdentifier for this record."""
        return PersistentIdentifier.get(
            pid_type=self._pid_type, pid_value=self["pid"]
        )
