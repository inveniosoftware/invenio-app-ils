# -*- coding: utf-8 -*-
#
# Copyright (C) 2018-2020 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""Functions to anonymize user data and activity."""


from copy import deepcopy

from flask import current_app
from invenio_accounts.models import LoginInformation, SessionActivity, User, userrole
from invenio_circulation.pidstore.pids import CIRCULATION_LOAN_PID_TYPE
from invenio_circulation.proxies import current_circulation
from invenio_db import db
from invenio_oauthclient.models import RemoteAccount, RemoteToken, UserIdentity
from invenio_search.engine import search as inv_search
from invenio_userprofiles.models import UserProfile

from invenio_app_ils.acquisition.api import ORDER_PID_TYPE
from invenio_app_ils.acquisition.proxies import current_ils_acq
from invenio_app_ils.circulation.search import (
    get_active_loans_by_patron_pid,
    get_loans_by_patron_pid,
)
from invenio_app_ils.document_requests.api import DOCUMENT_REQUEST_PID_TYPE
from invenio_app_ils.errors import AnonymizationActiveLoansError, PatronNotFoundError
from invenio_app_ils.ill.api import BORROWING_REQUEST_PID_TYPE
from invenio_app_ils.ill.proxies import current_ils_ill
from invenio_app_ils.notifications.models import NotificationsLogs
from invenio_app_ils.patrons.api import get_patron_or_unknown_dump
from invenio_app_ils.proxies import current_app_ils


def get_patron_activity(patron_pid):
    """Get activity related to the given patron pid."""
    if patron_pid is None:
        raise ValueError("No patron pid was provided.")

    patron = get_patron_or_unknown_dump(patron_pid)

    def dump(search):
        return [hit.to_dict() for hit in search.scan()]

    DocumentRequestSearch = current_app_ils.document_request_search_cls
    patron_document_requests = dump(
        DocumentRequestSearch().search_by_patron_pid(patron_pid)
    )

    BorrowingRequestsSearch = current_ils_ill.borrowing_request_search_cls
    patron_borrowing_requests = dump(
        BorrowingRequestsSearch().search_by_patron_pid(patron_pid)
    )

    OrderSearch = current_ils_acq.order_search_cls
    patron_acquisitions = dump(OrderSearch().search_by_patron_pid(patron_pid))

    patron_loans = dump(get_loans_by_patron_pid(patron_pid))

    patron_profile = UserProfile.get_by_userid(patron_pid).__dict__

    patron_data = {
        "patron": patron,
        "profile": patron_profile,
        "document_requests": patron_document_requests,
        "borrowing_requests": patron_borrowing_requests,
        "acquisitions": patron_acquisitions,
        "loans": patron_loans,
    }

    return patron_data


def anonymize_patron_data(patron_pid, force=False):
    """Anonymize all the data/activity related to the given patron pid."""
    if patron_pid is None:
        raise ValueError("No patron pid was provided.")

    SystemAgent = current_app.config["ILS_PATRON_SYSTEM_AGENT_CLASS"]
    if str(patron_pid) == str(SystemAgent.id):
        raise ValueError("The patron pid cannot be the SystemAgent")

    try:
        patron = current_app_ils.patron_cls.get_patron(patron_pid)
    except PatronNotFoundError:
        patron = None
        if not force:
            raise PatronNotFoundError(patron_pid)

    n_loans = get_active_loans_by_patron_pid(patron_pid).count()
    if n_loans > 0:
        raise AnonymizationActiveLoansError(
            "Cannot delete user {0}: found {1} active loans.".format(
                patron_pid, n_loans
            )
        )
    OrderSearch = current_ils_acq.order_search_cls
    n_orders = OrderSearch().get_ongoing_orders_by_patron_pid(patron_pid).count()
    if n_orders > 0:
        raise AnonymizationActiveLoansError(
            "Cannot delete user {0}: found {1} active orders.".format(
                patron_pid, n_orders
            )
        )

    # get anonymous patron values
    cls = current_app.config["ILS_PATRON_ANONYMOUS_CLASS"]
    anonymous_patron_fields = cls().dumps_loader()

    Loan = current_circulation.loan_record_cls
    BorrowingRequest = current_ils_ill.borrowing_request_record_cls
    DocumentRequest = current_app_ils.document_request_record_cls
    Order = current_ils_acq.order_record_cls

    anonymized_records = {
        CIRCULATION_LOAN_PID_TYPE: {
            "indexer": current_circulation.loan_indexer(),
            "records": [],
        },
        BORROWING_REQUEST_PID_TYPE: {
            "indexer": current_ils_ill.borrowing_request_indexer_cls(),
            "records": [],
        },
        DOCUMENT_REQUEST_PID_TYPE: {
            "indexer": current_app_ils.document_request_indexer,
            "records": [],
        },
        ORDER_PID_TYPE: {
            "indexer": current_ils_acq.order_indexer,
            "records": [],
        },
    }

    patron_loans = get_loans_by_patron_pid(patron_pid).scan()

    indices = 0
    for hit in patron_loans:
        loan = Loan.get_record_by_pid(hit.pid)

        completed = (
            current_app.config["CIRCULATION_STATES_LOAN_CANCELLED"]
            + current_app.config["CIRCULATION_STATES_LOAN_COMPLETED"]
        )
        if loan["state"] not in completed:
            params = deepcopy(loan)
            params.update(
                dict(
                    cancel_reason="Loan request cancelled by the system.",
                    transaction_user_pid=str(SystemAgent.id),
                )
            )
            loan = current_circulation.circulation.trigger(
                loan, **dict(params, trigger="cancel")
            )
        loan["patron_pid"] = anonymous_patron_fields["pid"]
        loan["patron"] = anonymous_patron_fields
        loan.commit()
        anonymized_records[CIRCULATION_LOAN_PID_TYPE]["records"].append(loan)
        indices += 1

    BorrowingRequestsSearch = current_ils_ill.borrowing_request_search_cls
    patron_borrowing_requests = (
        BorrowingRequestsSearch().search_by_patron_pid(patron_pid).scan()
    )

    for hit in patron_borrowing_requests:
        borrowing_request = BorrowingRequest.get_record_by_pid(hit.pid)
        borrowing_request["patron"] = anonymous_patron_fields
        borrowing_request["patron_pid"] = anonymous_patron_fields["pid"]
        borrowing_request.commit()
        anonymized_records[BORROWING_REQUEST_PID_TYPE]["records"].append(borrowing_request)
        indices += 1

    DocumentRequestSearch = current_app_ils.document_request_search_cls
    patron_document_requests = (
        DocumentRequestSearch().search_by_patron_pid(patron_pid).scan()
    )

    for hit in patron_document_requests:
        document_request = DocumentRequest.get_record_by_pid(hit.pid)
        if document_request["state"] == "PENDING":
            document_request["state"] = "DECLINED"
            document_request["decline_reason"] = "USER_CANCEL"
        document_request["patron"] = anonymous_patron_fields
        document_request["patron_pid"] = anonymous_patron_fields["pid"]
        document_request.commit()
        anonymized_records[ORDER_PID_TYPE]["records"].append(document_request)
        indices += 1

    patron_acquisitions = OrderSearch().search_by_patron_pid(patron_pid).scan()

    for hit in patron_acquisitions:
        acquisition = Order.get_record_by_pid(hit.pid)
        for line in acquisition["order_lines"]:
            if line.get("patron_pid") == patron_pid:
                line["patron_pid"] = anonymous_patron_fields["pid"]
        acquisition.commit()
        anonymized_records[Order._pid_type]["records"].append(acquisition)
        indices += 1

    # delete rows from db
    dropped = delete_user_account(patron_pid)

    # anonymize recipient id in notifications
    notifications = anonymize_patron_in_notification_logs(patron_pid)

    db.session.commit()

    # index all after committing to DB, to ensure that no errors occurred.
    for value in anonymized_records.values():
        indexer, records = value["indexer"], value["records"]
        for record in records:
            indexer.index(record)

    if patron:
        try:
            patron_indexer = current_app_ils.patron_indexer
            patron_indexer.delete(patron)
        except inv_search.NotFoundError:
            pass

    return dropped, indices, notifications


def delete_user_account(patron_pid):
    """Deletes a user account from the database, without updating the index."""
    dropped = 0

    with db.session.begin_nested():
        d = db.session.query(userrole).filter(userrole.c.user_id == patron_pid)
        dropped += d.delete(synchronize_session=False) or 0

        dropped += (
            SessionActivity.query.filter(SessionActivity.user_id == patron_pid).delete()
            or 0
        )

        dropped += (
            UserIdentity.query.filter(UserIdentity.id_user == patron_pid).delete() or 0
        )

        ra = RemoteAccount.query.filter(
            RemoteAccount.user_id == patron_pid
        ).one_or_none()
        if ra:
            dropped += (
                RemoteToken.query.filter(
                    RemoteToken.id_remote_account == ra.id
                ).delete()
                or 0
            )
            dropped += ra.delete() or 0

        dropped += (
            LoginInformation.query.filter(
                LoginInformation.user_id == patron_pid
            ).delete()
            or 0
        )
        dropped += User.query.filter(User.id == patron_pid).delete() or 0

    return dropped


def anonymize_patron_in_notification_logs(patron_pid):
    """Anonymizes patron in notification log db."""
    notification_anonymizations = 0
    AnonymousPatron = current_app.config["ILS_PATRON_ANONYMOUS_CLASS"]

    with db.session.begin_nested():
        notifications = NotificationsLogs.query.filter_by(
            recipient_user_id=patron_pid
        ).all()
        for notification in notifications:
            notification.recipient_user_id = AnonymousPatron.id
            notification_anonymizations += 1
    db.session.commit()

    return notification_anonymizations
