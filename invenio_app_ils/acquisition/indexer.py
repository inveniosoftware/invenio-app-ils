# -*- coding: utf-8 -*-
#
# Copyright (C) 2025 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""Order indexer APIs."""

from datetime import datetime

from invenio_search import current_search_client

from invenio_app_ils.acquisition.api import ORDER_PID_TYPE
from invenio_app_ils.proxies import current_app_ils


def index_stats_fields_for_order(order_dict):
    """Indexer hook to modify the order record dict before indexing."""

    # This is done through the hook and not through an indexer class,
    # as we need access to the `_created` field

    # Only calculate stats if order is received
    if not order_dict.get("received_date"):
        return

    stats = {}

    received_date = datetime.fromisoformat(order_dict["received_date"]).date()
    creation_date = datetime.fromisoformat(order_dict["_created"]).date()

    # Calculate order_processing_time
    order_processing_time = (received_date - creation_date).days
    stats["order_processing_time"] = order_processing_time if order_processing_time >= 0 else None

    # Find related document request if any
    order_pid = order_dict.get("pid")
    if order_pid:
        doc_req_search_cls = current_app_ils.document_request_search_cls
        search_body = {
            "query": {
                "bool": {
                    "must": [
                        {"term": {"physical_item_provider.pid": order_pid}},
                        {"term": {"physical_item_provider.pid_type": ORDER_PID_TYPE}},
                    ],
                }
            },
            "size": 1,
        }

        search_result = current_search_client.search(
            index=doc_req_search_cls.Meta.index, body=search_body
        )

        hits = search_result["hits"]["hits"]
        if len(hits) > 0:
            doc_request = hits[0]["_source"]
            doc_req_creation_date = datetime.fromisoformat(
                doc_request["_created"]
            ).date()

            order_dict["doc_request"] = {}

            # Calculate document_request_waiting_time
            waiting_time = (received_date - doc_req_creation_date).days
            stats["document_request_waiting_time"] = (
                waiting_time if waiting_time >= 0 else None
            )

    order_dict["stats"] = stats
