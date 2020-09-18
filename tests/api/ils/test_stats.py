# -*- coding: utf-8 -*-
#
# Copyright (C) 2019 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""Test records relations."""

import json

from flask import url_for
from invenio_db import db

from invenio_app_ils.signals import record_viewed
from tests.helpers import user_login, user_logout


def _most_loaned_request(client, json_headers, from_date=None, to_date=None):
    """Perform a stats request."""
    params = []
    if from_date is not None:
        params.append("from_date={}".format(from_date))
    if to_date is not None:
        params.append("to_date={}".format(to_date))
    response = client.get(
        "{}?{}".format(
            url_for("invenio_app_ils_circulation_stats.most-loaned"),
            "&".join(params),
        ),
        headers=json_headers,
    )
    return json.loads(response.data.decode("utf-8"))


def _assert_most_loaned(client, json_headers, from_date, to_date, expect):
    """Assert most loaned request."""
    resp = _most_loaned_request(client, json_headers, from_date, to_date)
    hits = resp["hits"]["hits"]
    assert len(hits) == len(expect)
    for hit in hits:
        pid = hit["metadata"]["pid"]
        assert hit["metadata"]["loan_count"] == expect[pid]["loans"]
        assert hit["metadata"]["loan_extensions"] == expect[pid]["extensions"]


def test_stats_most_loaned_documents(
    client, json_headers, testdata_most_loaned, users
):
    """Test most loaned documents API endpoint."""
    user_login(client, "librarian", users)

    # Dates covering all loans
    _assert_most_loaned(
        client,
        json_headers,
        "2019-01-01",
        "2019-12-01",
        expect={
            "docid-1": dict(loans=3, extensions=0),
            "docid-2": dict(loans=1, extensions=1),
            "docid-3": dict(loans=2, extensions=6),
            "docid-5": dict(loans=1, extensions=0),
        },
    )
    # Test checking range which should be empty
    _assert_most_loaned(
        client, json_headers, "2019-01-01", "2019-01-01", expect={}
    )
    # Test range only including the first loan
    _assert_most_loaned(
        client,
        json_headers,
        "2019-01-01",
        "2019-01-03",
        expect={"docid-1": dict(loans=1, extensions=0)},
    )
    _assert_most_loaned(
        client,
        json_headers,
        "2019-02-02",
        "2019-03-02",
        expect={
            "docid-1": dict(loans=2, extensions=0),
            "docid-2": dict(loans=1, extensions=1),
            "docid-3": dict(loans=1, extensions=3),
        },
    )
    _assert_most_loaned(
        client,
        json_headers,
        "2019-05-20",
        "2019-08-22",
        expect={"docid-3": dict(loans=1, extensions=3)},
    )
    # outside end range
    _assert_most_loaned(
        client, json_headers, "2019-05-21", "2019-12-31", expect={}
    )


def test_stats_downloads_views_permissions(
    client, json_headers, users, testdata, mocker
):
    """Test permissions on downloads/views stats."""

    # mock record_viewed signal because travis timed out and the signal does
    # not need to be tested here
    mocker.patch(
        "invenio_app_ils.signals.record_viewed.send",
    )

    url_open_access = url_for(
        "ils_document_stats.docid_stats", pid_value="docid-open-access"
    )
    url_closed_access = url_for(
        "ils_document_stats.docid_stats", pid_value="docid-closed-access"
    )
    params = {}
    params["event"] = "record-view"

    # permission for librarian
    user_login(client, "librarian", users)
    res = client.post(
        url_open_access, headers=json_headers, data=json.dumps(params)
    )
    assert res.status_code == 202

    res = client.post(
        url_closed_access, headers=json_headers, data=json.dumps(params)
    )
    assert res.status_code == 202

    user_logout(client)

    # permission for patron
    user_login(client, "patron1", users)

    res = client.post(
        url_open_access, headers=json_headers, data=json.dumps(params)
    )
    assert res.status_code == 202

    res = client.post(
        url_closed_access, headers=json_headers, data=json.dumps(params)
    )
    assert res.status_code == 403

    user_logout(client)

    # permission for unauthenticated user
    res = client.post(
        url_open_access, headers=json_headers, data=json.dumps(params)
    )
    assert res.status_code == 202

    res = client.post(
        url_closed_access, headers=json_headers, data=json.dumps(params)
    )
    assert res.status_code == 401
