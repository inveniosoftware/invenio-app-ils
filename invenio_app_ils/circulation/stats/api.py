# -*- coding: utf-8 -*-
#
# Copyright (C) 2019 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""APIs for ILS circulation statistics."""

from invenio_app_ils.circulation.search import get_most_loaned_documents
from invenio_app_ils.proxies import current_app_ils


def fetch_most_loaned_documents(from_date, to_date, bucket_size):
    """Fetch the documents with the most loans within the date interval."""
    # Create loans aggregation
    most_loaned = get_most_loaned_documents(from_date, to_date, bucket_size)

    # Prepare the loan and extension count
    document_pids = []
    document_metadata = {}
    loan_result = most_loaned.execute()
    for bucket in loan_result.aggregations.most_loaned_documents.buckets:
        document_pid = bucket["key"]
        loan_count = bucket["doc_count"]
        loan_extensions = int(bucket["extensions"]["value"])
        document_pids.append(document_pid)
        document_metadata[document_pid] = dict(
            loans=loan_count, extensions=loan_extensions
        )

    # Enhance the document serializer
    doc_search = current_app_ils.document_search_cls()
    doc_search = doc_search.with_preference_param().params(version=True)
    doc_search = doc_search.search_by_pid(*document_pids)
    doc_search = doc_search[0:bucket_size]
    result = doc_search.execute()

    for hit in result.hits:
        pid = hit["pid"]
        hit["loan_count"] = document_metadata[pid]["loans"]
        hit["loan_extensions"] = document_metadata[pid]["extensions"]

    res = result.to_dict()
    res["hits"]["hits"] = sorted(
        res["hits"]["hits"],
        key=lambda hit: hit["_source"]["loan_count"],
        reverse=True,
    )

    return res
