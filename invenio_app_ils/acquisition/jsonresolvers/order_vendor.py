# -*- coding: utf-8 -*-
#
# Copyright (C) 2019 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""Resolve vendor for an order."""

import jsonresolver
from werkzeug.routing import Rule

from invenio_app_ils.acquisition.proxies import current_ils_acq
from invenio_app_ils.records.jsonresolvers.api import \
    get_field_value_for_record as get_field_value
from invenio_app_ils.records.jsonresolvers.api import pick

# Note: there must be only one resolver per file,
# otherwise only the last one is registered


@jsonresolver.hookimpl
def jsonresolver_loader(url_map):
    """Resolve the referred Vendor for an Order record."""
    from flask import current_app

    def vendor_resolver(order_pid):
        """Return the Vendor for the given Order."""
        Order = current_ils_acq.order_record_cls
        Vendor = current_ils_acq.vendor_record_cls
        vendor_pid = get_field_value(Order, order_pid, "vendor_pid")
        vendor = Vendor.get_record_by_pid(vendor_pid)
        return pick(
            vendor,
            "pid",
            "name",
            "address",
            "email",
            "phone",
            "notes"
        )

    url_map.add(
        Rule(
            "/api/resolver/acquisition/orders/<order_pid>/vendor",
            endpoint=vendor_resolver,
            host=current_app.config.get("JSONSCHEMAS_HOST"),
        )
    )
