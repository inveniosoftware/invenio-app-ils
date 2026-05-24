# SPDX-FileCopyrightText: 2020 CERN.
# SPDX-License-Identifier: MIT

"""Price schema for marshmallow loader."""

from marshmallow import EXCLUDE, Schema, fields


class PriceSchema(Schema):
    """Price schema."""

    class Meta:
        """Meta attributes for the schema."""

        unknown = EXCLUDE

    currency = fields.Str(required=True)
    value = fields.Number(required=True)
