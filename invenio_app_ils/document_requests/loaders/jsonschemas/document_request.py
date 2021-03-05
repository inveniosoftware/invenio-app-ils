# -*- coding: utf-8 -*-
#
# Copyright (C) 2019 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""DocumentRequest schema for marshmallow loader."""

from flask import g
from invenio_records_rest.schemas import RecordMetadataSchemaJSONV1
from invenio_records_rest.schemas.fields.sanitizedhtml import SanitizedHTML
from marshmallow import EXCLUDE, Schema, ValidationError, fields, validate

from invenio_app_ils.document_requests.api import DocumentRequest
from invenio_app_ils.permissions import backoffice_permission


def validate_patron(patron_pid):
    """Validate patron PID."""
    if not backoffice_permission().allows(g.identity):
        if patron_pid != str(g.identity.id):
            raise ValidationError(
                "The authenticated user is not authorized to create or update "
                "a document request for another patron."
            )


class PhysicalItemProviderSchema(Schema):
    """Physical Item Provider schema."""

    class Meta:
        """Meta attributes for the schema."""

        unknown = EXCLUDE

    pid = fields.Str(required=True)
    pid_type = fields.Str(required=True)


class DocumentRequestSchemaV1(RecordMetadataSchemaJSONV1):
    """Document Request schema."""

    class Meta:
        """Meta attributes for the schema."""

        unknown = EXCLUDE

    authors = SanitizedHTML()
    document_pid = SanitizedHTML()
    edition = SanitizedHTML()
    internal_note = SanitizedHTML()
    isbn = SanitizedHTML()
    issn = SanitizedHTML()
    issue = SanitizedHTML()
    journal_title = SanitizedHTML()
    legacy_id = fields.Str()
    medium = fields.Str(required=True)
    note = SanitizedHTML()
    page = SanitizedHTML()
    patron_pid = fields.Str(required=True, validate=validate_patron)
    payment_info = SanitizedHTML()
    payment_method = SanitizedHTML()
    physical_item_provider = fields.Nested(PhysicalItemProviderSchema)
    publication_year = fields.Int()
    request_type = fields.Str(required=True)
    decline_reason = fields.Str(
        # add empty string in case the value must be reset
        validate=validate.OneOf(DocumentRequest.DECLINE_TYPES + [""])
    )
    standard_number = SanitizedHTML()
    state = fields.Str(validate=validate.OneOf(DocumentRequest.STATES))
    title = SanitizedHTML(required=True)
    volume = SanitizedHTML()
    publisher = SanitizedHTML()
