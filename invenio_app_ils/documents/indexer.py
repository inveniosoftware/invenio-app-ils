# -*- coding: utf-8 -*-
#
# Copyright (C) 2019-2020 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""ILS Document indexer APIs."""

from datetime import datetime

from celery import shared_task
from flask import current_app
from invenio_circulation.pidstore.pids import CIRCULATION_LOAN_PID_TYPE
from invenio_circulation.proxies import current_circulation
from invenio_circulation.search.api import search_by_pid as search_loans_by_pid
from invenio_indexer.api import RecordIndexer

from invenio_app_ils.acquisition.api import ORDER_PID_TYPE
from invenio_app_ils.acquisition.proxies import current_ils_acq
from invenio_app_ils.document_requests.api import DOCUMENT_REQUEST_PID_TYPE
from invenio_app_ils.documents.api import DOCUMENT_PID_TYPE
from invenio_app_ils.eitems.api import EITEM_PID_TYPE
from invenio_app_ils.ill.api import BORROWING_REQUEST_PID_TYPE
from invenio_app_ils.ill.proxies import current_ils_ill
from invenio_app_ils.indexer import ReferencedRecordsIndexer
from invenio_app_ils.items.api import ITEM_PID_TYPE
from invenio_app_ils.proxies import current_app_ils
from invenio_app_ils.records.api import IlsRecord


def get_items(document_pid):
    """Get referenced items."""
    referenced = []
    item_search_cls = current_app_ils.item_search_cls
    item_record_cls = current_app_ils.item_record_cls
    for item in (
        item_search_cls()
        .search_by_document_pid(document_pid=document_pid)
        .scan()
    ):
        item = item_record_cls.get_record_by_pid(item["pid"])
        referenced.append(dict(pid_type=ITEM_PID_TYPE, record=item))
    return referenced


def get_eitems(document_pid):
    """Get referenced items."""
    referenced = []
    eitem_search_cls = current_app_ils.eitem_search_cls
    eitem_record_cls = current_app_ils.eitem_record_cls
    for eitem in (
        eitem_search_cls()
        .search_by_document_pid(document_pid=document_pid)
        .scan()
    ):
        eitem = eitem_record_cls.get_record_by_pid(eitem["pid"])
        referenced.append(dict(pid_type=EITEM_PID_TYPE, record=eitem))
    return referenced


def get_related_records(document_pid):
    """Get referenced records via relations."""
    referenced = []
    doc_record_cls = current_app_ils.document_record_cls
    record = doc_record_cls.get_record_by_pid(document_pid)
    relations = record.relations
    for relation_type, related_records in relations.items():
        for obj in related_records:
            rec = IlsRecord.get_record_by_pid(
                obj["pid_value"], pid_type=obj["pid_type"]
            )
            referenced.append(dict(pid_type=obj["pid_type"], record=rec))
    return referenced


def get_document_requests(document_pid):
    """Get referenced documents requests."""
    referenced = []
    docreq_search_cls = current_app_ils.document_request_search_cls
    docreq_record_cls = current_app_ils.document_request_record_cls
    for request in (
        docreq_search_cls()
        .search_by_document_pid(document_pid=document_pid)
        .scan()
    ):
        docreq = docreq_record_cls.get_record_by_pid(request["pid"])
        referenced.append(
            dict(pid_type=DOCUMENT_REQUEST_PID_TYPE, record=docreq)
        )
    return referenced


def get_loans(document_pid):
    """Get referenced loans."""
    referenced = []
    loan_record_cls = current_circulation.loan_record_cls
    for loan in search_loans_by_pid(document_pid=document_pid).scan():
        loan = loan_record_cls.get_record_by_pid(loan["pid"])
        referenced.append(
            dict(pid_type=CIRCULATION_LOAN_PID_TYPE, record=loan)
        )
    return referenced


def get_acquisition_orders(document_pid):
    """Get referenced acquisition orders."""
    referenced = []
    order_record_cls = current_ils_acq.order_record_cls
    order_search_cls = current_ils_acq.order_search_cls
    search = order_search_cls().search_by_document_pid(document_pid)
    for hit in search.scan():
        order = order_record_cls.get_record_by_pid(hit["pid"])
        referenced.append(
            dict(pid_type=ORDER_PID_TYPE, record=order)
        )
    return referenced


def get_ill_borrowing_requests(document_pid):
    """Get referenced ILL borrowing requests."""
    referenced = []
    brw_req_record_cls = current_ils_ill.borrowing_request_record_cls
    brw_req_search_cls = current_ils_ill.borrowing_request_search_cls
    search = brw_req_search_cls().search_by_document_pid(document_pid)
    for hit in search.scan():
        brw_req = brw_req_record_cls.get_record_by_pid(hit["pid"])
        referenced.append(
            dict(pid_type=BORROWING_REQUEST_PID_TYPE, record=brw_req)
        )
    return referenced


@shared_task(ignore_result=True)
def index_referenced_records(document):
    """Index referenced records."""
    indexer = ReferencedRecordsIndexer()

    document_pid = document["pid"]
    indexed = dict(pid_type=DOCUMENT_PID_TYPE, record=document)

    # keep loans and items as first
    # Note: this can be quite inefficient because it potentially retrieves
    # a lot of records. Might be a place where performance can be improved
    # (bulk indexing, less DB queries, etc...)
    indexer.index(indexed, get_loans(document_pid))
    indexer.index(indexed, get_items(document_pid))
    indexer.index(indexed, get_document_requests(document_pid))
    indexer.index(indexed, get_eitems(document_pid))
    indexer.index(indexed, get_related_records(document_pid))
    indexer.index(indexed, get_acquisition_orders(document_pid))
    indexer.index(indexed, get_ill_borrowing_requests(document_pid))


class DocumentIndexer(RecordIndexer):
    """Indexer class for Document record."""

    def index(self, document, arguments=None, **kwargs):
        """Index a Document."""
        super().index(document)
        eta = datetime.utcnow() + current_app.config["ILS_INDEXER_TASK_DELAY"]
        index_referenced_records.apply_async((document,), eta=eta)
