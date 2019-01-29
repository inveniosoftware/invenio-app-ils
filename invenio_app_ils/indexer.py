# -*- coding: utf-8 -*-
#
# Copyright (C) 2018 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""Ils Records API."""

from __future__ import absolute_import, print_function

from datetime import datetime

from celery import shared_task
from flask import current_app
from invenio_circulation.api import Loan
from invenio_circulation.search.api import search_by_pid
from invenio_indexer.api import RecordIndexer

from invenio_app_ils.circulation.utils import circulation_document_retriever, \
    circulation_items_retriever
from invenio_app_ils.records.api import Document, Item


@shared_task(ignore_result=True)
def index_loans_after_item_indexed(item_pid):
    """Index loan to refresh item reference."""
    loan_search = search_by_pid(item_pid=item_pid)
    loan_ids = []
    for loan in loan_search.scan():
        record = Loan.get_record_by_pid(loan[Loan.pid_field])
        if record:
            loan_ids.append(record.id)

    RecordIndexer().bulk_index(loan_ids)


@shared_task(ignore_result=True)
def index_document_after_item_indexed(item_pid):
    """Index document to re-compute circulation information."""
    document_pid = circulation_document_retriever(item_pid)
    document = Document.get_record_by_pid(document_pid)
    if document:
        RecordIndexer().index(document)


class ItemIndexer(RecordIndexer):
    """Indexer class for `Item`."""

    def index(self, item):
        """Index an item."""
        super(ItemIndexer, self).index(item)
        index_loans_after_item_indexed.apply_async(
            (item[Item.pid_field],),
            eta=datetime.utcnow()
            + current_app.config["ILS_INDEXER_TASK_DELAY"],
        )
        index_document_after_item_indexed.apply_async(
            (item[Item.pid_field],),
            eta=datetime.utcnow()
            + current_app.config["ILS_INDEXER_TASK_DELAY"],
        )


@shared_task(ignore_result=True)
def index_item_after_document_indexed(document_pid):
    """Index item to refresh document reference."""
    item_pids = circulation_items_retriever(document_pid)
    item_ids = []
    for pid in item_pids:
        record = Item.get_record_by_pid(pid)
        item_ids.append(record.id)

    RecordIndexer().bulk_index(item_ids)


class DocumentIndexer(RecordIndexer):
    """Indexer class for `Document`."""

    def index(self, document):
        """Index a document."""
        super(DocumentIndexer, self).index(document)
        index_item_after_document_indexed.apply_async(
            (document[Document.pid_field],),
            eta=datetime.utcnow()
            + current_app.config["ILS_INDEXER_TASK_DELAY"],
        )


@shared_task(ignore_result=True)
def index_item_after_loan_indexed(item_pid):
    """Index item to re-compute circulation reference."""
    if item_pid:
        item = Item.get_record_by_pid(item_pid)
        RecordIndexer().index(item)


@shared_task(ignore_result=True)
def index_document_after_loan_indexed(document_pid):
    """Index documentt to re-compute circulation information."""
    if document_pid:
        document = Document.get_record_by_pid(document_pid)
        RecordIndexer().index(document)


class LoanIndexer(RecordIndexer):
    """Indexer class for `Loan`."""

    def index(self, loan):
        """Index a loan."""
        super(LoanIndexer, self).index(loan)
        index_item_after_loan_indexed.apply_async(
            (loan.get(Item.pid_field, ""),),
            eta=datetime.utcnow()
            + current_app.config["ILS_INDEXER_TASK_DELAY"],
        )
        index_document_after_loan_indexed.apply_async(
            (loan.get(Document.pid_field, ""),),
            eta=datetime.utcnow()
            + current_app.config["ILS_INDEXER_TASK_DELAY"],
        )
