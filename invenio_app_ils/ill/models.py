# -*- coding: utf-8 -*-
#
# Copyright (C) 2020 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""ILL models."""

from invenio_db import db
from invenio_records.models import RecordMetadataBase


class LibraryMetadata(db.Model, RecordMetadataBase):
    """Library record metadata."""

    __tablename__ = "ill_libraries_metadata"


class BorrowingRequestMetadata(db.Model, RecordMetadataBase):
    """BorrowingRequest record metadata."""

    __tablename__ = "ill_brwreqs_metadata"
