# SPDX-FileCopyrightText: 2018-2020 CERN.
# SPDX-License-Identifier: MIT

"""BorrowingRequest JSON serializers."""

from invenio_records_rest.serializers.json import JSONSerializer

from .custom_fields import field_loan


class BorrowingRequestJSONSerializer(JSONSerializer):
    """Serialize loan."""

    def transform_record(self, pid, record, links_factory=None, **kwargs):
        """Transform record into an intermediate representation."""
        record = super().transform_record(
            pid, record, links_factory=links_factory, **kwargs
        )
        field_loan(record["metadata"])
        return record
