# -*- coding: utf-8 -*-
#
# Copyright (C) 2019 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""Acquisition API."""

from flask import current_app

from invenio_app_ils.acquisition.proxies import current_ils_acq
from invenio_app_ils.errors import RecordHasReferencesError
from invenio_app_ils.records.api import IlsRecord

from .pidstore.pids import ORDER_PID_TYPE, VENDOR_PID_TYPE


class Vendor(IlsRecord):
    """Acquisition vendor class."""

    _pid_type = VENDOR_PID_TYPE
    _schema = "acq_vendors/vendor-v1.0.0.json"

    def delete(self, **kwargs):
        """Delete record."""
        search_cls = current_ils_acq.order_search_cls
        order_search_res = search_cls().search_by_vendor_pid(self["pid"])
        if order_search_res.count():
            raise RecordHasReferencesError(
                record_type="Vendor",
                record_id=self["pid"],
                ref_type="Order",
                ref_ids=sorted(
                    [res["pid"] for res in order_search_res.scan()]
                ),
            )
        return super().delete(**kwargs)


class Order(IlsRecord):
    """Acquisition order class."""

    _pid_type = ORDER_PID_TYPE
    _schema = "acq_orders/order-v1.0.0.json"
    _vendor_resolver_path = (
        "{scheme}://{host}/api/resolver/acquisition/orders/{order_pid}/vendor"
    )
    _order_lines_resolver_path = (
        "{scheme}://{host}/api/resolver/acquisition/orders/{order_pid}/order-lines"
    )

    STATUSES = [
        "PENDING",
        "ORDERED",
        "RECEIVED",
        "CANCELLED"
    ]

    @classmethod
    def create(cls, data, id_=None, **kwargs):
        """Create record."""
        cls.build_resolver_fields(data)
        return super().create(data, id_=id_, **kwargs)

    def update(self, data):
        """Update record."""
        super().update(data)
        self.build_resolver_fields(self)

    @classmethod
    def build_resolver_fields(cls, data):
        """Build resolver fields."""
        data["vendor"] = {
            "$ref": cls._vendor_resolver_path.format(
                scheme=current_app.config["JSONSCHEMAS_URL_SCHEME"],
                host=current_app.config["JSONSCHEMAS_HOST"],
                order_pid=data["pid"],
            )
        }
        data["resolved_order_lines"] = {
            "$ref": cls._order_lines_resolver_path.format(
                scheme=current_app.config["JSONSCHEMAS_URL_SCHEME"],
                host=current_app.config["JSONSCHEMAS_HOST"],
                order_pid=data["pid"],
            )
        }
