# -*- coding: utf-8 -*-
#
# Copyright (C) 2019 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""RecordRelation indexer APIs."""

from datetime import datetime

from celery import shared_task
from flask import current_app
from invenio_indexer.api import RecordIndexer

from invenio_app_ils.indexer import ReferencedRecordsIndexer
from invenio_app_ils.records.api import IlsRecord


@shared_task(ignore_result=True)
def index_related_records(indexed, related):
    """Index related records."""
    referenced = []
    for pid, pid_type in related:
        referenced.append(
            dict(
                pid_type=pid_type,
                record=IlsRecord.get_record_by_pid(pid, pid_type=pid_type),
            )
        )

    indexer = ReferencedRecordsIndexer()
    indexer.index(indexed, referenced)


class RecordRelationIndexer(RecordIndexer):
    """Indexer class for RecordRelation record."""

    def index(self, record, *records):
        """Index a RecordRelation."""
        super().index(record)
        referenced = set()
        indexed = dict(pid_type=record._pid_type, record=record)

        def add_referenced(pid_value, pid_type):
            same_record = (
                pid_value == record["pid"] and pid_type == record._pid_type
            )
            pid = (pid_value, pid_type)
            if not same_record and pid not in referenced:
                referenced.add(pid)

        for rec in records:
            add_referenced(rec["pid"], rec._pid_type)
            # TODO: we are indexing too many records here. The records to index
            # depend on the relation changed:
            # * for parent/child -> only child
            # * for siblings -> all
            # * for sequence -> only previous or next
            # this code should be moved up to the relation
            relations = rec.relations
            for relation_type, related_records in relations.items():
                for obj in related_records:
                    add_referenced(obj["pid_value"], obj["pid_type"])

        eta = datetime.utcnow() + current_app.config["ILS_INDEXER_TASK_DELAY"]
        index_related_records.apply_async((indexed, list(referenced)), eta=eta)
