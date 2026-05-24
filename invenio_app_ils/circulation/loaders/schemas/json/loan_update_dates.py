# SPDX-FileCopyrightText: 2020 CERN.
# SPDX-License-Identifier: MIT

"""Invenio App ILS circulation Loan update dates loader JSON schema."""

from invenio_circulation.records.loaders.schemas.json import DateString
from invenio_rest.serializer import BaseSchema as InvenioBaseSchema


class LoanUpdateDatesSchemaV1(InvenioBaseSchema):
    """Loan update dates schema."""

    class Meta:
        """Meta attributes for the schema."""

        from marshmallow import EXCLUDE

        unknown = EXCLUDE

    start_date = DateString()
    end_date = DateString()
    request_start_date = DateString()
    request_expire_date = DateString()
