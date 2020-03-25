# -*- coding: utf-8 -*-
#
# Copyright (C) 2019-2020 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""Test loan extend."""

import json

import pytest
from flask import url_for
from flask_security import login_user
from invenio_circulation.api import Loan
from invenio_circulation.proxies import current_circulation

from ..helpers import user_login


@pytest.mark.parametrize(
    "user,expected_resp_code",
    [
        ("admin", 202),
        ("librarian", 202),
        ("patron1", 202),
        ("patron3", 403),
    ],
)
def test_loan_extend_permissions(
    app, client, json_headers, users, testdata, app_config, loan_params,
    user, expected_resp_code
):
    """Test loan can be extended."""
    # Create a Loan for patron with pid 1
    login_user(users["librarian"])
    loan_data = testdata["loans"][0]
    loan = Loan.get_record_by_pid(loan_data["pid"])

    current_circulation.circulation.trigger(
        loan, **dict(loan_params, trigger="checkout")
    )

    user_login(client, "librarian", users)
    resp = client.get(
        url_for("invenio_records_rest.loanid_item", pid_value=loan["pid"]),
        headers=json_headers
    )
    loan = resp.get_json()

    # Remove payload params that break the request
    del loan_params["item_pid"]
    del loan_params["transaction_date"]
    extend_url = loan.get("links").get("actions").get("extend")

    user_login(client, user, users)
    extend_res = client.post(
        extend_url, headers=json_headers, data=json.dumps(loan_params))
    assert extend_res.status_code == expected_resp_code
