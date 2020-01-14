# -*- coding: utf-8 -*-
#
# Copyright (C) 2019 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""Loan indexer APIs."""

from datetime import datetime

from celery import shared_task
from flask import current_app
from invenio_circulation.pidstore.pids import CIRCULATION_LOAN_PID_TYPE
from invenio_indexer.api import RecordIndexer

from invenio_app_ils.circulation.utils import resolve_item_from_loan
from invenio_app_ils.documents.api import DOCUMENT_PID_TYPE
from invenio_app_ils.indexer import ReferencedRecordsIndexer
from invenio_app_ils.proxies import current_app_ils


@shared_task(ignore_result=True)
def index_referenced_records(loan):
    """Index referenced records."""
    indexer = ReferencedRecordsIndexer()
    indexed = dict(pid_type=CIRCULATION_LOAN_PID_TYPE, record=loan)
    referenced = []

    # fetch and index the document
    document_cls = current_app_ils.document_record_cls
    document = document_cls.get_record_by_pid(loan["document_pid"])
    referenced.append(dict(pid_type=DOCUMENT_PID_TYPE, record=document))

    # fetch and index the item
    if loan.get("item_pid"):
        item = resolve_item_from_loan(loan["item_pid"])
        referenced.append(dict(pid_type=loan["item_pid"]["type"], record=item))

    # index the document
    indexer.index(indexed, referenced)


class LoanIndexer(RecordIndexer):
    """Indexer class for Loan record."""

    def index(self, loan, arguments=None, **kwargs):
        """Index an Loan."""
        super().index(loan)
        eta = datetime.utcnow() + current_app.config["ILS_INDEXER_TASK_DELAY"]
        index_referenced_records.apply_async((loan,), eta=eta)
