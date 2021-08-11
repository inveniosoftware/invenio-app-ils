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
from invenio_circulation.proxies import current_circulation
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

    # index the loan itself: this is needed because of the extra field
    # `available_items_for_loan_count` added when indexing.
    # To calculate the value of this field, a search on the `loans`
    # indexed is performed and this loan has to be already indexed
    # with its latest data.
    # At the first indexing, `available_items_for_loan_count` value might
    # be wrong and corrected at the second re-indexing.
    loan_class = current_circulation.loan_record_cls
    loan_record = loan_class.get_record_by_pid(loan["pid"])

    referenced.append(
        dict(pid_type=CIRCULATION_LOAN_PID_TYPE, record=loan_record)
    )

    # add all the other loans, as after indexing this one, they
    # will be affected in search
    pending_loans = \
        document.search_loan_references().scan()

    for loan_hit in pending_loans:
        pending_loan = loan_class.get_record_by_pid(loan_hit.pid)
        referenced.append(
            dict(pid_type=CIRCULATION_LOAN_PID_TYPE, record=pending_loan)
        )

    # index the loan and referenced records
    indexer.index(indexed, referenced)


class LoanIndexer(RecordIndexer):
    """Indexer class for Loan record."""

    def index(self, loan, arguments=None, **kwargs):
        """Index an Loan."""
        super().index(loan)
        eta = datetime.utcnow() + current_app.config["ILS_INDEXER_TASK_DELAY"]
        index_referenced_records.apply_async((loan,), eta=eta)


def index_extra_fields_for_loan(loan_dict):
    """Indexer hook to modify the loan record dict before indexing.

    The `available_items_for_loan_count` and `can_circulate_items_count` fields
    are added to the loan only on the search index because they are needed for
    search aggregation/filtering. They are not needed when fetching the loan
    details.
    """
    document_class = current_app_ils.document_record_cls
    document_record = document_class.get_record_by_pid(
        loan_dict.get("document_pid")
    )
    document = document_record.replace_refs()

    items_available_for_loan_count = document.get("circulation", {}).get(
        "available_items_for_loan_count"
    )
    loan_dict[
        "available_items_for_loan_count"
    ] = items_available_for_loan_count

    can_circulate_items_count = document.get("circulation", {}).get(
        "can_circulate_items_count"
    )
    loan_dict["can_circulate_items_count"] = can_circulate_items_count
