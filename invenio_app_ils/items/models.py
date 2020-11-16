# -*- coding: utf-8 -*-
#
# Copyright (C) 2020 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""Item models."""

from invenio_db import db
from invenio_records.models import RecordMetadataBase


class ItemMetadata(db.Model, RecordMetadataBase):
    """Item record metadata."""

    __tablename__ = "items_metadata"
