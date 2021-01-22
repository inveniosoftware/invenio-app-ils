# -*- coding: utf-8 -*-
#
# Copyright (C) 2020 CERN.
#
# Invenio-Circulation is free software; you can redistribute it and/or modify
# it under the terms of the MIT License; see LICENSE file for more details.

"""Tests documents REST APIs permissions."""

import json

from flask import url_for
from invenio_db import db
from invenio_indexer.api import RecordIndexer
from invenio_search import current_search

from invenio_app_ils.documents.api import Document
from tests.helpers import user_login


def test_open_access_permissions(client, json_headers, testdata, users):
    """Test GET open/close access documents."""
    # set the documents to have read access only by patron2. `_access` should
    # be totally ignored.
    indexer = RecordIndexer()
    doc1 = Document.get_record_by_pid("docid-open-access")
    doc2 = Document.get_record_by_pid("docid-closed-access")
    for doc in [doc1, doc2]:
        doc.update(dict(_access=dict(read=["patron2"])))
        doc.commit()
        db.session.commit()
        indexer.index(doc)
    current_search.flush_and_refresh(index="documents")

    test_data = [
        ("anonymous", "docid-open-access", 200, 1),
        ("patron1", "docid-open-access", 200, 1),
        ("patron2", "docid-open-access", 200, 1),
        ("librarian", "docid-open-access", 200, 1),
        ("admin", "docid-open-access", 200, 1),
        ("anonymous", "docid-closed-access", 401, 0),
        ("patron1", "docid-closed-access", 403, 0),
        ("patron2", "docid-closed-access", 403, 0),
        ("librarian", "docid-closed-access", 200, 1),
        ("admin", "docid-closed-access", 200, 1),
    ]
    for user, pid, status_code, n_hits in test_data:
        # item endpoint
        user_login(client, user, users)
        url = url_for("invenio_records_rest.docid_item", pid_value=pid)
        res = client.get(url, headers=json_headers)
        assert res.status_code == status_code

        # list endpoint
        user_login(client, user, users)
        url = url_for(
            "invenio_records_rest.docid_list", q="pid:{}".format(pid)
        )
        res = client.get(url, headers=json_headers)
        hits = json.loads(res.data.decode("utf-8"))
        assert hits["hits"]["total"] == n_hits


def test_access_permissions(
    client, json_headers, testdata, users, with_access
):
    """Test GET documents with `_access` ignoring `restricted`."""
    # set the documents to have read access only by patron2. `_access` should
    # be taken into account and take precedence over `restricted`.
    indexer = RecordIndexer()
    doc1 = Document.get_record_by_pid("docid-open-access")
    doc2 = Document.get_record_by_pid("docid-closed-access")
    for doc in [doc1, doc2]:
        doc.update(dict(_access=dict(read=[users["patron2"].id])))
        doc.commit()
        db.session.commit()
        indexer.index(doc)
    current_search.flush_and_refresh(index="documents")

    test_data = [
        ("anonymous", "docid-open-access", 401, 0),
        ("patron1", "docid-open-access", 403, 0),
        ("patron2", "docid-open-access", 200, 1),  # should have access
        ("librarian", "docid-open-access", 200, 1),
        ("admin", "docid-open-access", 200, 1),
        ("anonymous", "docid-closed-access", 401, 0),
        ("patron1", "docid-closed-access", 403, 0),
        ("patron2", "docid-closed-access", 200, 1),  # should have access
        ("librarian", "docid-closed-access", 200, 1),
        ("admin", "docid-closed-access", 200, 1),
    ]
    for user, pid, status_code, n_hits in test_data:
        # item endpoint
        user_login(client, user, users)
        url = url_for("invenio_records_rest.docid_item", pid_value=pid)
        res = client.get(url, headers=json_headers)
        assert res.status_code == status_code

        # list endpoint
        user_login(client, user, users)
        url = url_for(
            "invenio_records_rest.docid_list", q="pid:{}".format(pid)
        )
        res = client.get(url, headers=json_headers)
        hits = json.loads(res.data.decode("utf-8"))
        assert hits["hits"]["total"] == n_hits
