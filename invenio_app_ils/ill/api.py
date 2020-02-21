# -*- coding: utf-8 -*-
#
# Copyright (C) 2019-2020 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""ILL APIs."""

from functools import partial

import arrow
from flask import current_app
from flask_login import current_user
from invenio_pidstore.models import PIDStatus
from invenio_pidstore.providers.recordid_v2 import RecordIdProviderV2

from invenio_app_ils.circulation.api import checkout_loan
from invenio_app_ils.errors import RecordHasReferencesError
from invenio_app_ils.fetchers import pid_fetcher
from invenio_app_ils.ill.errors import ILLError
from invenio_app_ils.ill.proxies import current_ils_ill
from invenio_app_ils.minters import pid_minter
from invenio_app_ils.records.api import IlsRecord, preserve_fields

LIBRARY_PID_TYPE = "illlid"
LIBRARY_PID_MINTER = "illlid"
LIBRARY_PID_FETCHER = "illlid"

LibraryIdProvider = type(
    "LibraryIdProvider",
    (RecordIdProviderV2,),
    dict(pid_type=LIBRARY_PID_TYPE, default_status=PIDStatus.REGISTERED),
)
library_pid_minter = partial(pid_minter, provider_cls=LibraryIdProvider)
library_pid_fetcher = partial(pid_fetcher, provider_cls=LibraryIdProvider)


class Library(IlsRecord):
    """ILL library class."""

    _pid_type = LIBRARY_PID_TYPE
    _schema = "ill_libraries/library-v1.0.0.json"

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


BORROWING_REQUEST_PID_TYPE = "illbid"
BORROWING_REQUEST_PID_MINTER = "illbid"
BORROWING_REQUEST_PID_FETCHER = "illbid"

BorrowingRequestIdProvider = type(
    "BorrowingRequestIdProvider",
    (RecordIdProviderV2,),
    dict(
        pid_type=BORROWING_REQUEST_PID_TYPE,
        default_status=PIDStatus.REGISTERED,
    ),
)
borrowing_request_pid_minter = partial(
    pid_minter, provider_cls=BorrowingRequestIdProvider
)
borrowing_request_pid_fetcher = partial(
    pid_fetcher, provider_cls=BorrowingRequestIdProvider
)


class BorrowingRequest(IlsRecord):
    """ILL borrowing request class."""

    _pid_type = BORROWING_REQUEST_PID_TYPE
    _schema = "ill_borrowing_requests/borrowing_request-v1.0.0.json"
    _library_resolver_path = (
        "{scheme}://{host}/api/resolver/ill/"
        "borrowing-requests/{request_pid}/library"
    )
    STATUSES = ["PENDING", "REQUESTED", "ON_LOAN", "RETURNED", "CANCELLED"]
    TYPES = ["PHYSICAL", "ELECTRONIC"]

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

    @preserve_fields(fields=["created_by_pid"])
    def update(self, *args, **kwargs):
        """Update record."""
        super().update(*args, **kwargs)
        self.build_resolver_fields(self)

    def create_loan(
        self, transaction_location_pid=None, transaction_user_pid=None
    ):
        """Create a new loan out of this borrowing request.

        The newly created loan PID is added to the borrowing request and the
        status is changed to "ON_LOAN".
        It is the responsibility of the caller to ensure that the current
        borrowing request does not already have a loan attached and the initial
        status is valid.

        :param transaction_location_pid: the location pid of the transaction
            that will be stored in the loan. If not passed, the current one
            will be used.
        :param transaction_user_pid: the user pid of the transaction
            that will be stored in the loan. If not passed, the current logged
            in user id will be used.
        :return: the PID and record loan
        """
        tloc_pid = (
            transaction_location_pid
            or current_app.config["ILS_DEFAULT_LOCATION_PID"]
        )
        transaction_user_pid = transaction_user_pid or current_user.id
        if arrow.get(self["loan_end_date"]) < arrow.now():
            raise ILLError("The loan end date cannot be in the past.")

        item_pid = dict(type=self._pid_type, value=self["pid"])
        pid, loan = checkout_loan(
            end_date=self["loan_end_date"],
            document_pid=self["document_pid"],
            item_pid=item_pid,
            patron_pid=self["patron_pid"],
            transaction_location_pid=tloc_pid,
            transaction_user_pid=str(transaction_user_pid),
        )
        self["loan_pid"] = pid.pid_value
        self["status"] = "ON_LOAN"
        return pid, loan
