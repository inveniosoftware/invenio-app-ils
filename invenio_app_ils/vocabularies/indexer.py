# SPDX-FileCopyrightText: 2019 CERN.
# SPDX-License-Identifier: MIT

"""Vocabulary indexer APIs."""

from invenio_indexer.api import RecordIndexer


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
        doc_type = None
        return (record._index, doc_type)
