# SPDX-FileCopyrightText: 2020 CERN.
# SPDX-License-Identifier: MIT

"""Test loan update."""
import json
from copy import deepcopy
from datetime import date, timedelta

from flask import url_for
from invenio_circulation.api import Loan
from invenio_db import db

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
    user_login(client, "librarian", users)

    def _get_or_set_loan(index, state):
        """Fetch loan by testdata index and ensure it has the required DB state."""
        pid = testdata["loans"][index]["pid"]
        loan = Loan.get_record_by_pid(pid)
        if loan.get("state") != state:
            loan["state"] = state
            loan.commit()
            db.session.commit()
        return pid

    # 1. Test update cancelled loan dates -> fail
    pid_cancelled = _get_or_set_loan(0, "CANCELLED")
    res = _post_loan_update(client, json_headers, pid_cancelled, end_date=_today(+1))
    assert res.status_code == 400

    # 2. Test update returned loan dates -> fail
    pid_returned = _get_or_set_loan(1, "ITEM_RETURNED")
    res = _post_loan_update(client, json_headers, pid_returned, end_date=_today(+1))
    assert res.status_code == 400

    # 3. Test update request dates on active loan -> fail
    pid_active = _get_or_set_loan(4, "ITEM_ON_LOAN")
    res = _post_loan_update(
        client,
        json_headers,
        pid_active,
        request_start_date=_today(0),
        request_expire_date=_today(+5),
    )
    assert res.status_code == 400

    # 4. Test update start date on active loan -> fail
    res = _post_loan_update(client, json_headers, pid_active, start_date="2020-01-01")
    assert res.status_code == 400

    # 5. Test update end date on active loan -> pass
    new_end_date = _today(+5)
    res = _post_loan_update(client, json_headers, pid_active, end_date=new_end_date)
    assert res.status_code == 202
    new_loan_meta = _load_result(res)["metadata"]
    assert new_loan_meta["end_date"] == new_end_date

    # 6. Test update all dates on pending loan -> pass
    pid_pending = _get_or_set_loan(3, "PENDING")
    req_start = _today(0)
    req_expire = _today(+5)
    res = _post_loan_update(
        client,
        json_headers,
        pid_pending,
        request_start_date=req_start,
        request_expire_date=req_expire,
        start_date=_today(+5),
        end_date=_today(+10)
    )
    assert res.status_code == 202
    new_loan_meta = _load_result(res)["metadata"]
    assert new_loan_meta["request_start_date"] == req_start
    assert new_loan_meta["request_expire_date"] == req_expire
