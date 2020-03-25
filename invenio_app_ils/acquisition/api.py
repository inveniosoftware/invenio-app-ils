# -*- coding: utf-8 -*-
#
# Copyright (C) 2019-2020 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""Acquisition API."""

from functools import partial

from flask import current_app
from invenio_pidstore.models import PIDStatus
from invenio_pidstore.providers.recordid_v2 import RecordIdProviderV2

from invenio_app_ils.acquisition.proxies import current_ils_acq
from invenio_app_ils.errors import RecordHasReferencesError
from invenio_app_ils.fetchers import pid_fetcher
from invenio_app_ils.minters import pid_minter
from invenio_app_ils.records.api import IlsRecord

VENDOR_PID_TYPE = "acqvid"
VENDOR_PID_MINTER = "acqvid"
VENDOR_PID_FETCHER = "acqvid"

VendorIdProvider = type(
    "VendorIdProvider",
    (RecordIdProviderV2,),
    dict(pid_type=VENDOR_PID_TYPE, default_status=PIDStatus.REGISTERED),
)
vendor_pid_minter = partial(pid_minter, provider_cls=VendorIdProvider)
vendor_pid_fetcher = partial(pid_fetcher, provider_cls=VendorIdProvider)


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


ORDER_PID_TYPE = "acqoid"
ORDER_PID_MINTER = "acqoid"
ORDER_PID_FETCHER = "acqoid"

OrderIdProvider = type(
    "OrderIdProvider",
    (RecordIdProviderV2,),
    dict(pid_type=ORDER_PID_TYPE, default_status=PIDStatus.REGISTERED),
)
order_pid_minter = partial(pid_minter, provider_cls=OrderIdProvider)
order_pid_fetcher = partial(pid_fetcher, provider_cls=OrderIdProvider)


class Order(IlsRecord):
    """Acquisition order class."""

    _pid_type = ORDER_PID_TYPE
    _schema = "acq_orders/order-v1.0.0.json"
    _vendor_resolver_path = (
        "{scheme}://{host}/api/resolver/acquisition/orders/{order_pid}/vendor"
    )
    _order_lines_resolver_path = "{scheme}://{host}/api/resolver/acquisition/orders/{order_pid}/order-lines"

    STATUSES = ["PENDING", "ORDERED", "RECEIVED", "CANCELLED"]

    @classmethod
    def create(cls, data, id_=None, **kwargs):
        """Create record."""
        cls.build_resolver_fields(data)
        return super().create(data, id_=id_, **kwargs)

    def update(self, *args, **kwargs):
        """Update record."""
        super().update(*args, **kwargs)
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
