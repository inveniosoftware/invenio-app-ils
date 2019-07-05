# -*- coding: utf-8 -*-
#
# Copyright (C) 2018-2019 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""Ils Records API."""

from __future__ import absolute_import, print_function

from datetime import datetime
from functools import partial

from celery import shared_task
from flask import current_app
from invenio_circulation.api import Loan
from invenio_circulation.search.api import search_by_pid as search_loans_by_pid
from invenio_indexer.api import RecordIndexer

from invenio_app_ils.records.api import Document, EItem, InternalLocation, \
    Item, Keyword, Location, Series
from invenio_app_ils.search.api import DocumentSearch, EItemSearch, \
    InternalLocationSearch, ItemSearch, SeriesSearch

indexer = RecordIndexer()
MSG_ORIGIN = "ils-indexer: {origin_rec_type} #{origin_recid} indexed, trigger"\
             " indexing of referenced records"
MSG_BEFORE = "ils-indexer: indexing {dest_rec_type} #{dest_recid}" \
             " referenced from {origin_rec_type} #{origin_recid}"
MSG_AFTER = "ils-indexer: indexed {dest_rec_type} #{dest_recid} referenced" \
            " from {origin_rec_type} #{origin_recid}"


def _log(msg, origin_rec_type, origin_recid, dest_rec_type, dest_recid=None):
    """Log the indexing operation."""
    current_app.logger.info(msg.format(
        origin_rec_type=origin_rec_type,
        origin_recid=origin_recid,
        dest_rec_type=dest_rec_type,
        dest_recid=dest_recid,
    ))


def _index_record_by_pid(record_cls, recid, log_func):
    """Fetched record by recid and index while logging the operation."""
    record = record_cls.get_record_by_pid(recid)
    if record:
        log_func(msg=MSG_BEFORE, dest_recid=recid)
        indexer.index(record)
        log_func(msg=MSG_AFTER, dest_recid=recid)


@shared_task(ignore_result=True)
def index_loans_after_item_indexed(item_pid):
    """Index loan to refresh item reference."""
    log_func = partial(
        _log,
        origin_rec_type='Item',
        origin_recid=item_pid,
        dest_rec_type='Loan')

    log_func(msg=MSG_ORIGIN)
    for loan in search_loans_by_pid(item_pid=item_pid).scan():
        loan_pid = loan[Loan.pid_field]
        _index_record_by_pid(Loan, loan_pid, log_func)


@shared_task(ignore_result=True)
def index_document_after_item_indexed(item_pid):
    """Index document to re-compute circulation information."""
    log_func = partial(
        _log,
        origin_rec_type='Item',
        origin_recid=item_pid,
        dest_rec_type='Document')

    log_func(msg=MSG_ORIGIN)
    document_pid = Item.get_document_pid(item_pid)
    _index_record_by_pid(Document, document_pid, log_func)


class ItemIndexer(RecordIndexer):
    """Indexer class for Item record."""

    def index(self, item):
        """Index an Item."""
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
def index_document_after_eitem_indexed(item_pid):
    """Index document to re-compute eitem information."""
    log_func = partial(
        _log,
        origin_rec_type='EItem',
        origin_recid=item_pid,
        dest_rec_type='Document')

    log_func(msg=MSG_ORIGIN)
    document_pid = EItem.get_document_pid(item_pid)
    _index_record_by_pid(Document, document_pid, log_func)


class EItemIndexer(RecordIndexer):
    """Indexer class for EItem record."""

    def index(self, item):
        """Index an EItem."""
        super(EItemIndexer, self).index(item)
        eta = datetime.utcnow() + current_app.config["ILS_INDEXER_TASK_DELAY"]
        index_document_after_eitem_indexed.apply_async(
            (item[EItem.pid_field],),
            eta=eta,
        )


@shared_task(ignore_result=True)
def index_item_after_document_indexed(document_pid):
    """Index items to refresh document reference."""
    log_func = partial(
        _log,
        origin_rec_type='Document',
        origin_recid=document_pid,
        dest_rec_type='Item')

    log_func(msg=MSG_ORIGIN)
    for item in ItemSearch().search_by_document_pid(
            document_pid=document_pid).scan():
        item_pid = item[Item.pid_field]
        _index_record_by_pid(Item, item_pid, log_func)


@shared_task(ignore_result=True)
def index_eitem_after_document_indexed(document_pid):
    """Index eitems to refresh document reference."""
    log_func = partial(
        _log,
        origin_rec_type='Document',
        origin_recid=document_pid,
        dest_rec_type='EItem')

    log_func(msg=MSG_ORIGIN)
    for eitem in EItemSearch().search_by_document_pid(
            document_pid=document_pid).scan():
        eitem_pid = eitem[EItem.pid_field]
        _index_record_by_pid(EItem, eitem_pid, log_func)


class DocumentIndexer(RecordIndexer):
    """Indexer class for Document record."""

    def index(self, document):
        """Index a Document."""
        super(DocumentIndexer, self).index(document)
        eta = datetime.utcnow() + current_app.config["ILS_INDEXER_TASK_DELAY"]
        index_item_after_document_indexed.apply_async(
            (document[Document.pid_field],),
            eta=eta,
        )
        index_eitem_after_document_indexed.apply_async(
            (document[Document.pid_field],),
            eta=eta,
        )


@shared_task(ignore_result=True)
def index_item_after_loan_indexed(loan):
    """Index item to re-compute circulation reference."""
    if not loan.get('item_pid', None):
        msg = "ils-indexer: item_pid not found in loan " \
              "{0}".format(loan[Loan.pid_field])
        current_app.logger.warning(msg)
        return

    log_func = partial(
        _log,
        origin_rec_type='Loan',
        origin_recid=loan[Loan.pid_field],
        dest_rec_type='Item')

    log_func(msg=MSG_ORIGIN)
    item_pid = loan['item_pid']
    _index_record_by_pid(Item, item_pid, log_func)


@shared_task(ignore_result=True)
def index_document_after_loan_indexed(loan):
    """Index document to re-compute circulation information."""
    if not loan.get(Document.pid_field, None):
        msg = "ils-indexer: Document PID not found in loan " \
              "{0}".format(loan[Loan.pid_field])
        current_app.logger.warning(msg)
        return

    log_func = partial(
        _log,
        origin_rec_type='Loan',
        origin_recid=loan[Loan.pid_field],
        dest_rec_type='Document')

    log_func(msg=MSG_ORIGIN)
    item_pid = loan[Document.pid_field]
    _index_record_by_pid(Document, item_pid, log_func)


class LoanIndexer(RecordIndexer):
    """Indexer class for Loan record."""

    def index(self, loan):
        """Index a Loan."""
        super(LoanIndexer, self).index(loan)
        eta = datetime.utcnow() + current_app.config["ILS_INDEXER_TASK_DELAY"]
        index_item_after_loan_indexed.apply_async(
            (loan,),
            eta=eta,
        )
        index_document_after_loan_indexed.apply_async(
            (loan,),
            eta=eta,
        )


@shared_task(ignore_result=True)
def index_internal_location_after_location_indexed(loc_pid):
    """Index internal locations pointing to location."""
    log_func = partial(
        _log,
        origin_rec_type='Location',
        origin_recid=loc_pid,
        dest_rec_type='InternalLocation')

    log_func(msg=MSG_ORIGIN)
    for iloc in InternalLocationSearch().search_by_location_pid(
            location_pid=loc_pid).scan():
        iloc_pid = iloc[InternalLocation.pid_field]
        _index_record_by_pid(InternalLocation, iloc_pid, log_func)


class LocationIndexer(RecordIndexer):
    """Indexer class for Location record."""

    def index(self, location):
        """Index a Location."""
        super(LocationIndexer, self).index(location)
        eta = datetime.utcnow() + current_app.config["ILS_INDEXER_TASK_DELAY"]
        index_internal_location_after_location_indexed.apply_async(
            (location[Location.pid_field],),
            eta=eta
        )


class PatronsIndexer(RecordIndexer):
    """Indexer class for `Patron`."""

    @staticmethod
    def _prepare_record(record, index, doc_type, arguments=None, **kwargs):
        """Prepare record data for indexing.

        :param record: The record to prepare.
        :param index: The Elasticsearch index.
        :param doc_type: The Elasticsearch document type.
        :returns: The record metadata.
        """
        data = record.dumps()
        return data

    def _prefix_index(self, app, index):
        """Prefixes the given index if needed.

        :param app: Flask app to get the config from.
        :param index: Name of the index to prefix.
        :returns: A string with the new index name prefixed if needed.
        """
        # See https://github.com/inveniosoftware/invenio-search/blob/master/invenio_search/config.py#L105
        index_prefix = app.config['SEARCH_INDEX_PREFIX'] or ''
        return index_prefix + index

    def record_to_index(self, record):
        """Get index/doc_type given a record.

        :param record: The record where to look for the information.
        :returns: A tuple (index, doc_type).
        """
        index = self._prefix_index(current_app, record._index)
        return (index, record._doc_type)


@shared_task(ignore_result=True)
def index_documents_after_series_indexed(series_pid):
    """Index document to re-compute series information."""
    log_func = partial(
        _log,
        origin_rec_type='Series',
        origin_recid=series_pid,
        dest_rec_type='Document')

    log_func(msg=MSG_ORIGIN)
    search = DocumentSearch()
    for document in search.search_by_series_pid(series_pid).scan():
        document_pid = document[Document.pid_field]
        _index_record_by_pid(Document, document_pid, log_func)


class SeriesIndexer(RecordIndexer):
    """Indexer class for Series record."""

    def index(self, series):
        """Index a Series."""
        super(SeriesIndexer, self).index(series)
        eta = datetime.utcnow() + current_app.config["ILS_INDEXER_TASK_DELAY"]
        index_documents_after_series_indexed.apply_async(
            (series[Series.pid_field],),
            eta=eta,
        )


@shared_task(ignore_result=True)
def index_documents_and_series_after_keyword_indexed(keyword_pid):
    """Index documents and series to re-compute keyword information."""
    def index_record(cls, search):
        log_func = partial(
            _log,
            origin_rec_type='Keyword',
            origin_recid=keyword_pid,
            dest_rec_type=cls.__name__)

        log_func(msg=MSG_ORIGIN)
        for record in search.search_by_keyword_pid(keyword_pid).scan():
            pid = record[cls.pid_field]
            _index_record_by_pid(cls, pid, log_func)

    index_record(Document, DocumentSearch())
    index_record(Series, SeriesSearch())


class KeywordIndexer(RecordIndexer):
    """Indexer class for Keyword record."""

    def index(self, keyword):
        """Index a keyword."""
        super(KeywordIndexer, self).index(keyword)
        eta = datetime.utcnow() + current_app.config["ILS_INDEXER_TASK_DELAY"]
        index_documents_and_series_after_keyword_indexed.apply_async(
            (keyword[Keyword.pid_field],),
            eta=eta,
        )
