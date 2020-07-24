# -*- coding: utf-8 -*-
#
# Copyright (C) 2019-2020 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""Test loan extend."""

import json
from copy import deepcopy

from flask import url_for

from tests.helpers import user_login


def test_loan_extend_permissions(
    client, json_headers, users, testdata, loan_params
):
    """Test loan can be extended."""

    def _checkout(loan_pid, params):
        """Perform checkout action before extension."""
        user_login(client, "librarian", users)
        checkout_url = url_for(
            "invenio_circulation_loan_actions.loanid_actions",
            pid_value=loan_pid,
            action="checkout",
        )
        resp = client.post(
            checkout_url, headers=json_headers, data=json.dumps(params)
        )
        assert resp.status_code == 202
        return resp.get_json()

    loan_pid = "loanid-1"
    params = deepcopy(loan_params)
    del params["transaction_date"]
    params["document_pid"] = "docid-1"
    params["item_pid"]["value"] = "itemid-2"

    loan = _checkout(loan_pid, params)

    tests = [
        ("admin", 202),
        ("librarian", 202),
        ("patron1", 202),
        ("patron3", 403),
    ]

    for username, expected_resp_code in tests:
        extend_url = loan["links"]["actions"]["extend"]

        # test extension
        user_login(client, username, users)
        extend_res = client.post(
            extend_url, headers=json_headers, data=json.dumps(params)
        )
        assert extend_res.status_code == expected_resp_code
