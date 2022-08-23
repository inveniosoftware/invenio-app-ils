# -*- coding: utf-8 -*-
#
# Copyright (C) 2019-2020 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""Acquisition API."""

from functools import partial

from flask import current_app
from invenio_pidstore.errors import PIDDoesNotExistError
from invenio_pidstore.models import PIDStatus
from invenio_pidstore.providers.recordid_v2 import RecordIdProviderV2

from invenio_app_ils.acquisition.errors import AcquisitionError
from invenio_app_ils.errors import DocumentNotFoundError, PatronNotFoundError
from invenio_app_ils.fetchers import pid_fetcher
from invenio_app_ils.minters import pid_minter
from invenio_app_ils.providers.errors import ProviderNotFoundError
from invenio_app_ils.providers.proxies import current_ils_prov
from invenio_app_ils.proxies import current_app_ils
from invenio_app_ils.records.api import IlsRecord, RecordValidator

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


class OrderValidator(RecordValidator):
    """Order record validator."""

    def validate_cancel(self, status, cancel_reason):
        """Validate decline is correct."""
        if status == "CANCELLED" and not cancel_reason:
            raise AcquisitionError(
                "You have to provide a cancel reason when cancelling the order"
            )
        if cancel_reason and not status == "CANCELLED":
            raise AcquisitionError(
                "If you select a cancel reason you need to select"
                ' "Cancelled" in the state'
            )

    def ensure_provider_exists(self, provider_pid):
        """Ensure provider exists or raise."""
        Provider = current_ils_prov.provider_record_cls
        try:
            Provider.get_record_by_pid(provider_pid)
        except PIDDoesNotExistError:
            raise ProviderNotFoundError(provider_pid)

    def ensure_document_exists(self, document_pid):
        """Ensure document exists or raise."""
        Document = current_app_ils.document_record_cls
        try:
            Document.get_record_by_pid(document_pid)
        except PIDDoesNotExistError:
            raise DocumentNotFoundError(document_pid)

    def ensure_patron_exists(self, patron_pid):
        """Ensure patron exists or raise."""
        try:
            current_app_ils.patron_cls.get_patron(patron_pid)
        except PatronNotFoundError:
            raise PatronNotFoundError(patron_pid)

    def validate_order_line(self, order_line):
        """Validate document and patron of the given order line."""
        document_pid = order_line["document_pid"]
        self.ensure_document_exists(document_pid)
        patron_pid = order_line.get("patron_pid")
        if patron_pid:
            self.ensure_patron_exists(patron_pid)

    def validate(self, record, **kwargs):
        """Validate record before create and commit."""
        super().validate(record, **kwargs)

        status = record["status"]
        cancel_reason = record.get("cancel_reason")
        provider_pid = record["provider_pid"]
        order_lines = record["order_lines"]

        self.validate_cancel(status, cancel_reason)
        self.ensure_provider_exists(provider_pid)
        for order_line in order_lines:
            self.validate_order_line(order_line)


class Order(IlsRecord):
    """Acquisition order class."""

    _pid_type = ORDER_PID_TYPE
    _schema = "acq_orders/order-v1.0.0.json"
    _provider_resolver_path = (
        "{scheme}://{host}/api/resolver/acquisition/orders/{order_pid}/provider"  # noqa
    )
    _order_lines_resolver_path = "{scheme}://{host}/api/resolver/acquisition/orders/{order_pid}/order-lines"  # noqa
    _validator = OrderValidator()

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
        data["provider"] = {
            "$ref": cls._provider_resolver_path.format(
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
