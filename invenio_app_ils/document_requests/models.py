# -*- coding: utf-8 -*-
#
# Copyright (C) 2020 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""DocumetRequest models."""

from invenio_db import db
from invenio_records.models import RecordMetadataBase


class DocumentRequestMetadata(db.Model, RecordMetadataBase):
    """DocumentRequest record metadata."""

    __tablename__ = "document_requests_metadata"
