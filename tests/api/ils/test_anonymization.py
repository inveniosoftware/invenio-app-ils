# -*- coding: utf-8 -*-
#
# Copyright (C) 2020 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""Test anonymization of users."""

import json
from copy import deepcopy

import pytest
from invenio_accounts.models import User
from invenio_circulation.api import Loan
from invenio_circulation.proxies import current_circulation
from invenio_db import db
from invenio_oauthclient.models import RemoteAccount, UserIdentity
from invenio_search import current_search
from invenio_userprofiles.models import UserProfile

from invenio_app_ils.acquisition.api import Order
from invenio_app_ils.acquisition.search import OrderSearch
from invenio_app_ils.anonymization import anonymize_patron_data
from invenio_app_ils.circulation.search import get_loans_by_patron_pid
from invenio_app_ils.document_requests.api import DocumentRequest
from invenio_app_ils.document_requests.search import DocumentRequestSearch
from invenio_app_ils.ill.api import BorrowingRequest
from invenio_app_ils.ill.search import BorrowingRequestsSearch
from invenio_app_ils.patrons.api import (get_anonymous_patron_dict,
                                         patron_exists)
from tests.helpers import user_login, user_logout


def check_user_deleted(user_pid):
    """ Check if user was deleted from database. """
    with db.session.begin_nested():
        user_identity = UserIdentity.query.filter(
            UserIdentity.id_user == user_pid
        ).first()

        assert user_identity is None

        remote_account = RemoteAccount.query.filter(
            RemoteAccount.user_id == user_pid
        ).first()
        assert remote_account is None

        user_profile = UserProfile.query.filter(
            UserProfile.user_id == user_pid
        ).first()
        assert user_profile is None

        user = User.query.filter(User.id == user_pid).first()
        assert user is None


def check_user_exists(user_pid):
    """ Check if user exists in database. """
    with db.session.begin_nested():
        assert patron_exists(user_pid)


def check_user_activity(user_pid):
    """ Check if there are records related to the user. """
    anonymous_patron = get_anonymous_patron_dict(user_pid)

    loans = get_loans_by_patron_pid(user_pid).scan()
    for hit in loans:
        loan = Loan.get_record_by_pid(hit.pid)
        assert loan["patron"] == anonymous_patron

    borrowing_requests = (
        BorrowingRequestsSearch().search_by_patron_pid(user_pid).scan()
    )
    for hit in borrowing_requests:
        borrowing_request = BorrowingRequest.get_record_by_pid(hit.pid)
        assert borrowing_request["patron"] == anonymous_patron

    document_requests = (
        DocumentRequestSearch().search_by_patron_pid(user_pid).scan()
    )
    for hit in document_requests:
        document_request = DocumentRequest.get_record_by_pid(hit.pid)
        assert document_request["patron"] == anonymous_patron

    acquisitions = OrderSearch().search_by_patron_pid(user_pid).scan()
    for hit in acquisitions:
        acquisition = Order.get_record_by_pid(hit.pid)
        assert acquisition["patron"] == anonymous_patron


def cancel_ongoing_loans(patron_pid, client, users):
    """ Cancel ongoing loans of a patron. """
    user = user_login(client, "admin", users)

    ongoing_loans = (
        get_loans_by_patron_pid(patron_pid)
        .filter("term", state="ITEM_ON_LOAN")
        .scan()
    )

    for hit in ongoing_loans:
        loan = Loan.get_record_by_pid(hit.pid)
        params = deepcopy(loan)
        params.update(
            dict(
                cancel_reason="Loan cancelled to anonymize user.",
                transaction_user_pid=str(user.id),
            )
        )
        current_circulation.circulation.trigger(
            loan, **dict(params, trigger="cancel")
        )

        loan.commit()
        db.session.commit()
        current_circulation.loan_indexer().index(loan)
        current_search.flush_and_refresh(index="*")

    user_logout(client)


def test_anonymization(client, json_headers, users, testdata):
    """Test anonymization of a user."""

    # Anonymize patron
    patron_pid = users["patron3"].id

    check_user_exists(patron_pid)
    cancel_ongoing_loans(patron_pid, client, users)
    anonymize_patron_data(patron_pid)
    check_user_deleted(patron_pid)
    check_user_activity(patron_pid)

    # Anonymize librarian
    librarian_pid = users["librarian"].id

    check_user_exists(librarian_pid)
    cancel_ongoing_loans(librarian_pid, client, users)
    anonymize_patron_data(librarian_pid)
    check_user_deleted(librarian_pid)

    # Anonymize patron while logged in
    patron_pid = users["patron2"].id

    user_login(client, "patron2", users)

    check_user_exists(patron_pid)
    cancel_ongoing_loans(patron_pid, client, users)
    anonymize_patron_data(patron_pid)
    check_user_deleted(patron_pid)

    # Anonymize patron with ongoing loans
    patron_pid = users["patron1"].id

    check_user_exists(patron_pid)
    with pytest.raises(AssertionError):
        assert anonymize_patron_data(patron_pid)
