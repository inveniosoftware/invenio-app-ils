# -*- coding: utf-8 -*-
#
# Copyright (C) 2019-2020 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""Acquisition indexer APIs."""

from datetime import datetime

from celery import shared_task
from flask import current_app
from invenio_indexer.api import RecordIndexer

from invenio_app_ils.indexer import ReferencedRecordsIndexer

from .api import ORDER_PID_TYPE, VENDOR_PID_TYPE
from .proxies import current_ils_acq


@shared_task(ignore_result=True)
def vendor_index_referenced_records(vendor):
    """Index referenced records."""
    indexer = ReferencedRecordsIndexer()
    indexed = dict(pid_type=VENDOR_PID_TYPE, record=vendor)
    referenced = []

    # fetch and index orders
    Order = current_ils_acq.order_record_cls
    OrderSearch = current_ils_acq.order_search_cls
    for order in (
        OrderSearch().search_by_vendor_pid(vendor_pid=vendor["pid"]).scan()
    ):
        order = Order.get_record_by_pid(order["pid"])
        referenced.append(dict(pid_type=ORDER_PID_TYPE, record=order))

    indexer.index(indexed, referenced)


class VendorIndexer(RecordIndexer):
    """Indexer class for Vendor record."""

    def index(self, vendor, arguments=None, **kwargs):
        """Index an Vendor."""
        super().index(vendor)
        eta = datetime.utcnow() + current_app.config["ILS_INDEXER_TASK_DELAY"]
        vendor_index_referenced_records.apply_async((vendor,), eta=eta)
