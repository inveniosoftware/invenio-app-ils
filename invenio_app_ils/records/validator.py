# -*- coding: utf-8 -*-
#
# Copyright (C) 2019 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""Ils Record Validators."""

from __future__ import absolute_import, print_function

from elasticsearch import VERSION as ES_VERSION
from invenio_pidstore.errors import PIDDoesNotExistError

from invenio_app_ils.circulation.search import get_active_loan_by_item_pid
from invenio_app_ils.errors import ItemDocumentNotFoundError, \
    ItemHasActiveLoanError
from invenio_app_ils.pidstore.pids import ITEM_PID_TYPE

lt_es7 = ES_VERSION[0] < 7


class RecordValidator(object):
    """ILS record validator."""

    def validate(self, record, **kwargs):
        """Validate record before create and commit.

        :param record: Record to be validated.
        :param kwargs: Keyword arguments passed from RecordBase:validate.
        """
        pass


class ItemValidator(RecordValidator):
    """Item record validator."""

    def ensure_document_exists(self, document_pid):
        """Ensure document exists or raise."""
        from invenio_app_ils.documents.api import Document
        try:
            Document.get_record_by_pid(document_pid)
        except PIDDoesNotExistError:
            raise ItemDocumentNotFoundError(document_pid)

    def ensure_item_can_be_updated(self, record):
        """Raises an exception if the item's status cannot be updated."""
        latest_version = record.revisions[-1]
        if latest_version:
            status = latest_version.get("status", None)
        else:
            status = None
        pid = record["pid"]
        if status == "CAN_CIRCULATE":
            item_pid = dict(value=pid, type=ITEM_PID_TYPE)
            active_loan = get_active_loan_by_item_pid(item_pid).execute().hits
            total = active_loan.total if lt_es7 else active_loan.total.value
            if total > 0:
                raise ItemHasActiveLoanError(active_loan[0]["pid"])

    def validate(self, record, **kwargs):
        """Validate record before create and commit."""
        super(ItemValidator, self).validate(record, **kwargs)

        document_pid = record.get("document_pid", None)
        if document_pid:
            self.ensure_document_exists(document_pid)
        if record.created:
            self.ensure_item_can_be_updated(record)
