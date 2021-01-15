# -*- coding: utf-8 -*-
#
# Copyright (C) 2019-2020 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""Patron indexer APIs."""

from datetime import datetime

from celery import shared_task
from elasticsearch import VERSION as ES_VERSION
from flask import current_app
from invenio_accounts.models import User
from invenio_circulation.pidstore.pids import CIRCULATION_LOAN_PID_TYPE
from invenio_circulation.proxies import current_circulation
from invenio_circulation.search.api import search_by_patron_pid
from invenio_db import db
from invenio_indexer.api import RecordIndexer

from invenio_app_ils.acquisition.api import ORDER_PID_TYPE
from invenio_app_ils.acquisition.proxies import current_ils_acq
from invenio_app_ils.document_requests.api import DOCUMENT_REQUEST_PID_TYPE
from invenio_app_ils.ill.api import BORROWING_REQUEST_PID_TYPE
from invenio_app_ils.ill.proxies import current_ils_ill
from invenio_app_ils.indexer import ReferencedRecordsIndexer
from invenio_app_ils.patrons.api import PATRON_PID_TYPE
from invenio_app_ils.proxies import current_app_ils

lt_es7 = ES_VERSION[0] < 7


def get_loans(patron_pid):
    """Get referenced loans."""
    referenced = []
    loan_record_cls = current_circulation.loan_record_cls
    for hit in search_by_patron_pid(patron_pid=patron_pid).scan():
        loan = loan_record_cls.get_record_by_pid(hit["pid"])
        referenced.append(
            dict(pid_type=CIRCULATION_LOAN_PID_TYPE, record=loan)
        )
    return referenced


def get_document_requests(patron_pid):
    """Get referenced documents requests."""
    referenced = []
    docreq_search_cls = current_app_ils.document_request_search_cls
    docreq_record_cls = current_app_ils.document_request_record_cls
    for request in (
        docreq_search_cls().search_by_patron_pid(patron_pid=patron_pid).scan()
    ):
        docreq = docreq_record_cls.get_record_by_pid(request["pid"])
        referenced.append(
            dict(pid_type=DOCUMENT_REQUEST_PID_TYPE, record=docreq)
        )
    return referenced


def get_acquisition_orders(patron_pid):
    """Get referenced acquisition orders."""
    referenced = []
    order_record_cls = current_ils_acq.order_record_cls
    order_search_cls = current_ils_acq.order_search_cls
    search = order_search_cls().search_by_patron_pid(patron_pid)
    for hit in search.scan():
        order = order_record_cls.get_record_by_pid(hit["pid"])
        referenced.append(dict(pid_type=ORDER_PID_TYPE, record=order))
    return referenced


def get_ill_borrowing_requests(patron_pid):
    """Get referenced ILL borrowing requests."""
    referenced = []
    brw_req_record_cls = current_ils_ill.borrowing_request_record_cls
    brw_req_search_cls = current_ils_ill.borrowing_request_search_cls
    search = brw_req_search_cls().search_by_patron_pid(patron_pid)
    for hit in search.scan():
        brw_req = brw_req_record_cls.get_record_by_pid(hit["pid"])
        referenced.append(
            dict(pid_type=BORROWING_REQUEST_PID_TYPE, record=brw_req)
        )
    return referenced


@shared_task(ignore_result=True)
def index_referenced_records(patron):
    """Index referenced records."""
    indexer = ReferencedRecordsIndexer()

    patron_pid = patron["pid"]
    indexed = dict(pid_type=PATRON_PID_TYPE, record=patron)

    indexer.index(indexed, get_loans(patron_pid))
    indexer.index(indexed, get_document_requests(patron_pid))
    indexer.index(indexed, get_acquisition_orders(patron_pid))
    indexer.index(indexed, get_ill_borrowing_requests(patron_pid))


class PatronBaseIndexer(RecordIndexer):
    """Base indexer class for `Patron` to treat it as a record."""

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
        return record._index, doc_type

    def index_by_id(self, record_uuid, **kwargs):
        """Not implemented."""
        raise NotImplementedError("Cannot use this operation for Patron")

    def delete_by_id(self, record_uuid, **kwargs):
        """Not implemented."""
        raise NotImplementedError("Cannot use this operation for Patron")

    def bulk_index(self, record_id_iterator):
        """Not implemented."""
        raise NotImplementedError("Cannot use this operation for Patron")

    def bulk_delete(self, record_id_iterator):
        """Not implemented."""
        raise NotImplementedError("Cannot use this operation for Patron")

    def process_bulk_queue(self, es_bulk_kwargs=None):
        """Not implemented."""
        raise NotImplementedError("Cannot use this operation for Patron")


class PatronIndexer(PatronBaseIndexer):
    """Indexer class for `Patron`."""

    def index(self, patron, arguments=None, **kwargs):
        """Index a Patron."""
        super().index(patron)
        eta = datetime.utcnow() + current_app.config["ILS_INDEXER_TASK_DELAY"]
        index_referenced_records.apply_async((patron,), eta=eta)

    def reindex_patrons(self):
        """Re-index all patrons."""
        # do not use PatronIndexer class otherwise it will trigger potentially
        # thousands of tasks to index referenced records
        indexer = PatronBaseIndexer()
        Patron = current_app_ils.patron_cls
        # cannot use bulk operation because Patron is not a real record
        all_user_ids = db.session.query(User.id).all()
        for (user_id,) in all_user_ids:
            patron = Patron(user_id)
            indexer.index(patron)
        return len(all_user_ids)
