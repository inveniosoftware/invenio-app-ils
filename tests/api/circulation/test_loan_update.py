# -*- coding: utf-8 -*-
#
# Copyright (C) 2020 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""Test loan update."""
import json
from copy import deepcopy
from datetime import date, timedelta

from flask import url_for
from invenio_circulation.api import Loan

from tests.helpers import user_login, user_logout


def _url_loan(pid_value):
    return url_for("invenio_records_rest.loanid_item", pid_value=pid_value)


def _post_loan_update(
    client,
    json_headers,
    pid_value,
    start_date=None,
    end_date=None,
    request_start_date=None,
    request_expire_date=None,
):
    url = url_for(
        "invenio_app_ils_circulation.loanid_update_dates", pid_value=pid_value
    )
    data = {}
    if start_date:
        data["start_date"] = start_date
    if end_date:
        data["end_date"] = end_date
    if request_start_date:
        data["request_start_date"] = request_start_date
    if request_expire_date:
        data["request_expire_date"] = request_expire_date
    res = client.post(url, headers=json_headers, data=json.dumps(data))
    return res


def _load_result(res):
    return json.loads(res.data.decode("utf-8"))


def _today(dt=0):
    return (date.today() + timedelta(days=dt)).strftime("%Y-%m-%d")


def test_loan_access_permission(client, json_headers, users, testdata):
    """
    Test that a patron should not be able to update their loan;
    and a fortiori, other people's.
    """
    loan = testdata["loans"][0]
    user = user_login(client, "patron1", users)
    url = _url_loan(loan["pid"])
    res = client.get(url, headers=json_headers)
    assert res.status_code == 200  # Can access their own loan
    metadata = _load_result(res)["metadata"]
    metadata["transaction_user_pid"] = str(user.id)
    res = client.put(url, headers=json_headers, data=json.dumps(metadata))
    assert res.status_code == 403  # Cannot modify the loan


def test_loan_update_date(client, json_headers, users, testdata):
    """Test the edition of the dates on a loan."""
    pid = testdata["loans"][4]["pid"]  # Item on loan

    res = _post_loan_update(client, json_headers, pid)
    assert res.status_code == 401

    # Patron cannot update loan
    user_login(client, "patron1", users)
    res = _post_loan_update(client, json_headers, pid)
    assert res.status_code == 403
    user_logout(client)

    # Librarian can
    user_login(client, "librarian", users)
    old_loan = _load_result(client.get(_url_loan(pid), headers=json_headers))
    res = _post_loan_update(client, json_headers, pid)
    assert res.status_code == 202
    new_loan = _load_result(res)
    assert old_loan["updated"] < new_loan["updated"]  # Liveness check

    # Update both values
    start_date = "2020-01-01"
    end_date = _today(+1)
    res = _post_loan_update(
        client, json_headers, pid, start_date=start_date, end_date=end_date
    )
    assert res.status_code == 202
    new_loan_meta = _load_result(res)["metadata"]
    assert new_loan_meta["start_date"] == start_date
    assert new_loan_meta["end_date"] == end_date

    # Start date after today
    start_date = _today(+2)
    end_date = _today(+3)
    res = _post_loan_update(
        client, json_headers, pid, start_date=start_date, end_date=end_date
    )
    assert res.status_code == 400

    # No relative constraints on non-active loans
    pid = testdata["loans"][3]["pid"]  # Pending
    res = _post_loan_update(
        client,
        json_headers,
        pid,
        request_start_date=start_date,
        request_expire_date=end_date,
    )
    assert res.status_code == 202
    new_loan_meta = _load_result(res)["metadata"]
    assert new_loan_meta["request_start_date"] == start_date
    assert new_loan_meta["request_expire_date"] == end_date

    # Negative date range
    start_date = "2000-02-01"
    end_date = "2000-01-01"
    res = _post_loan_update(
        client,
        json_headers,
        pid,
        request_start_date=start_date,
        request_expire_date=end_date,
    )
    assert res.status_code == 400

    # Illegal combination of parameters
    start_date = _today(-2)
    end_date = _today(+2)
    res = _post_loan_update(
        client,
        json_headers,
        pid,
        start_date=start_date,
        end_date=end_date,
        request_start_date=start_date,
        request_expire_date=end_date,
    )
    assert res.status_code == 400
