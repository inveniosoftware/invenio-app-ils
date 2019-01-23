# -*- coding: utf-8 -*-
#
# Copyright (C) 2019 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""Circulation item resolving endpoint."""

from invenio_app_ils.records.api import Item


def item_resolver_endpoint(item_pid):
    """Circulation item resolving view function."""
    item = Item.get_record_by_pid(item_pid)
    # To avoid circular dependencies, we remove loan from item.
    del item["circulation_status"]
    del item["document"]
    return item
