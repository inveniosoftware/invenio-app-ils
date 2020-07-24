# -*- coding: utf-8 -*-
#
# Copyright (C) 2019-2020 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""ILL APIs."""

from datetime import timedelta
from functools import partial

import arrow
from flask import current_app
from flask_login import current_user
from invenio_circulation.api import Loan
from invenio_circulation.proxies import current_circulation
from invenio_pidstore.models import PIDStatus
from invenio_pidstore.providers.recordid_v2 import RecordIdProviderV2

from invenio_app_ils.circulation.api import (
    checkout_loan, circulation_default_loan_duration_for_item)
from invenio_app_ils.errors import (RecordHasReferencesError,
                                    UnknownItemPidTypeError)
from invenio_app_ils.fetchers import pid_fetcher
from invenio_app_ils.ill.errors import ILLError
from invenio_app_ils.ill.proxies import current_ils_ill
from invenio_app_ils.minters import pid_minter
from invenio_app_ils.proxies import current_app_ils
from invenio_app_ils.records.api import IlsRecord

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
    _document_resolver_path = (
        "{scheme}://{host}/api/resolver/ill/"
        "borrowing-requests/{brw_req_pid}/document"
    )
    _library_resolver_path = (
        "{scheme}://{host}/api/resolver/ill/"
        "borrowing-requests/{brw_req_pid}/library"
    )
    _patron_resolver_path = (
        "{scheme}://{host}/api/resolver/ill/"
        "borrowing-requests/{brw_req_pid}/patron"
    )
    STATUSES = ["PENDING", "REQUESTED", "ON_LOAN", "RETURNED", "CANCELLED"]
    TYPES = ["PHYSICAL_COPY", "ELECTRONIC"]
    EXTENSION_STATUSES = ["PENDING", "DECLINED"]

    @classmethod
    def build_resolver_fields(cls, data):
        """Build all resolver fields."""
        data["document"] = {
            "$ref": cls._document_resolver_path.format(
                scheme=current_app.config["JSONSCHEMAS_URL_SCHEME"],
                host=current_app.config["JSONSCHEMAS_HOST"],
                brw_req_pid=data["pid"],
            )
        }
        data["library"] = {
            "$ref": cls._library_resolver_path.format(
                scheme=current_app.config["JSONSCHEMAS_URL_SCHEME"],
                host=current_app.config["JSONSCHEMAS_HOST"],
                brw_req_pid=data["pid"],
            )
        }
        data["patron"] = {
            "$ref": cls._patron_resolver_path.format(
                scheme=current_app.config["JSONSCHEMAS_URL_SCHEME"],
                host=current_app.config["JSONSCHEMAS_HOST"],
                brw_req_pid=data["pid"],
            )
        }

    @classmethod
    def create(cls, data, id_=None, **kwargs):
        """Create record."""
        cls.build_resolver_fields(data)
        return super().create(data, id_=id_, **kwargs)

    def update(self, *args, **kwargs):
        """Update record."""
        super().update(*args, **kwargs)
        self.build_resolver_fields(self)

    @property
    def patron_loan(self):
        """Get patron loan object."""
        return _PatronLoan(self)


class _PatronLoan:
    """Class to access patron loan object."""

    def __init__(self, record):
        """Constructor."""
        self.record = record

    def get(self):
        """Return the loan for this borrowing request."""
        loan_pid = self.record.get("patron_loan", {}).get("pid")
        if not loan_pid:
            raise ILLError("There is no patron loan attached to the request.")
        return Loan.get_record_by_pid(loan_pid)

    def create(
        self,
        start_date,
        end_date,
        transaction_location_pid=None,
        transaction_user_pid=None,
    ):
        """Create a new loan for the patron out of this borrowing request.

        The newly created loan PID is added to the borrowing request and the
        status is changed to "ON_LOAN".
        It is the responsibility of the caller to ensure that the current
        borrowing request does not already have a loan attached and the initial
        status is valid.

        :param start_date: the start date of the loan.
        :param end_date: the end date of the loan.
        :param transaction_location_pid: the location pid of the transaction
            that will be stored in the loan. If not passed, the current one
            will be used.
        :param transaction_user_pid: the user pid of the transaction
            that will be stored in the loan. If not passed, the current logged
            in user id will be used.
        :return: the PID and record loan
        """
        rec = self.record

        tloc_pid = transaction_location_pid
        if not tloc_pid:
            pid_value, _ = current_app_ils.get_default_location_pid
            tloc_pid = pid_value

        transaction_user_pid = transaction_user_pid or str(current_user.id)
        if arrow.get(end_date) < arrow.now():
            raise ILLError("The loan end date cannot be in the past.")

        item_pid = dict(type=rec._pid_type, value=rec["pid"])
        pid, loan = checkout_loan(
            start_date=start_date,
            end_date=end_date,
            document_pid=rec["document_pid"],
            item_pid=item_pid,
            patron_pid=rec["patron_pid"],
            transaction_location_pid=tloc_pid,
            transaction_user_pid=str(transaction_user_pid),
        )
        rec.setdefault("patron_loan", {})
        rec["patron_loan"]["pid"] = pid.pid_value
        rec["status"] = "ON_LOAN"
        return pid, loan

    @property
    def extension(self):
        """Get patron loan extension object."""
        return _PatronLoanExtension(self.record, self)


class _PatronLoanExtension:
    """Class to access patron loan extension object."""

    def __init__(self, record, patron_loan):
        """Constructor."""
        self.record = record
        self.patron_loan = patron_loan

    def request(self):
        """Store the new extension request."""
        rec_loan = self.record["patron_loan"]
        rec_loan.setdefault("extension", {})
        rec_loan["extension"]["status"] = "PENDING"
        today = arrow.now().date()
        rec_loan["extension"]["request_date"] = today.isoformat()

    def accept(
        self,
        end_date,
        transaction_location_pid=None,
        transaction_user_pid=None,
        loan=None,
    ):
        """Extend current loan."""
        _loan = loan or self.patron_loan.get()

        tloc_pid = transaction_location_pid
        if not tloc_pid:
            pid_value, _ = current_app_ils.get_default_location_pid
            tloc_pid = pid_value

        transaction_user_pid = transaction_user_pid or str(current_user.id)

        item_pid = dict(type=self.record._pid_type, value=self.record["pid"])
        current_circulation.circulation.trigger(
            loan,
            **dict(
                end_date=end_date,
                document_pid=self.record["document_pid"],
                item_pid=item_pid,
                patron_pid=self.record["patron_pid"],
                transaction_location_pid=tloc_pid,
                transaction_user_pid=str(transaction_user_pid),
                trigger="extend",
            )
        )

        rec_loan = self.record["patron_loan"]
        extension = rec_loan["extension"]

        # update information in the borrowing request
        del extension["status"]

    def decline(self):
        """Decline the extension request."""
        extension = self.record["patron_loan"]["extension"]
        extension["status"] = "DECLINED"


def validate_item_pid(item_pid):
    """Validate item or raise and return an obj to easily distinguish them."""
    from invenio_app_ils.items.api import ITEM_PID_TYPE

    if item_pid["type"] not in [BORROWING_REQUEST_PID_TYPE, ITEM_PID_TYPE]:
        raise UnknownItemPidTypeError(pid_type=item_pid["type"])

    # inline object with properties
    return type(
        "obj",
        (object,),
        {
            "is_item": item_pid["type"] == ITEM_PID_TYPE,
            "is_brw_req": item_pid["type"] == BORROWING_REQUEST_PID_TYPE,
        },
    )


def can_item_circulate(item_pid):
    """Return True if the provided item can circulate."""
    validator = validate_item_pid(item_pid)
    if validator.is_brw_req:
        return True

    # physical item
    Item = current_app_ils.item_record_cls
    item = Item.get_record_by_pid(item_pid["value"])
    if item:
        return item["status"] == "CAN_CIRCULATE"
    return False


def circulation_default_loan_duration(loan, _):
    """Return a default loan duration in timedelta."""
    item_pid = loan["item_pid"]
    validator = validate_item_pid(item_pid)
    if validator.is_brw_req:
        # the loan end_date should be set when checking out, no duration
        # to be added
        return timedelta(days=0)

    # physical item
    Item = current_app_ils.item_record_cls
    item = Item.get_record_by_pid(item_pid["value"])
    return circulation_default_loan_duration_for_item(item)


def circulation_default_extension_duration(loan, initial_loan):
    """Return a default extension duration in timedelta."""
    item_pid = loan["item_pid"]
    validator = validate_item_pid(item_pid)
    if validator.is_brw_req:
        # the loan has been already changed with a new end_date
        # return 0 to avoid to add again a new duration to the end_date
        return timedelta(days=0)

    # physical item
    Item = current_app_ils.item_record_cls
    item = Item.get_record_by_pid(item_pid["value"])
    return circulation_default_loan_duration_for_item(item)


def circulation_item_location_retriever(item_pid):
    """Return the location of the item."""
    validator = validate_item_pid(item_pid)
    if validator.is_brw_req:
        pid_value, _ = current_app_ils.get_default_location_pid
        return pid_value

    # physical item
    Item = current_app_ils.item_record_cls
    item = Item.get_record_by_pid(item_pid["value"])
    _item = item.replace_refs()
    return _item["internal_location"]["location_pid"]
