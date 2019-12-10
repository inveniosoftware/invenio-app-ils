# -*- coding: utf-8 -*-
#
# Copyright (C) 2019 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""Vocabulary indexer APIs."""

from elasticsearch import VERSION as ES_VERSION
from invenio_indexer.api import RecordIndexer

lt_es7 = ES_VERSION[0] < 7


class VocabularyIndexer(RecordIndexer):
    """Indexer class for `Vocabulary`."""

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
        return (record._index, doc_type)
