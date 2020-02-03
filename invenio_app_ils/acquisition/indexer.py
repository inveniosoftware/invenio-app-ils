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
def index_referenced_records(order):
    """Index referenced records."""
    Vendor = current_ils_acq.vendor_record_cls
    indexer = ReferencedRecordsIndexer()

    indexed = dict(pid_type=ORDER_PID_TYPE, record=order)

    vendor = Vendor.get_record_by_pid(order.get("vendor_pid"))
    referenced = [dict(pid_type=VENDOR_PID_TYPE, record=vendor)]

    indexer.index(indexed, referenced)


class OrderIndexer(RecordIndexer):
    """Indexer class for Order record."""

    def index(self, order, arguments=None, **kwargs):
        """Index an Order."""
        super().index(order)
        eta = datetime.utcnow() + current_app.config["ILS_INDEXER_TASK_DELAY"]
        index_referenced_records.apply_async((order,), eta=eta)
