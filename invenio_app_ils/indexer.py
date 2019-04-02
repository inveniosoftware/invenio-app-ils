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
from invenio_app_ils.records.api import Document, InternalLocation, Item, \
    Location
from invenio_app_ils.search.api import InternalLocationSearch

indexer = RecordIndexer()
MESSAGE = "{}: started indexing {} record with id: {}"


@shared_task(ignore_result=True)
def index_loans_after_item_indexed(item_pid):
    """Index loan to refresh item reference."""
    loan_search = search_by_pid(item_pid=item_pid)
    for loan in loan_search.scan():
        loan = Loan.get_record_by_pid(loan[Loan.pid_field])
        if loan:
            current_app.logger.info(MESSAGE.format(
                'index_loans_after_item_indexed',
                'loan',
                loan[Loan.pid_field]
            ))
            indexer.index(loan)


@shared_task(ignore_result=True)
def index_document_after_item_indexed(item_pid):
    """Index document to re-compute circulation information."""
    document_pid = circulation_document_retriever(item_pid)
    document = Document.get_record_by_pid(document_pid)
    if document:
        current_app.logger.info(MESSAGE.format(
            'index_document_after_item_indexed',
            'document',
            document[Document.pid_field]
        ))
        indexer.index(document)


class ItemIndexer(RecordIndexer):
    """Indexer class for `Item`."""

    def index(self, item):
        """Index an item."""
        super(ItemIndexer, self).index(item)
        eta = datetime.utcnow() + current_app.config["ILS_INDEXER_TASK_DELAY"]
        index_loans_after_item_indexed.apply_async(
            (item[Item.pid_field],),
            eta=eta,
        )
        index_document_after_item_indexed.apply_async(
            (item[Item.pid_field],),
            eta=eta,
        )


@shared_task(ignore_result=True)
def index_item_after_document_indexed(document_pid):
    """Index item to refresh document reference."""
    item_pids = circulation_items_retriever(document_pid)
    for pid in item_pids:
        item = Item.get_record_by_pid(pid)
        if item:
            current_app.logger.info(MESSAGE.format(
                'index_item_after_document_indexed',
                'item',
                item[Item.pid_field]
            ))
            indexer.index(item)


class DocumentIndexer(RecordIndexer):
    """Indexer class for `Document`."""

    def index(self, document):
        """Index a document."""
        super(DocumentIndexer, self).index(document)
        eta = datetime.utcnow() + current_app.config["ILS_INDEXER_TASK_DELAY"]
        index_item_after_document_indexed.apply_async(
            (document[Document.pid_field],),
            eta=eta,
        )


@shared_task(ignore_result=True)
def index_item_after_loan_indexed(item_pid):
    """Index item to re-compute circulation reference."""
    if item_pid:
        item = Item.get_record_by_pid(item_pid)
        if item:
            current_app.logger.info(MESSAGE.format(
                'index_item_after_loan_indexed', 'item', item[Item.pid_field]))
            indexer.index(item)


@shared_task(ignore_result=True)
def index_document_after_loan_indexed(document_pid):
    """Index documentt to re-compute circulation information."""
    if document_pid:
        document = Document.get_record_by_pid(document_pid)
        if document:
            current_app.logger.info(MESSAGE.format(
                'index_document_after_loan_indexed',
                'document',
                document[Document.pid_field],
            ))
            indexer.index(document)


class LoanIndexer(RecordIndexer):
    """Indexer class for `Loan`."""

    def index(self, loan):
        """Index a loan."""
        super(LoanIndexer, self).index(loan)
        eta = datetime.utcnow() + current_app.config["ILS_INDEXER_TASK_DELAY"]
        index_item_after_loan_indexed.apply_async(
            (loan.get(Item.pid_field, ""),),
            eta=eta,
        )
        index_document_after_loan_indexed.apply_async(
            (loan.get(Document.pid_field, ""),),
            eta=eta,
        )


@shared_task(ignore_result=True)
def index_internal_location_after_location_indexed(loc_pid):
    """Index internal locations pointing to location."""
    iloc_search = InternalLocationSearch()
    iloc_records = iloc_search.search_by_location_pid(location_pid=loc_pid)
    for iloc in iloc_records.scan():
        iloc_rec = InternalLocation.get_record_by_pid(
            iloc[InternalLocation.pid_field]
        )
        if iloc_rec:
            current_app.logger.info(MESSAGE.format(
                'index_internal_location_after_location_indexed',
                'internal-location',
                iloc_rec[InternalLocation.pid_field],
            ))
            indexer.index(iloc_rec)


class LocationIndexer(RecordIndexer):
    """Indexer class for `Location`."""

    def index(self, location):
        """Index location."""
        super(LocationIndexer, self).index(location)
        eta = datetime.utcnow() + current_app.config["ILS_INDEXER_TASK_DELAY"]
        index_internal_location_after_location_indexed.apply_async(
            (location[Location.pid_field],),
            eta=eta
        )
