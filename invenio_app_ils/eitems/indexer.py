# -*- coding: utf-8 -*-
#
# Copyright (C) 2020 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""EItem indexer APIs."""

from datetime import datetime

from celery import shared_task
from flask import current_app
from invenio_indexer.api import RecordIndexer

from invenio_app_ils.documents.api import DOCUMENT_PID_TYPE
from invenio_app_ils.indexer import ReferencedRecordsIndexer
from invenio_app_ils.proxies import current_app_ils

from .api import EITEM_PID_TYPE


@shared_task(ignore_result=True)
def index_referenced_records(eitem):
    """Index referenced records."""
    indexer = ReferencedRecordsIndexer()
    indexed = dict(pid_type=EITEM_PID_TYPE, record=eitem)

    # fetch and index the document
    document_cls = current_app_ils.document_record_cls
    document = document_cls.get_record_by_pid(eitem["document_pid"])
    referenced = [dict(pid_type=DOCUMENT_PID_TYPE, record=document)]

    indexer.index(indexed, referenced)


class EItemIndexer(RecordIndexer):
    """Indexer class for EItem record."""

    def index(self, eitem, arguments=None, **kwargs):
        """Index an EItem."""
        super().index(eitem)
        eta = datetime.utcnow() + current_app.config["ILS_INDEXER_TASK_DELAY"]
        index_referenced_records.apply_async((eitem,), eta=eta)


@shared_task(ignore_result=True)
def index_eitem_after_files_changed(bucket_id):
    """Index EItem on file changed."""
    search_cls = current_app_ils.eitem_search_cls
    results = search_cls().search_by_bucket_id(bucket_id)
    if len(results) == 1:
        hit = results[0]
        record = current_app_ils.eitem_record_cls.get_record_by_pid(hit.pid)
        current_app_ils.eitem_indexer.index(record)
