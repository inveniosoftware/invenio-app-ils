# SPDX-FileCopyrightText: 2021 CERN.
# SPDX-License-Identifier: MIT

"""Invenio App ILS circulation bulk extend loader JSON schema."""

from invenio_rest.serializer import BaseSchema as InvenioBaseSchema
from marshmallow import fields


class BulkExtendLoansSchemaV1(InvenioBaseSchema):
    """Loan update dates schema."""

    class Meta:
        """Meta attributes for the schema."""

        from marshmallow import EXCLUDE

        unknown = EXCLUDE

    patron_pid = fields.String(required=True)
