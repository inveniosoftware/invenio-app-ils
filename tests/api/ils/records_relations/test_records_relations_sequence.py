# -*- coding: utf-8 -*-
#
# Copyright (C) 2020 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""Test records relations sequence."""

import json

from flask import url_for

from tests.helpers import get_test_record, user_login

from .helpers import (
    recrel_assert_record_relations,
    recrel_choose_endpoints_and_do_request,
)


def _test_sequence_invalid_relations_should_fail(
    client, json_headers, invalids, status_code=400
):
    """Test relation creation with invalid link relation should fail."""
    api_endpoint_series = "invenio_app_ils_relations.serid_relations"

    for invalid in invalids:
        next_pid_value = invalid["next_pid_value"]
        next_pid_type = invalid["next_pid_type"]
        previous_pid_value = invalid["previous_pid_value"]
        previous_pid_type = invalid["previous_pid_type"]
        relation_type = invalid["relation_type"]

        url = url_for(api_endpoint_series, pid_value=next_pid_value)
        payload = {
            "next_pid_value": next_pid_value,
            "next_pid_type": next_pid_type,
            "previous_pid_value": previous_pid_value,
            "previous_pid_type": previous_pid_type,
            "relation_type": relation_type,
        }

        res = client.post(url, headers=json_headers, data=json.dumps(payload))
        assert res.status_code == status_code
        if status_code == 400:
            error = json.loads(res.data.decode("utf-8"))
            assert "message" in error
            assert next_pid_value in error["message"]
            assert previous_pid_value in error["message"]


def _test_sequence(client, json_headers):
    """Test create and delete next and previous relations."""
    next_pid_value = "serid-2"
    next_pid_type = "serid"
    previous_pid_value = "serid-1"
    previous_pid_type = "serid"
    relation_type = "sequence"

    payload = {
        "next_pid_value": next_pid_value,
        "next_pid_type": next_pid_type,
        "previous_pid_value": previous_pid_value,
        "previous_pid_type": previous_pid_type,
        "relation_type": relation_type,
    }

    def _test_create_sequence(create_using_pid1=True):
        """Test relation creation of sequence Series."""

        next_rec, prev_rec = recrel_choose_endpoints_and_do_request(
            (client, json_headers, "POST"),
            (
                next_pid_value,
                next_pid_type,
                previous_pid_value,
                previous_pid_type,
            ),
            payload,
            create_using_pid1=create_using_pid1,
        )

        recrel_assert_record_relations(
            next_rec,
            expected={
                "relations": {
                    "sequence": [
                        {
                            "pid_value": previous_pid_value,
                            "pid_type": previous_pid_type,
                            "relation_type": "sequence",
                            "relation_order": "continues",
                            "record_metadata": {
                                "title": prev_rec["title"],
                                "mode_of_issuance": prev_rec[
                                    "mode_of_issuance"
                                ],
                            },
                        }
                    ]
                }
            },
        )

        recrel_assert_record_relations(
            prev_rec,
            expected={
                "relations": {
                    "sequence": [
                        {
                            "pid_value": next_pid_value,
                            "pid_type": next_pid_type,
                            "relation_type": "sequence",
                            "relation_order": "is_continued_by",
                            "record_metadata": {
                                "title": next_rec["title"],
                                "mode_of_issuance": next_rec[
                                    "mode_of_issuance"
                                ],
                            },
                        }
                    ]
                }
            },
        )

    def _test_delete_sequence(create_using_pid1=True):
        """Test deletion of sequence relation."""

        next_rec, prev_rec = recrel_choose_endpoints_and_do_request(
            (client, json_headers, "DELETE"),
            (
                next_pid_value,
                next_pid_type,
                previous_pid_value,
                previous_pid_type,
            ),
            payload,
            create_using_pid1=create_using_pid1,
        )

        recrel_assert_record_relations(next_rec, expected={"relations": {}})
        recrel_assert_record_relations(prev_rec, expected={"relations": {}})

    _test_create_sequence()
    _test_delete_sequence()
    _test_create_sequence(create_using_pid1=False)
    _test_delete_sequence(create_using_pid1=False)
    # recreate for the next one, to have some more valuable test data
    _test_create_sequence()


def _test_split_sequence(client, json_headers, testdata):
    """Test create split next relations."""
    next_pid_type = "serid"
    previous_pid_value = "serid-2"
    previous_pid_type = "serid"
    relation_type = "sequence"

    payload = {
        "next_pid_type": next_pid_type,
        "previous_pid_value": previous_pid_value,
        "previous_pid_type": previous_pid_type,
        "relation_type": relation_type,
    }

    # serid-1 from previous test
    rec_serid_1 = get_test_record(testdata, "series", "serid-1")
    serid_1 = {
        "pid_value": "serid-1",
        "pid_type": "serid",
        "relation_type": "sequence",
        "relation_order": "continues",
        "record_metadata": {
            "title": rec_serid_1["title"],
            "mode_of_issuance": rec_serid_1["mode_of_issuance"],
        },
    }

    def _test_create_split_sequence(create_using_pid1=True):
        """Test relation creation for split sequence."""
        pid_values = ["serid-3", "serid-4"]
        second_records = []

        for pid_value in pid_values:
            next_pid_value = pid_value
            payload["next_pid_value"] = pid_value
            next_rec, prev_rec = recrel_choose_endpoints_and_do_request(
                (client, json_headers, "POST"),
                (
                    pid_value,
                    next_pid_type,
                    previous_pid_value,
                    previous_pid_type,
                ),
                payload,
                create_using_pid1=create_using_pid1,
            )
            second_records.append(
                {
                    "pid_value": next_pid_value,
                    "pid_type": next_pid_type,
                    "relation_type": "sequence",
                    "relation_order": "is_continued_by",
                    "record_metadata": {
                        "title": next_rec["title"],
                        "mode_of_issuance": next_rec["mode_of_issuance"],
                    },
                },
            )

            # serid-2
            recrel_assert_record_relations(
                prev_rec,
                expected={
                    "relations": {"sequence": second_records + [serid_1]}
                },
            )

            # serid-3 and serid-4
            recrel_assert_record_relations(
                next_rec,
                expected={
                    "relations": {
                        "sequence": [
                            {
                                "pid_value": previous_pid_value,
                                "pid_type": previous_pid_type,
                                "relation_type": "sequence",
                                "relation_order": "continues",
                                "record_metadata": {
                                    "title": prev_rec["title"],
                                    "mode_of_issuance": prev_rec[
                                        "mode_of_issuance"
                                    ],
                                },
                            }
                        ]
                    }
                },
            )

    _test_create_split_sequence()


def test_sequence_relations(client, json_headers, testdata, users):
    """Test sequence relations."""

    _test_sequence_invalid_relations_should_fail(
        client,
        json_headers,
        [
            {
                "next_pid_value": "serid-1",
                "next_pid_type": "serid",
                "previous_pid_value": "serid-1",
                "previous_pid_type": "serid",
                "relation_type": "sequence",
            }
        ],
        status_code=401,
    )

    user_login(client, "librarian", users)

    # serid-1 -> serid-2 (serid-1 is the previous of serid-2)
    _test_sequence(client, json_headers)

    #                                     serid-4
    # serid-2 (serid-2 is the previous) ->
    #                                     serid-3
    _test_split_sequence(client, json_headers, testdata)

    invalids = [
        {
            "next_pid_value": "serid-1",
            "next_pid_type": "serid",
            "previous_pid_value": "serid-1",
            "previous_pid_type": "serid",
            "relation_type": "sequence",
        },
        {
            "next_pid_value": "serid-1",
            "next_pid_type": "serid",
            "previous_pid_value": "docid-1",
            "previous_pid_type": "docid",
            "relation_type": "sequence",
        },
        # enable this test when the endpoint will be changed to a generic
        # relations endpoint and not for series only
        # {
        #     "next_pid_value": "docid-1",
        #     "next_pid_type": "docid",
        #     "previous_pid_value": "docid-2",
        #     "previous_pid_type": "docid",
        #     "relation_type": "sequence",
        # }
    ]
    _test_sequence_invalid_relations_should_fail(
        client, json_headers, invalids, status_code=400
    )
