# -*- coding: utf-8 -*-
#
# Copyright (C) 2020 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""Records relations tests helpers."""

from __future__ import unicode_literals

import json

from flask import url_for

from invenio_app_ils.records_relations.api import RecordRelationsExtraMetadata

TYPES_ENDPOINTS = {
    "relation": {
        "docid": "invenio_app_ils_relations.docid_relations",
        "serid": "invenio_app_ils_relations.serid_relations",
    },
    "get": {
        "docid": "invenio_records_rest.docid_item",
        "serid": "invenio_records_rest.serid_item",
    },
}


def recrel_fetch_record(client, json_headers, url):
    """Fetch a record."""
    res = client.get(url_for(url[0], pid_value=url[1]), headers=json_headers)
    assert res.status_code == 200
    return json.loads(res.data.decode("utf-8"))["metadata"]


def recrel_assert_record_relations(record, expected):
    """Test extra metadata and `relations` field on parent record."""
    extra_metadata_field_name = RecordRelationsExtraMetadata.field_name()
    relations_metadata = record.get(extra_metadata_field_name, {})
    expected_metadata = expected.get(extra_metadata_field_name, {})

    relations = record.get("relations", {})
    expected_relations = expected.get("relations", {})

    assert relations_metadata.keys() == expected_metadata.keys()
    for relation, records in relations_metadata.items():
        assert len(records) == len(expected_metadata[relation])
        for rec in records:
            assert rec in expected_metadata[relation]
    assert relations.keys() == expected_relations.keys()
    for relation, records in relations.items():
        assert len(records) == len(expected_relations[relation])
        for rec in records:
            assert rec in expected_relations[relation]


def recrel_do_request_for_valid_relation(
    client, json_headers, payload, url, method="POST", expect_status_code=None
):
    """Create a new valid relation."""
    func = client.delete if method == "DELETE" else client.post
    res = func(
        url_for(url[0], pid_value=url[1]),
        headers=json_headers,
        data=json.dumps(payload),
    )
    if expect_status_code is None:
        expected_status_code = 200 if method == "DELETE" else 201
    else:
        expected_status_code = expect_status_code
    assert res.status_code == expected_status_code
    if res.status_code not in [200, 201]:
        return
    return json.loads(res.data.decode("utf-8"))["metadata"]


def recrel_choose_endpoints_and_do_request(
    client_params, relation, payload, create_using_pid1=True,
    expect_status_code=None
):
    """Choose which endpoint to use, create relation, return records."""
    client, json_headers, method = client_params
    pid1, pid1_type, pid2, pid2_type = relation

    if create_using_pid1:
        url_create_rel = (TYPES_ENDPOINTS["relation"][pid1_type], pid1)
        url_other = (TYPES_ENDPOINTS["get"][pid2_type], pid2)

        record1 = recrel_do_request_for_valid_relation(
            client, json_headers, payload, url_create_rel, method=method,
            expect_status_code=expect_status_code
        )
        record2 = recrel_fetch_record(client, json_headers, url_other)
    else:
        url_create_rel = (TYPES_ENDPOINTS["relation"][pid2_type], pid2)
        url_other = (TYPES_ENDPOINTS["get"][pid1_type], pid1)

        record2 = recrel_do_request_for_valid_relation(
            client, json_headers, payload, url_create_rel, method=method,
            expect_status_code=expect_status_code
        )
        record1 = recrel_fetch_record(client, json_headers, url_other)
    return record1, record2
