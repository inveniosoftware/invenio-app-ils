# -*- coding: utf-8 -*-
#
# Copyright (C) 2019-2020 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""ILL indexer APIs."""

from datetime import datetime

from celery import shared_task
from flask import current_app
from invenio_indexer.api import RecordIndexer

from invenio_app_ils.indexer import ReferencedRecordsIndexer

from .api import BORROWING_REQUEST_PID_TYPE, LIBRARY_PID_TYPE
from .proxies import current_ils_ill


def get_borrowing_requests(library_pid):
    """Get referenced borrowing requests."""
    referenced = []
    search_cls = current_ils_ill.borrowing_request_search_cls
    rec_cls = current_ils_ill.borrowing_request_record_cls
    for brw_request in (
        search_cls().search_by_library_pid(library_pid=library_pid).scan()
    ):
        rec = rec_cls.get_record_by_pid(brw_request["pid"])
        referenced.append(
            dict(pid_type=BORROWING_REQUEST_PID_TYPE, record=rec)
        )
    return referenced


@shared_task(ignore_result=True)
def index_referenced_records(library):
    """Index referenced records."""
    indexer = ReferencedRecordsIndexer()

    indexed = dict(pid_type=LIBRARY_PID_TYPE, record=library)

    indexer.index(indexed, get_borrowing_requests(library["pid"]))


class LibraryIndexer(RecordIndexer):
    """Indexer class for Library record."""

    def index(self, library, arguments=None, **kwargs):
        """Index a Library."""
        super().index(library)
        eta = datetime.utcnow() + current_app.config["ILS_INDEXER_TASK_DELAY"]
        index_referenced_records.apply_async((library,), eta=eta)
