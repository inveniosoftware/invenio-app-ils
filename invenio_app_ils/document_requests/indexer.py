# -*- coding: utf-8 -*-
#
# Copyright (C) 2019-2025 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""DocumentRequest indexer APIs."""

from datetime import datetime

from celery import shared_task
from flask import current_app
from invenio_indexer.api import RecordIndexer
from invenio_search import current_search_client

from invenio_app_ils.acquisition.api import ORDER_PID_TYPE
from invenio_app_ils.acquisition.proxies import current_ils_acq
from invenio_app_ils.documents.api import DOCUMENT_PID_TYPE
from invenio_app_ils.ill.api import BORROWING_REQUEST_PID_TYPE
from invenio_app_ils.ill.proxies import current_ils_ill
from invenio_app_ils.indexer import ReferencedRecordsIndexer
from invenio_app_ils.proxies import current_app_ils

from .api import DOCUMENT_REQUEST_PID_TYPE


def index_stats_fields_for_document_request(doc_request_dict):
    """Indexer hook to modify the document request record dict before indexing."""

    # This is done through the hook and not through an indexer class,
    # as we need access to the `_created` field.

    physical_item_provider = doc_request_dict.get("physical_item_provider")
    if not physical_item_provider:
        return

    provider_pid = physical_item_provider["pid"]
    provider_pid_type = physical_item_provider["pid_type"]

    doc_request_created = doc_request_dict["_created"]
    doc_request_creation_date = datetime.fromisoformat(doc_request_created).date()

    provider_creation_date = None

    if provider_pid_type == ORDER_PID_TYPE:
        order_search_cls = current_ils_acq.order_search_cls
        search_body = {
            "query": {"term": {"pid": provider_pid}},
            "size": 1,
        }
        search_result = current_search_client.search(
            index=order_search_cls.Meta.index, body=search_body
        )
        hits = search_result["hits"]["hits"]
        if len(hits) > 0:
            order = hits[0]["_source"]
            provider_creation_date = datetime.fromisoformat(order["_created"]).date()

    elif provider_pid_type == BORROWING_REQUEST_PID_TYPE:
        brw_req_search_cls = current_ils_ill.borrowing_request_search_cls
        search_body = {
            "query": {"term": {"pid": provider_pid}},
            "size": 1,
        }
        search_result = current_search_client.search(
            index=brw_req_search_cls.Meta.index, body=search_body
        )
        hits = search_result["hits"]["hits"]
        if len(hits) > 0:
            brw_req = hits[0]["_source"]
            provider_creation_date = datetime.fromisoformat(brw_req["_created"]).date()
    stats = {}
    if provider_creation_date:
        provider_creation_delay = (
            provider_creation_date - doc_request_creation_date
        ).days
        stats["provider_creation_delay"] = (
            provider_creation_delay if provider_creation_delay >= 0 else None
        )

    if stats:
        doc_request_dict["stats"] = stats


@shared_task(ignore_result=True)
def index_referenced_records(docreq):
    """Index referenced records."""
    indexer = ReferencedRecordsIndexer()
    indexed = dict(pid_type=DOCUMENT_REQUEST_PID_TYPE, record=docreq)

    referenced = []

    # fetch and index the document
    document_pid = docreq.get("document_pid")
    if document_pid:
        document_cls = current_app_ils.document_record_cls
        document = document_cls.get_record_by_pid(document_pid)
        referenced.append(dict(pid_type=DOCUMENT_PID_TYPE, record=document))

    # fetch and index the related order (physical_item_provider)
    physical_item_provider = docreq.get("physical_item_provider")
    if physical_item_provider:
        provider_pid = physical_item_provider.get("pid")
        provider_pid_type = physical_item_provider.get("pid_type")
        if provider_pid and provider_pid_type == ORDER_PID_TYPE:
            order_cls = current_ils_acq.order_record_cls
            order = order_cls.get_record_by_pid(provider_pid)
            referenced.append(dict(pid_type=ORDER_PID_TYPE, record=order))

    indexer.index(indexed, referenced)


class DocumentRequestIndexer(RecordIndexer):
    """Indexer class for DocumentRequest record."""

    def index(self, docreq, arguments=None, **kwargs):
        """Index a DocumentRequest."""
        super().index(docreq)
        eta = datetime.utcnow() + current_app.config["ILS_INDEXER_TASK_DELAY"]
        index_referenced_records.apply_async((docreq,), eta=eta)
