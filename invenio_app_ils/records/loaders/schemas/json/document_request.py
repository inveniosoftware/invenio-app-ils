# -*- coding: utf-8 -*-
#
# Copyright (C) 2019 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""DocumentRequest schema for marshmallow loader."""

from flask import g
from invenio_records_rest.schemas.fields import PersistentIdentifier
from invenio_records_rest.schemas.fields.sanitizedhtml import SanitizedHTML
from invenio_records_rest.schemas.json import StrictKeysMixin
from marshmallow import ValidationError, fields

from invenio_app_ils.permissions import backoffice_permission


def validate_patron(patron_pid):
    """Validate patron PID."""
    if not backoffice_permission().allows(g.identity):
        if patron_pid != str(g.identity.id):
            raise ValidationError(
                "The authenticated user is not authorized to create or update "
                "a document request for another patron."
            )


class DocumentRequestSchemaV1(StrictKeysMixin):
    """Document Request schema."""

    authors = SanitizedHTML()
    cancel_reason = fields.Str()
    document = fields.Raw()
    document_pid = fields.Str()
    isbn = SanitizedHTML()
    issn = SanitizedHTML()
    issue = SanitizedHTML()
    note = SanitizedHTML()
    page = SanitizedHTML()
    patron_pid = fields.Str(required=True, validate=validate_patron)
    pid = PersistentIdentifier()  # needed for records rest PUT
    publication_year = fields.Int()
    state = fields.Str()
    title = SanitizedHTML(required=True)
    volume = SanitizedHTML()
