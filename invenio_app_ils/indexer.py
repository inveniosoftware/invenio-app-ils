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
from elasticsearch import VERSION as ES_VERSION
from flask import current_app
from invenio_circulation.api import Loan
from invenio_circulation.search.api import search_by_pid as search_loans_by_pid
from invenio_indexer.api import RecordIndexer

from invenio_app_ils.proxies import current_app_ils
from invenio_app_ils.records.api import Document, DocumentRequest, EItem, \
    IlsRecord, InternalLocation, Item, Series
from invenio_app_ils.search.api import DocumentRequestSearch, DocumentSearch, \
    EItemSearch, InternalLocationSearch, ItemSearch, SeriesSearch

lt_es7 = ES_VERSION[0] < 7

indexer = RecordIndexer()
MSG_ORIGIN = "ils-indexer: {origin_rec_type} #{origin_recid} indexed, trigger" \
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
        loan_pid = loan["pid"]
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

    def index(self, item, arguments=None, **kwargs):
        """Index an Item."""
        super(ItemIndexer, self).index(item)
        eta = datetime.utcnow() + current_app.config["ILS_INDEXER_TASK_DELAY"]
        index_loans_after_item_indexed.apply_async(
            (item["pid"],),
            eta=eta,
        )
        index_document_after_item_indexed.apply_async(
            (item["pid"],),
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


@shared_task(ignore_result=True)
def index_eitem_after_files_changed(bucket_id):
    """Index EItem on file changes."""
    search = current_app_ils.eitem_search
    for hit in search.search_by_bucket_id(bucket_id).scan():
        record = current_app_ils.eitem_cls.get_record_by_pid(hit.pid)
        current_app_ils.eitem_indexer.index(record)


class EItemIndexer(RecordIndexer):
    """Indexer class for EItem record."""

    def index(self, item, arguments=None, **kwargs):
        """Index an EItem."""
        super(EItemIndexer, self).index(item)
        eta = datetime.utcnow() + current_app.config["ILS_INDEXER_TASK_DELAY"]
        index_document_after_eitem_indexed.apply_async(
            (item["pid"],),
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
        item_pid = item["pid"]
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
        eitem_pid = eitem["pid"]
        _index_record_by_pid(EItem, eitem_pid, log_func)


@shared_task(ignore_result=True)
def index_related_records_after_record_changed(pid, pid_type, rec_type):
    """Index related records after a document/series has been indexed."""
    record = IlsRecord.get_record_by_pid(pid, pid_type=pid_type)
    relations = record.relations.get()
    eta = datetime.utcnow() + current_app.config["ILS_INDEXER_TASK_DELAY"]
    for relation_type, related_records in relations.items():
        for obj in related_records:
            index_related_record.apply_async(
                (
                    pid,
                    rec_type,
                    obj["pid"],
                    obj["pid_type"]
                ),
                eta=eta,
            )


@shared_task(ignore_result=True)
def index_request_after_document_indexed(document_pid):
    """Index request to refresh document reference."""
    log_func = partial(
        _log,
        origin_rec_type='Document',
        origin_recid=document_pid,
        dest_rec_type='DocumentRequest')

    log_func(msg=MSG_ORIGIN)
    for request in DocumentRequestSearch().search_by_document_pid(
        document_pid=document_pid).scan():
        request_pid = request["pid"]
        _index_record_by_pid(DocumentRequest, request_pid, log_func)


@shared_task(ignore_result=True)
def index_loans_after_document_indexed(document_pid):
    """Index loan to refresh item reference."""
    log_func = partial(
        _log,
        origin_rec_type='Document',
        origin_recid=document_pid,
        dest_rec_type='Loan')

    log_func(msg=MSG_ORIGIN)
    for loan in search_loans_by_pid(document_pid=document_pid).scan():
        loan_pid = loan["pid"]
        _index_record_by_pid(Loan, loan_pid, log_func)


class DocumentIndexer(RecordIndexer):
    """Indexer class for Document record."""

    def index(self, document, arguments=None, **kwargs):
        """Index a Document."""
        super(DocumentIndexer, self).index(document)
        eta = datetime.utcnow() + current_app.config["ILS_INDEXER_TASK_DELAY"]
        index_item_after_document_indexed.apply_async(
            (document["pid"],),
            eta=eta,
        )
        index_eitem_after_document_indexed.apply_async(
            (document["pid"],),
            eta=eta,
        )
        index_related_records_after_record_changed.apply_async(
            (document["pid"], document._pid_type, document.__class__.__name__),
            eta=eta
        )
        index_request_after_document_indexed.apply_async(
            (document["pid"],),
            eta=eta,
        )
        index_loans_after_document_indexed.apply_async(
            (document["pid"],),
            eta=eta,
        )


@shared_task(ignore_result=True)
def index_item_after_loan_indexed(loan):
    """Index item to re-compute circulation reference."""
    if not loan.get('item_pid', None):
        msg = "ils-indexer: item_pid not found in loan " \
              "{0}".format(loan["pid"])
        current_app.logger.warning(msg)
        return

    log_func = partial(
        _log,
        origin_rec_type='Loan',
        origin_recid=loan["pid"],
        dest_rec_type='Item')

    log_func(msg=MSG_ORIGIN)
    item_pid = loan['item_pid']
    _index_record_by_pid(Item, item_pid, log_func)


@shared_task(ignore_result=True)
def index_document_after_loan_indexed(loan):
    """Index document to re-compute circulation information."""
    if not loan.get("document_pid", None):
        msg = "ils-indexer: Document PID not found in loan " \
              "{0}".format(loan["pid"])
        current_app.logger.warning(msg)
        return

    log_func = partial(
        _log,
        origin_rec_type='Loan',
        origin_recid=loan["pid"],
        dest_rec_type='Document')

    log_func(msg=MSG_ORIGIN)
    item_pid = loan["document_pid"]
    _index_record_by_pid(Document, item_pid, log_func)


class LoanIndexer(RecordIndexer):
    """Indexer class for Loan record."""

    def index(self, loan, arguments=None, **kwargs):
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
        iloc_pid = iloc["pid"]
        _index_record_by_pid(InternalLocation, iloc_pid, log_func)


@shared_task(ignore_result=True)
def index_items_after_location_indexed(loc_pid):
    """Index items referencing location."""
    log_func = partial(
        _log,
        origin_rec_type='Location',
        origin_recid=loc_pid,
        dest_rec_type='Item')

    log_func(msg=MSG_ORIGIN)
    for item in ItemSearch().search_by_location_pid(
        location_pid=loc_pid).scan():
        _index_record_by_pid(Item, item["pid"], log_func)


class LocationIndexer(RecordIndexer):
    """Indexer class for Location record."""

    def index(self, location, arguments=None, **kwargs):
        """Index a Location."""
        super(LocationIndexer, self).index(location)
        eta = datetime.utcnow() + current_app.config["ILS_INDEXER_TASK_DELAY"]
        index_internal_location_after_location_indexed.apply_async(
            (location["pid"],),
            eta=eta
        )
        index_items_after_location_indexed.apply_async(
            (location["pid"],),
            eta=eta
        )


@shared_task(ignore_result=True)
def index_items_after_internal_location_indexed(iloc_pid):
    """Index items referencing internal location."""
    log_func = partial(
        _log,
        origin_rec_type='InternalLocation',
        origin_recid=iloc_pid,
        dest_rec_type='Item')

    log_func(msg=MSG_ORIGIN)
    for item in ItemSearch().search_by_internal_location_pid(
        internal_location_pid=iloc_pid).scan():
        _index_record_by_pid(Item, item["pid"], log_func)


class InternalLocationIndexer(RecordIndexer):
    """Indexer class for InternalLocation record."""

    def index(self, location, arguments=None, **kwargs):
        """Index an InternalLocation."""
        super(InternalLocationIndexer, self).index(location)
        eta = datetime.utcnow() + current_app.config["ILS_INDEXER_TASK_DELAY"]
        index_items_after_internal_location_indexed.apply_async(
            (location["pid"],),
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

    def record_to_index(self, record):
        """Get index/doc_type given a record.

        :param record: The record where to look for the information.
        :returns: A tuple (index, doc_type).
        """
        doc_type = record._doc_type if lt_es7 else "_doc"
        return (record._index, doc_type)


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
        document_pid = document["pid"]
        _index_record_by_pid(Document, document_pid, log_func)


class SeriesIndexer(RecordIndexer):
    """Indexer class for Series record."""

    def index(self, series, arguments=None, **kwargs):
        """Index a Series."""
        super(SeriesIndexer, self).index(series)
        eta = datetime.utcnow() + current_app.config["ILS_INDEXER_TASK_DELAY"]
        index_documents_after_series_indexed.apply_async(
            (series["pid"],),
            eta=eta,
        )
        index_related_records_after_record_changed.apply_async(
            (series["pid"], series._pid_type, series.__class__.__name__),
            eta=eta
        )


@shared_task(ignore_result=True)
def index_documents_and_series_after_tag_indexed(tag_pid):
    """Index documents and series to re-compute tag information."""
    def index_record(cls, search):
        log_func = partial(
            _log,
            origin_rec_type='Tag',
            origin_recid=tag_pid,
            dest_rec_type=cls.__name__)

        log_func(msg=MSG_ORIGIN)
        for record in search.search_by_tag_pid(tag_pid).scan():
            pid = record["pid"]
            _index_record_by_pid(cls, pid, log_func)

    index_record(Document, DocumentSearch())
    index_record(Series, SeriesSearch())


class TagIndexer(RecordIndexer):
    """Indexer class for Tag record."""

    def index(self, tag, arguments=None, **kwargs):
        """Index a tag."""
        super(TagIndexer, self).index(tag)
        eta = datetime.utcnow() + current_app.config["ILS_INDEXER_TASK_DELAY"]
        index_documents_and_series_after_tag_indexed.apply_async(
            (tag["pid"],),
            eta=eta,
        )


@shared_task(ignore_result=True)
def index_related_record(pid, rec_type, related_pid, related_pid_type):
    """Index document to re-compute circulation information."""
    related = IlsRecord.get_record_by_pid(
        related_pid,
        pid_type=related_pid_type
    )
    log_func = partial(
        _log,
        origin_rec_type=rec_type,
        origin_recid=pid,
        dest_rec_type=related.__class__.__name__)
    log_func(msg=MSG_ORIGIN)
    _index_record_by_pid(related.__class__, related["pid"], log_func)


class RelationIndexer(RecordIndexer):
    """Indexer class for record relations.

    If you pass multiple records the relation indexer will keep track of which
    related records have already been indexed to prevent duplicate indexing.
    """

    def index(self, *records):
        """Index an Item."""
        def _index(record, related_pid, related_pid_type):
            if (related_pid, related_pid_type) in indexed_records:
                return None

            indexed_records.add((related_pid, related_pid_type))
            index_related_record.apply_async(
                (
                    record["pid"],
                    record.__class__.__name__,
                    related_pid,
                    related_pid_type
                ),
                eta=eta,
            )

        eta = datetime.utcnow() + current_app.config["ILS_INDEXER_TASK_DELAY"]
        indexed_records = set()

        for record in records:
            relations = record.relations.get()
            _index(record, record["pid"], record._pid_type)
            for relation_type, related_records in relations.items():
                for obj in related_records:
                    _index(record, obj["pid"], obj["pid_type"])


@shared_task(ignore_result=True)
def index_document_after_request_indexed(document_request_pid, document_pid):
    """Index document to refresh document request reference."""
    log_func = partial(
        _log,
        origin_rec_type='DocumentRequest',
        origin_recid=document_request_pid,
        dest_rec_type='Document')
    log_func(msg=MSG_ORIGIN)
    _index_record_by_pid(Document, document_pid, log_func)


class DocumentRequestIndexer(RecordIndexer):
    """Indexer class for Request record."""

    def index(self, request, arguments=None, **kwargs):
        """Index a document request."""
        super(DocumentRequestIndexer, self).index(request)
        eta = datetime.utcnow() + current_app.config["ILS_INDEXER_TASK_DELAY"]
        if "document_pid" in request:
            index_document_after_request_indexed.apply_async(
                (request["pid"], request["document_pid"]),
                eta=eta,
            )


class VocabularyIndexer(RecordIndexer):
    """Indexer class for `Vocabulary`."""

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

    def record_to_index(self, record):
        """Get index/doc_type given a record.

        :param record: The record where to look for the information.
        :returns: A tuple (index, doc_type).
        """
        doc_type = record._doc_type if lt_es7 else "_doc"
        return (record._index, doc_type)
