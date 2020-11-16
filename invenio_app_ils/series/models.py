# -*- coding: utf-8 -*-
#
# Copyright (C) 2020 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""Location models."""

from invenio_db import db
from invenio_records.models import RecordMetadataBase


class SeriesMetadata(db.Model, RecordMetadataBase):
    """Series record metadata."""

    __tablename__ = "series_metadata"
