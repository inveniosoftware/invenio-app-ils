# -*- coding: utf-8 -*-
#
# Copyright (C) 2019 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""Resolve provider for an order."""

import jsonresolver
from werkzeug.routing import Rule

from invenio_app_ils.acquisition.proxies import current_ils_acq
from invenio_app_ils.providers.proxies import current_ils_prov
from invenio_app_ils.records.jsonresolvers.api import (
    get_field_value_for_record as get_field_value,
)
from invenio_app_ils.records.jsonresolvers.api import pick

# Note: there must be only one resolver per file,
# otherwise only the last one is registered


@jsonresolver.hookimpl
def jsonresolver_loader(url_map):
    """Resolve the referred Provider for an Order record."""
    from flask import current_app

    def provider_resolver(order_pid):
        """Return the Provider for the given Order."""
        Order = current_ils_acq.order_record_cls
        Provider = current_ils_prov.provider_record_cls
        provider_pid = get_field_value(Order, order_pid, "provider_pid")
        provider = Provider.get_record_by_pid(provider_pid)
        return pick(
            provider,
            "pid",
            "name",
            "address",
            "email",
            "phone",
            "notes",
            "type",
        )

    url_map.add(
        Rule(
            "/api/resolver/acquisition/orders/<order_pid>/provider",
            endpoint=provider_resolver,
            host=current_app.config.get("JSONSCHEMAS_HOST"),
        )
    )
