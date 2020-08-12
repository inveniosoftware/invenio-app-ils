# -*- coding: utf-8 -*-
#
# Copyright (C) 2018-2020 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""Functions to anonymize user data and activity."""


from copy import deepcopy

from elasticsearch.exceptions import NotFoundError
from flask import current_app
from invenio_accounts.models import SessionActivity, User, userrole
from invenio_circulation.api import Loan
from invenio_circulation.proxies import current_circulation
from invenio_db import db
from invenio_oauthclient.models import RemoteAccount, UserIdentity
from invenio_userprofiles.models import UserProfile

from invenio_app_ils.acquisition.api import Order
from invenio_app_ils.acquisition.proxies import current_ils_acq
from invenio_app_ils.document_requests.api import DocumentRequest
from invenio_app_ils.errors import PatronNotFoundError
from invenio_app_ils.ill.api import BorrowingRequest
from invenio_app_ils.ill.proxies import current_ils_ill
from invenio_app_ils.patrons.api import (Patron, SystemAgent,
                                         get_anonymous_patron_dict,
                                         get_patron_or_unknown)

from .acquisition.search import OrderSearch
from .circulation.search import (get_active_loans_by_patron_pid,
                                 get_loans_by_patron_pid)
from .document_requests.search import DocumentRequestSearch
from .ill.search import BorrowingRequestsSearch
from .patrons.indexer import PatronIndexer
from .proxies import current_app_ils


def get_patron_activity(patron_pid):
    """Get activity related to the given patron pid."""
    if patron_pid is None:
        raise ValueError("No patron pid was provided.")

    patron = get_patron_or_unknown(patron_pid)
    if not patron:
        return None

    def dump(search):
        return [hit.to_dict() for hit in search.scan()]

    patron_document_requests = dump(
        DocumentRequestSearch().search_by_patron_pid(patron_pid)
    )

    patron_borrowing_requests = dump(
        BorrowingRequestsSearch().search_by_patron_pid(patron_pid)
    )

    patron_acquisitions = dump(OrderSearch().search_by_patron_pid(patron_pid))

    patron_loans = dump(get_loans_by_patron_pid(patron_pid))

    patron_profile = UserProfile.get_by_userid(patron_pid).__dict__
    del patron_profile["_sa_instance_state"]

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

    patron = get_patron_or_unknown(patron_pid)
    if not patron and not force:
        return None

    patron_object = None
    try:
        patron_object = current_app_ils.patron_cls.get_patron(patron_pid)
    except PatronNotFoundError:
        if not force:
            raise PatronNotFoundError(patron_pid)

    if (
        get_loans_by_patron_pid(patron_pid)
        .filter("term", state="ITEM_ON_LOAN")
        .count()
    ):
        raise AssertionError(
            "Cannot delete user %s: they have ongoing loans." % (patron_pid)
        )

    # Serialize empty patron values
    anonymous_patron_fields = get_anonymous_patron_dict(patron_pid)

    patron_loans = get_loans_by_patron_pid(patron_pid).scan()

    indices = 0

    for hit in patron_loans:
        loan = Loan.get_record_by_pid(hit.pid)
        if (
            loan["state"]
            == current_app.config["CIRCULATION_STATES_LOAN_REQUEST"]
        ):
            params = deepcopy(loan)
            params.update(
                dict(
                    cancel_reason="Loan request cancelled to anonymize user.",
                    transaction_user_pid=str(SystemAgent.id),
                )
            )
            current_circulation.circulation.trigger(
                loan, **dict(params, trigger="cancel")
            )
        loan["patron"] = anonymous_patron_fields
        loan.commit()
        current_circulation.loan_indexer().index(loan)
        indices += 1

    patron_borrowing_requests = (
        BorrowingRequestsSearch().search_by_patron_pid(patron_pid).scan()
    )

    for hit in patron_borrowing_requests:
        borrowing_request = BorrowingRequest.get_record_by_pid(hit.pid)
        borrowing_request["patron"] = anonymous_patron_fields
        borrowing_request.commit()
        current_ils_ill.borrowing_request_indexer_cls().index(
            borrowing_request
        )
        indices += 1

    patron_document_requests = (
        DocumentRequestSearch().search_by_patron_pid(patron_pid).scan()
    )

    for hit in patron_document_requests:
        document_request = DocumentRequest.get_record_by_pid(hit.pid)
        if document_request["state"] == "PENDING":
            document_request["state"] = "REJECTED"
            document_request["reject_reason"] = "USER_CANCEL"
        document_request["patron"] = anonymous_patron_fields
        document_request.commit()
        current_app_ils.document_request_indexer.index(document_request)
        indices += 1

    patron_acquisitions = OrderSearch().search_by_patron_pid(patron_pid).scan()

    for hit in patron_acquisitions:
        acquisition = Order.get_record_by_pid(hit.pid)
        acquisition.commit()
        current_ils_acq.order_indexer.index(acquisition)
        indices += 1

    # Delete rows from db
    dropped = delete_user_account(patron_pid)

    db.session.commit()
    if patron_object:
        try:
            PatronIndexer().delete(patron_object)
        except NotFoundError:
            pass

    return dropped, indices


def delete_user_account(patron_pid):
    """Deletes a user account from the database, without updating the index."""
    dropped = 0

    with db.session.begin_nested():
        d = db.session.query(userrole).filter(userrole.c.user_id == patron_pid)
        dropped += d.delete(synchronize_session=False)

        dropped += SessionActivity.query.filter(
            SessionActivity.user_id == patron_pid
        ).delete()

        dropped += UserIdentity.query.filter(
            UserIdentity.id_user == patron_pid
        ).delete()
        dropped += RemoteAccount.query.filter(
            RemoteAccount.user_id == patron_pid
        ).delete()

        dropped += UserProfile.query.filter(
            UserProfile.user_id == patron_pid
        ).delete()
        dropped += User.query.filter(User.id == patron_pid).delete()

    return dropped
