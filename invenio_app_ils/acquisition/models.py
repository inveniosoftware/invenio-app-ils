# -*- coding: utf-8 -*-
#
# Copyright (C) 2020 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""Acquisition models."""

from invenio_db import db
from invenio_records.models import RecordMetadataBase


class VendorMetadata(db.Model, RecordMetadataBase):
    """Vendor record metadata."""

    __tablename__ = "acq_vendors_metadata"


class OrderMetadata(db.Model, RecordMetadataBase):
    """Order record metadata."""

    __tablename__ = "acq_orders_metadata"
