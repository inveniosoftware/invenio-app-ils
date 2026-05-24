# SPDX-FileCopyrightText: 2018-2020 CERN.
# SPDX-License-Identifier: MIT

"""BorrowingRequest CSV serializers."""

from invenio_records_rest.serializers.csv import CSVSerializer

from .custom_fields import field_loan


class BorrowingRequestCSVSerializer(CSVSerializer):
    """Serialize BorrowingRequest."""

    def transform_record(self, pid, record, links_factory=None, **kwargs):
        """Transform record into an intermediate representation."""
        record = super().transform_record(
            pid, record, links_factory=links_factory, **kwargs
        )
        field_loan(record["metadata"])
        return record
