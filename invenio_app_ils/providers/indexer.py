# -*- coding: utf-8 -*-
#
# Copyright (C) 2019-2021 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""Provider indexer APIs."""

from datetime import datetime

from celery import shared_task
from flask import current_app
from invenio_indexer.api import RecordIndexer

from invenio_app_ils.acquisition.api import ORDER_PID_TYPE
from invenio_app_ils.acquisition.proxies import current_ils_acq
from invenio_app_ils.ill.api import BORROWING_REQUEST_PID_TYPE
from invenio_app_ils.ill.proxies import current_ils_ill
from invenio_app_ils.indexer import ReferencedRecordsIndexer

from .api import PROVIDER_PID_TYPE


@shared_task(ignore_result=True)
def provider_index_referenced_records(provider):
    """Index referenced records."""
    indexer = ReferencedRecordsIndexer()
    indexed = dict(pid_type=PROVIDER_PID_TYPE, record=provider)
    referenced = []

    vendor_record_cls = current_ils_acq.order_record_cls
    vendor_search_cls = current_ils_acq.order_search_cls
    vendor_pid_type = ORDER_PID_TYPE

    brwreq_record_cls = current_ils_ill.borrowing_request_record_cls
    brwreq_search_cls = current_ils_ill.borrowing_request_search_cls
    brwreq_pid_type = BORROWING_REQUEST_PID_TYPE

    for rec in (
        vendor_search_cls()
        .search_by_provider_pid(provider_pid=provider["pid"])
        .scan()
    ):
        rec = vendor_record_cls.get_record_by_pid(rec["pid"])
        referenced.append(dict(pid_type=vendor_pid_type, record=rec))

    for rec in (
        brwreq_search_cls()
        .search_by_provider_pid(provider_pid=provider["pid"])
        .scan()
    ):
        rec = brwreq_record_cls.get_record_by_pid(rec["pid"])
        referenced.append(dict(pid_type=brwreq_pid_type, record=rec))

    indexer.index(indexed, referenced)


class ProviderIndexer(RecordIndexer):
    """Indexer class for Provider record."""

    def index(self, provider, arguments=None, **kwargs):
        """Index an Provider."""
        super().index(provider)
        eta = datetime.utcnow() + current_app.config["ILS_INDEXER_TASK_DELAY"]
        provider_index_referenced_records.apply_async((provider,), eta=eta)
