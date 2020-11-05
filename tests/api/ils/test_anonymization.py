# -*- coding: utf-8 -*-
#
# Copyright (C) 2020 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""Test anonymization of users."""

from copy import deepcopy

import pytest
from flask import url_for
from invenio_accounts.models import User
from invenio_circulation.api import Loan
from invenio_circulation.proxies import current_circulation
from invenio_db import db
from invenio_oauthclient.models import RemoteAccount, UserIdentity
from invenio_search import current_search
from invenio_userprofiles.models import UserProfile

from invenio_app_ils.acquisition.api import Order
from invenio_app_ils.acquisition.search import OrderSearch
from invenio_app_ils.circulation.search import (get_active_loans_by_patron_pid,
                                                get_loans_by_patron_pid)
from invenio_app_ils.document_requests.api import DocumentRequest
from invenio_app_ils.document_requests.search import DocumentRequestSearch
from invenio_app_ils.errors import AnonymizationActiveLoansError
from invenio_app_ils.ill.api import BorrowingRequest
from invenio_app_ils.ill.search import BorrowingRequestsSearch
from invenio_app_ils.patrons.anonymization import anonymize_patron_data
from invenio_app_ils.patrons.api import patron_exists
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


def check_user_activity(app, user_pid, client, json_headers):
    """ Check if there are records related to the user. """
    # wait ES refresh
    current_search.flush_and_refresh(index="*")

    AnonymousPatron = app.config["ILS_PATRON_ANONYMOUS_CLASS"]
    anonymous_patron_fields = AnonymousPatron().dumps_loader()

    loans = get_loans_by_patron_pid(user_pid).scan()
    for hit in loans:
        # test ES
        assert hit["patron"] == anonymous_patron_fields
        # test DB
        loan = Loan.get_record_by_pid(hit.pid)
        assert loan["patron"] == anonymous_patron_fields
        # test REST
        url = url_for("invenio_records_rest.loanid_item", pid_value=hit.pid)
        res = client.get(url, headers=json_headers)
        assert res.get_json()["metadata"]["patron"] == anonymous_patron_fields

    borrowing_requests = (
        BorrowingRequestsSearch().search_by_patron_pid(user_pid).scan()
    )
    for hit in borrowing_requests:
        # test ES
        assert hit["patron"] == anonymous_patron_fields
        # test DB
        borrowing_request = BorrowingRequest.get_record_by_pid(hit.pid)
        assert borrowing_request["patron"] == anonymous_patron_fields
        # test REST
        url = url_for("invenio_records_rest.illbid_item", pid_value=hit.pid)
        res = client.get(url, headers=json_headers)
        assert res.get_json()["metadata"]["patron"] == anonymous_patron_fields

    document_requests = (
        DocumentRequestSearch().search_by_patron_pid(user_pid).scan()
    )
    for hit in document_requests:
        # test ES
        assert hit["patron"] == anonymous_patron_fields
        # test DB
        document_request = DocumentRequest.get_record_by_pid(hit.pid)
        assert document_request["patron"] == anonymous_patron_fields
        # test REST
        url = url_for("invenio_records_rest.dreqid_item", pid_value=hit.pid)
        res = client.get(url, headers=json_headers)
        assert res.get_json()["metadata"]["patron"] == anonymous_patron_fields

    acquisitions = OrderSearch().search_by_patron_pid(user_pid).scan()
    for hit in acquisitions:
        # test ES
        assert hit["patron"] == anonymous_patron_fields
        # test DB
        acquisition = Order.get_record_by_pid(hit.pid)
        assert acquisition["patron"] == anonymous_patron_fields
        # test REST
        url = url_for("invenio_records_rest.acqoid_item", pid_value=hit.pid)
        res = client.get(url, headers=json_headers)
        assert res.get_json()["metadata"]["patron"] == anonymous_patron_fields


def cancel_active_loans(patron_pid, client, users):
    """Cancel active loans of a patron."""
    user = user_login(client, "admin", users)

    active_loans = get_active_loans_by_patron_pid(patron_pid).scan()

    for hit in active_loans:
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


def test_anonymization(app, client, json_headers, users, testdata):
    """Test anonymization of a user."""
    # Anonymize patron
    patron_pid = users["patron3"].id

    check_user_exists(patron_pid)
    cancel_active_loans(patron_pid, client, users)
    anonymize_patron_data(patron_pid)
    check_user_deleted(patron_pid)

    user_login(client, "admin", users)
    check_user_activity(app, patron_pid, client, json_headers)
    user_logout(client)

    # Anonymize librarian
    librarian_pid = users["librarian"].id

    check_user_exists(librarian_pid)
    cancel_active_loans(librarian_pid, client, users)
    anonymize_patron_data(librarian_pid)
    check_user_deleted(librarian_pid)

    # Anonymize patron while logged in
    patron_pid = users["patron2"].id
    user_login(client, "patron2", users)

    check_user_exists(patron_pid)
    cancel_active_loans(patron_pid, client, users)
    anonymize_patron_data(patron_pid)
    check_user_deleted(patron_pid)

    # It should fail when anonymizing patron with active loans
    patron_pid = users["patron1"].id
    check_user_exists(patron_pid)
    with pytest.raises(AnonymizationActiveLoansError):
        assert anonymize_patron_data(patron_pid)
