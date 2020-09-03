# -*- coding: utf-8 -*-
#
# Copyright (C) 2020 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify
# it under the terms of the MIT License; see LICENSE file for more details.

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
