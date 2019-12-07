# -*- coding: utf-8 -*-
#
# Copyright (C) 2019 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""ILL APIs."""

from flask import current_app

from invenio_app_ils.errors import RecordHasReferencesError
from invenio_app_ils.ill.proxies import current_ils_ill
from invenio_app_ils.records.api import IlsRecord

from .pidstore.pids import BORROWING_REQUEST_PID_TYPE, LIBRARY_PID_TYPE


class Library(IlsRecord):
    """ILL library class."""

    _pid_type = LIBRARY_PID_TYPE
    _schema = "ill-libraries/library-v1.0.0.json"

    def delete(self, **kwargs):
        """Delete record."""
        search_cls = current_ils_ill.borrowing_request_search_cls
        requests_search_res = search_cls().search_by_library_pid(self["pid"])
        if requests_search_res.count():
            raise RecordHasReferencesError(
                record_type="Library",
                record_id=self["pid"],
                ref_type="BorrowingRequest",
                ref_ids=sorted(
                    [res["pid"] for res in requests_search_res.scan()]
                ),
            )
        return super().delete(**kwargs)


class BorrowingRequest(IlsRecord):
    """ILL borrowing request class."""

    _pid_type = BORROWING_REQUEST_PID_TYPE
    _schema = "ill-borrowing-requests/borrowing-request-v1.0.0.json"
    _library_resolver_path = "{scheme}://{host}/api/resolver/ill/" \
                             "borrowing-requests/{request_pid}/library"
    STATUSES = ["PENDING", "REQUESTED", "ON_LOAN", "RETURNED", "CANCELLED"]

    @classmethod
    def build_resolver_fields(cls, data):
        """Build all resolver fields."""
        data["library"] = {
            "$ref": cls._library_resolver_path.format(
                scheme=current_app.config["JSONSCHEMAS_URL_SCHEME"],
                host=current_app.config["JSONSCHEMAS_HOST"],
                request_pid=data["pid"],
            )
        }

    @classmethod
    def create(cls, data, id_=None, **kwargs):
        """Create record."""
        cls.build_resolver_fields(data)
        return super().create(data, id_=id_, **kwargs)

    def update(self, data):
        """Update record."""
        super().update(data)
        self.build_resolver_fields(self)
