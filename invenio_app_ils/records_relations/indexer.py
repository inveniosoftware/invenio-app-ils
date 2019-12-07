# -*- coding: utf-8 -*-
#
# Copyright (C) 2019 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""RecordRelation indexer APIs."""

from invenio_indexer.api import RecordIndexer


class RecordRelationIndexer(RecordIndexer):
    """Indexer class for RecordRelation record."""

    _indexed_records = set()

    def _index(self, record, related_pid, related_pid_type):
        """Index record only if not already indexed."""
        if (related_pid, related_pid_type) not in self._indexed_records:
            self._indexed_records.add((related_pid, related_pid_type))
            super().index(record)

    def index(self, *records):
        """Index a RecordRelation."""
        self._indexed_records = set()
        for record in records:
            self._index(record, record["pid"], record._pid_type)
            relations = record.relations.get()
            for relation_type, related_records in relations.items():
                for obj in related_records:
                    self._index(record, obj["pid"], obj["pid_type"])
