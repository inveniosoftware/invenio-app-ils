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

from invenio_app_ils.documents.api import DOCUMENT_PID_TYPE
from invenio_app_ils.indexer import ReferencedRecordsIndexer
from invenio_app_ils.proxies import current_app_ils

from .api import DOCUMENT_REQUEST_PID_TYPE


@shared_task(ignore_result=True)
def index_referenced_records(docreq):
    """Index referenced records."""
    indexer = ReferencedRecordsIndexer()
    indexed = dict(pid_type=DOCUMENT_REQUEST_PID_TYPE, record=docreq)

    # fetch and index the document
    document_pid = docreq.get("document_pid")
    referenced = []
    if document_pid:
        document_cls = current_app_ils.document_record_cls
        document = document_cls.get_record_by_pid(document_pid)
        referenced.append(dict(pid_type=DOCUMENT_PID_TYPE, record=document))

    indexer.index(indexed, referenced)


class DocumentRequestIndexer(RecordIndexer):
    """Indexer class for DocumentRequest record."""

    def index(self, docreq, arguments=None, **kwargs):
        """Index a DocumentRequest."""
        super().index(docreq)
        eta = datetime.utcnow() + current_app.config["ILS_INDEXER_TASK_DELAY"]
        index_referenced_records.apply_async((docreq,), eta=eta)
