# -*- coding: utf-8 -*-
#
# Copyright (C) 2020 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""ChangedBy schema for marshmallow loader."""

from flask import has_request_context
from flask_login import current_user
from marshmallow import EXCLUDE, Schema, fields, validate

from invenio_app_ils.records.api import IlsRecord


class ChangedBySchema(Schema):
    """ChangedBy schema."""

    class Meta:
        """Meta attributes for the schema."""

        unknown = EXCLUDE

    type = fields.Str(
        required=True, validate=validate.OneOf(IlsRecord.CURATOR_TYPES)
    )
    value = fields.Str()


def set_changed_by(data, prev_record=None):
    """Automatically add the `created_by` and `updated_by` fields."""
    if not has_request_context():
        return data

    changed_by = dict(type="user_id", value=str(current_user.id))
    if prev_record:
        # updating an already existing record
        if "created_by" in prev_record:
            data["created_by"] = prev_record["created_by"]
        data["updated_by"] = changed_by
    else:
        # creating a new record
        data["created_by"] = changed_by

    return data
