# -*- coding: utf-8 -*-
#
# Copyright (C) 2019-2020 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""Test loan extend."""

import json
from copy import deepcopy

import pytest
from flask import url_for
from invenio_circulation.api import Loan
from invenio_db import db
from invenio_indexer.api import RecordIndexer
from tests.helpers import user_login


@pytest.mark.skip("Skipped because of a bug in extension valdation.")
def test_loan_extend_permissions(
    client, json_headers, users, testdata, loan_params
):
    """Test loan can be extended."""

    tests = [
        ("admin", "itemid-2", 202),
        ("librarian", "itemid-5", 202),
        ("patron1", "itemid-9", 202),
        ("patron3", "itemid-9", 403),
    ]

    loan_pid = "loanid-1"
    for username, item_pid_value, expected_resp_code in tests:
        # prepare params
        PARAMS = deepcopy(loan_params)
        del PARAMS["transaction_date"]
        PARAMS["item_pid"]["value"] = item_pid_value

        # Create a Loan for patron with pid 1
        user_login(client, "librarian", users)
        checkout_url = url_for(
            "invenio_circulation_loan_actions.loanid_actions",
            pid_value=loan_pid,
            action="checkout",
        )
        resp = client.post(
            checkout_url, headers=json_headers, data=json.dumps(PARAMS)
        )

        assert resp.status_code == 202
        loan = resp.get_json()

        # Remove payload params that break the request
        del PARAMS["item_pid"]
        extend_url = loan["links"]["actions"]["extend"]

        # test extension
        user_login(client, username, users)
        extend_res = client.post(
            extend_url, headers=json_headers, data=json.dumps(PARAMS)
        )
        assert extend_res.status_code == expected_resp_code

        # restore loan for the next test
        loan = Loan.get_record_by_pid(loan_pid)
        loan["state"] = "PENDING"
        loan.commit()
        db.session.commit()
        RecordIndexer().index(loan)
