# -*- coding: utf-8 -*-
#
# Copyright (C) 2019 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""DocumentRequest indexer APIs."""

from datetime import datetime

from celery import shared_task
from flask import current_app
from invenio_indexer.api import RecordIndexer

from invenio_app_ils.acquisition.api import ORDER_PID_TYPE
from invenio_app_ils.acquisition.proxies import current_ils_acq
from invenio_app_ils.documents.api import DOCUMENT_PID_TYPE
from invenio_app_ils.indexer import ReferencedRecordsIndexer
from invenio_app_ils.proxies import current_app_ils

from .api import DOCUMENT_REQUEST_PID_TYPE


@shared_task(ignore_result=True)
def index_referenced_records(docreq):
    """Index referenced records."""
    indexer = ReferencedRecordsIndexer()
    indexed = dict(pid_type=DOCUMENT_REQUEST_PID_TYPE, record=docreq)

    referenced = []

    # fetch and index the document
    document_pid = docreq.get("document_pid")
    if document_pid:
        document_cls = current_app_ils.document_record_cls
        document = document_cls.get_record_by_pid(document_pid)
        referenced.append(dict(pid_type=DOCUMENT_PID_TYPE, record=document))

    # fetch and index the related order (physical_item_provider)
    physical_item_provider = docreq.get("physical_item_provider")
    if physical_item_provider:
        provider_pid = physical_item_provider.get("pid")
        provider_pid_type = physical_item_provider.get("pid_type")
        if provider_pid and provider_pid_type == ORDER_PID_TYPE:
            order_cls = current_ils_acq.order_record_cls
            order = order_cls.get_record_by_pid(provider_pid)
            referenced.append(dict(pid_type=ORDER_PID_TYPE, record=order))

    indexer.index(indexed, referenced)


class DocumentRequestIndexer(RecordIndexer):
    """Indexer class for DocumentRequest record."""

    def index(self, docreq, arguments=None, **kwargs):
        """Index a DocumentRequest."""
        super().index(docreq)
        eta = datetime.utcnow() + current_app.config["ILS_INDEXER_TASK_DELAY"]
        index_referenced_records.apply_async((docreq,), eta=eta)
