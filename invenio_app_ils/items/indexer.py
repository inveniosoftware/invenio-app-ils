# -*- coding: utf-8 -*-
#
# Copyright (C) 2019 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""Item indexer APIs."""

from datetime import datetime

from celery import shared_task
from flask import current_app
from invenio_circulation.pidstore.pids import CIRCULATION_LOAN_PID_TYPE
from invenio_circulation.proxies import current_circulation
from invenio_circulation.search.api import search_by_pid as search_loans_by_pid
from invenio_indexer.api import RecordIndexer

from invenio_app_ils.documents.api import DOCUMENT_PID_TYPE
from invenio_app_ils.indexer import ReferencedRecordsIndexer
from invenio_app_ils.items.api import ITEM_PID_TYPE
from invenio_app_ils.proxies import current_app_ils


@shared_task(ignore_result=True)
def index_referenced_records(item):
    """Index referenced records."""
    indexer = ReferencedRecordsIndexer()
    indexed = dict(pid_type=ITEM_PID_TYPE, record=item)
    referenced = []

    # fetch and index loans
    loan_record_cls = current_circulation.loan_record_cls
    item_pid = dict(type=ITEM_PID_TYPE, value=item["pid"])
    for loan in search_loans_by_pid(item_pid=item_pid).scan():
        loan = loan_record_cls.get_record_by_pid(loan["pid"])
        referenced.append(
            dict(pid_type=CIRCULATION_LOAN_PID_TYPE, record=loan)
        )

    # fetch and index the document
    document_cls = current_app_ils.document_record_cls
    document = document_cls.get_record_by_pid(item["document_pid"])
    referenced.append(dict(pid_type=DOCUMENT_PID_TYPE, record=document))

    indexer.index(indexed, referenced)


class ItemIndexer(RecordIndexer):
    """Indexer class for Item record."""

    def index(self, item, arguments=None, **kwargs):
        """Index an Item."""
        super().index(item)
        eta = datetime.utcnow() + current_app.config["ILS_INDEXER_TASK_DELAY"]
        index_referenced_records.apply_async((item,), eta=eta)
