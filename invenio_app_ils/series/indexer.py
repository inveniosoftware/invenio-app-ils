# -*- coding: utf-8 -*-
#
# Copyright (C) 2019 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""Series indexer APIs."""

from datetime import datetime

from celery import shared_task
from flask import current_app
from invenio_indexer.api import RecordIndexer

from invenio_app_ils.indexer import ReferencedRecordsIndexer
from invenio_app_ils.proxies import current_app_ils
from invenio_app_ils.records.api import IlsRecord
from invenio_app_ils.series.api import SERIES_PID_TYPE


def get_related_records(series_pid):
    """Get referenced records via relations."""
    referenced = []
    series_record_cls = current_app_ils.series_record_cls
    record = series_record_cls.get_record_by_pid(series_pid)
    relations = record.relations
    for relation_type, related_records in relations.items():
        for obj in related_records:
            rec = IlsRecord.get_record_by_pid(
                obj["pid_value"], pid_type=obj["pid_type"]
            )
            referenced.append(dict(pid_type=obj["pid_type"], record=rec))
    return referenced


@shared_task(ignore_result=True)
def index_referenced_records(series):
    """Index referenced records."""
    indexer = ReferencedRecordsIndexer()

    indexed = dict(pid_type=SERIES_PID_TYPE, record=series)
    indexer.index(indexed, get_related_records(series["pid"]))


class SeriesIndexer(RecordIndexer):
    """Indexer class for Series record."""

    def index(self, series, arguments=None, **kwargs):
        """Index an Series."""
        super().index(series)
        eta = datetime.utcnow() + current_app.config["ILS_INDEXER_TASK_DELAY"]
        index_referenced_records.apply_async((series,), eta=eta)
