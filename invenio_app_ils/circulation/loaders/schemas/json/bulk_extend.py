# -*- coding: utf-8 -*-
#
# Copyright (C) 2021 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify
# it under the terms of the MIT License; see LICENSE file for more details.

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
