# -*- coding: utf-8 -*-
#
# Copyright (C) 2020 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""Test records relations siblings."""

import json

from flask import url_for

from invenio_app_ils.documents.api import Document
from tests.helpers import get_test_record, user_login

from .helpers import (
    recrel_assert_record_relations,
    recrel_choose_endpoints_and_do_request,
)


def _test_sibl_language_relation(client, json_headers):
    """Test creation/deletion siblings language relations."""
    first_pid_value = "docid-1"
    first_pid_type = "docid"
    second_pid_value = "docid-2"
    second_pid_type = "docid"
    third_pid_value = "docid-6"
    third_pid_type = "docid"
    relation_type = "language"

    payload = [
        {
            "pid_value": second_pid_value,
            "pid_type": second_pid_type,
            "relation_type": relation_type,
        },
        {
            "pid_value": third_pid_value,
            "pid_type": third_pid_type,
            "relation_type": relation_type,
        },
    ]

    def _test_create():
        """Test relation creation."""
        rec1, rec2 = recrel_choose_endpoints_and_do_request(
            (client, json_headers, "POST"),
            (
                first_pid_value,
                first_pid_type,
                second_pid_value,
                second_pid_type,
            ),
            payload,
        )
        rec3 = Document.get_record_by_pid(third_pid_value)
        rec3 = rec3.replace_refs()
        recrel_assert_record_relations(
            rec1,
            expected={
                "relations": {
                    "language": [
                        {
                            "pid_value": second_pid_value,
                            "pid_type": second_pid_type,
                            "relation_type": "language",
                            "record_metadata": {
                                "title": rec2["title"],
                                "languages": rec2["languages"],
                                "document_type": rec2["document_type"],
                                "publication_year": rec2["publication_year"],
                            },
                        },
                        {
                            "pid_value": third_pid_value,
                            "pid_type": third_pid_type,
                            "relation_type": "language",
                            "record_metadata": {
                                "title": rec3["title"],
                                "document_type": rec3["document_type"],
                                "languages": rec3["languages"],
                                "publication_year": rec3["publication_year"],
                            },
                        },
                    ]
                }
            },
        )
        recrel_assert_record_relations(
            rec2,
            expected={
                "relations": {
                    "language": [
                        {
                            "pid_value": first_pid_value,
                            "pid_type": first_pid_type,
                            "relation_type": "language",
                            "record_metadata": {
                                "title": rec1["title"],
                                "languages": rec1["languages"],
                                "edition": rec1["edition"],
                                "document_type": rec1["document_type"],
                                "publication_year": rec1["publication_year"],
                            },
                        },
                        {
                            "pid_value": third_pid_value,
                            "pid_type": third_pid_type,
                            "relation_type": "language",
                            "record_metadata": {
                                "title": rec3["title"],
                                "languages": rec3["languages"],
                                "document_type": rec3["document_type"],
                                "publication_year": rec3["publication_year"],
                            },
                        },
                    ]
                }
            },
        )
        recrel_assert_record_relations(
            rec3,
            expected={
                "relations": {
                    "language": [
                        {
                            "pid_value": first_pid_value,
                            "pid_type": first_pid_type,
                            "relation_type": "language",
                            "record_metadata": {
                                "title": rec1["title"],
                                "languages": rec1["languages"],
                                "edition": rec1["edition"],
                                "document_type": rec1["document_type"],
                                "publication_year": rec1["publication_year"],
                            },
                        },
                        {
                            "pid_value": second_pid_value,
                            "pid_type": second_pid_type,
                            "relation_type": "language",
                            "record_metadata": {
                                "title": rec2["title"],
                                "languages": rec2["languages"],
                                "document_type": rec2["document_type"],
                                "publication_year": rec2["publication_year"],
                            },
                        },
                    ]
                }
            },
        )

    def _test_delete():
        """Test relation creation."""
        rec1, rec2 = recrel_choose_endpoints_and_do_request(
            (client, json_headers, "DELETE"),
            (
                first_pid_value,
                first_pid_type,
                second_pid_value,
                second_pid_type,
            ),
            payload,
        )
        rec3 = Document.get_record_by_pid(third_pid_value)
        rec3 = rec3.replace_refs()
        recrel_assert_record_relations(rec1, expected={"relations": {}})
        recrel_assert_record_relations(rec2, expected={"relations": {}})
        recrel_assert_record_relations(rec3, expected={"relations": {}})

    _test_create()
    _test_delete()
    # recreate for the next one, to have some more valuable test data
    _test_create()


def _test_sibl_edition_relation(client, json_headers, testdata):
    """Test creation/deletion siblings edition relations."""
    first_pid_value = "docid-3"
    first_pid_type = "docid"
    second_pid_value = "docid-1"
    second_pid_type = "docid"
    relation_type = "edition"

    payload = {
        "pid_value": second_pid_value,
        "pid_type": second_pid_type,
        "relation_type": relation_type,
    }

    def _test_create():
        """Test relation creation."""
        rec1, rec2 = recrel_choose_endpoints_and_do_request(
            (client, json_headers, "POST"),
            (
                first_pid_value,
                first_pid_type,
                second_pid_value,
                second_pid_type,
            ),
            payload,
        )
        recrel_assert_record_relations(
            rec1,
            expected={
                "relations": {
                    "edition": [
                        {
                            "pid_value": second_pid_value,
                            "pid_type": second_pid_type,
                            "relation_type": "edition",
                            "record_metadata": {
                                "title": rec2["title"],
                                "edition": rec2["edition"],
                                "languages": rec2["languages"],
                                "document_type": rec2["document_type"],
                                "publication_year": rec2["publication_year"],
                            },
                        }
                    ]
                }
            },
        )

        rec_docid_2 = get_test_record(testdata, "documents", "docid-2")
        rec_docid_6 = get_test_record(testdata, "documents", "docid-6")

        recrel_assert_record_relations(
            rec2,
            expected={
                "relations": {
                    "edition": [
                        {
                            "pid_value": first_pid_value,
                            "pid_type": first_pid_type,
                            "relation_type": "edition",
                            "record_metadata": {
                                "title": rec1["title"],
                                "edition": rec1["edition"],
                                "document_type": rec1["document_type"],
                                "publication_year": rec1["publication_year"],
                            },
                        }
                    ],
                    "language": [
                        {
                            "pid_value": rec_docid_2["pid"],
                            "pid_type": "docid",
                            "relation_type": "language",
                            "record_metadata": {
                                "title": rec_docid_2["title"],
                                "languages": rec_docid_2["languages"],
                                "document_type": rec_docid_2["document_type"],
                                "publication_year": rec_docid_2[
                                    "publication_year"
                                ],
                            },
                        },
                        {
                            "pid_value": rec_docid_6["pid"],
                            "pid_type": "docid",
                            "relation_type": "language",
                            "record_metadata": {
                                "title": rec_docid_6["title"],
                                "document_type": rec_docid_6["document_type"],
                                "languages": rec_docid_6["languages"],
                                "publication_year": rec_docid_6[
                                    "publication_year"
                                ],
                            },
                        },
                    ],
                }
            },
        )

    def _test_delete():
        """Test relation creation."""
        rec1, rec2 = recrel_choose_endpoints_and_do_request(
            (client, json_headers, "DELETE"),
            (
                first_pid_value,
                first_pid_type,
                second_pid_value,
                second_pid_type,
            ),
            payload,
        )
        recrel_assert_record_relations(rec1, expected={"relations": {}})

        rec_docid_2 = get_test_record(testdata, "documents", "docid-2")
        rec_docid_6 = get_test_record(testdata, "documents", "docid-6")

        recrel_assert_record_relations(
            rec2,
            expected={
                "relations": {
                    "language": [
                        {
                            "pid_value": rec_docid_2["pid"],
                            "pid_type": "docid",
                            "relation_type": "language",
                            "record_metadata": {
                                "title": rec_docid_2["title"],
                                "languages": rec_docid_2["languages"],
                                "document_type": rec_docid_2["document_type"],
                                "publication_year": rec_docid_2[
                                    "publication_year"
                                ],
                            },
                        },
                        {
                            "pid_value": rec_docid_6["pid"],
                            "pid_type": "docid",
                            "relation_type": "language",
                            "record_metadata": {
                                "title": rec_docid_6["title"],
                                "document_type": rec_docid_6["document_type"],
                                "languages": rec_docid_6["languages"],
                                "publication_year": rec_docid_6[
                                    "publication_year"
                                ],
                            },
                        },
                    ]
                }
            },
        )

    def _test_empty_edition_field():
        edition_first_pid_value = "docid-11"
        edition_first_pid_type = "docid"
        edition_second_pid_value = "docid-12"
        edition_second_pid_type = "docid"

        create_payload = {
            "pid_value": edition_second_pid_value,
            "pid_type": edition_second_pid_type,
            "relation_type": relation_type,
        }

        rec1, rec2 = recrel_choose_endpoints_and_do_request(
            (client, json_headers, "POST"),
            (
                edition_first_pid_value,
                edition_first_pid_type,
                edition_second_pid_value,
                edition_second_pid_type,
            ),
            create_payload,
            expect_status_code=400,
        )

    _test_create()
    _test_delete()
    # recreate for the next one, to have some more valuable test data
    _test_create()
    _test_empty_edition_field()


def _test_sibl_other_relation(client, json_headers, testdata):
    """Test creation/deletion siblings other relations."""
    first_pid_value = "docid-2"
    first_pid_type = "docid"
    second_pid_value = "docid-3"
    second_pid_type = "docid"
    relation_type = "other"

    payload = {
        "pid_value": second_pid_value,
        "pid_type": second_pid_type,
        "relation_type": relation_type,
        "note": "exercise",
    }

    def _test_create():
        """Test relation creation."""
        rec1, rec2 = recrel_choose_endpoints_and_do_request(
            (client, json_headers, "POST"),
            (
                first_pid_value,
                first_pid_type,
                second_pid_value,
                second_pid_type,
            ),
            payload,
        )

        rec_docid_1 = get_test_record(testdata, "documents", "docid-1")
        rec_docid_6 = get_test_record(testdata, "documents", "docid-6")

        recrel_assert_record_relations(
            rec1,
            expected={
                "relations_extra_metadata": {
                    "other": [
                        {
                            "pid_value": second_pid_value,
                            "pid_type": second_pid_type,
                            "note": "exercise",
                        }
                    ]
                },
                "relations": {
                    "language": [
                        {
                            "pid_value": rec_docid_1["pid"],
                            "pid_type": "docid",
                            "relation_type": "language",
                            "record_metadata": {
                                "title": rec_docid_1["title"],
                                "edition": rec_docid_1["edition"],
                                "languages": rec_docid_1["languages"],
                                "document_type": rec_docid_1["document_type"],
                                "publication_year": rec_docid_1[
                                    "publication_year"
                                ],
                            },
                        },
                        {
                            "pid_value": rec_docid_6["pid"],
                            "pid_type": "docid",
                            "relation_type": "language",
                            "record_metadata": {
                                "title": rec_docid_6["title"],
                                "document_type": rec_docid_6["document_type"],
                                "languages": rec_docid_6["languages"],
                                "publication_year": rec_docid_6[
                                    "publication_year"
                                ],
                            },
                        },
                    ],
                    "other": [
                        {
                            "pid_value": second_pid_value,
                            "pid_type": second_pid_type,
                            "note": "exercise",
                            "relation_type": "other",
                            "record_metadata": {
                                "title": rec2["title"],
                                "edition": rec2["edition"],
                                "document_type": rec2["document_type"],
                                "publication_year": rec2["publication_year"],
                            },
                        }
                    ],
                },
            },
        )
        recrel_assert_record_relations(
            rec2,
            expected={
                "relations": {
                    "edition": [
                        {
                            "pid_value": rec_docid_1["pid"],
                            "pid_type": "docid",
                            "relation_type": "edition",
                            "record_metadata": {
                                "title": rec_docid_1["title"],
                                "edition": rec_docid_1["edition"],
                                "languages": rec_docid_1["languages"],
                                "document_type": rec_docid_1["document_type"],
                                "publication_year": rec_docid_1[
                                    "publication_year"
                                ],
                            },
                        }
                    ],
                    "other": [
                        {
                            "pid_value": first_pid_value,
                            "pid_type": first_pid_type,
                            "note": "exercise",
                            "relation_type": "other",
                            "record_metadata": {
                                "title": rec1["title"],
                                "languages": rec1["languages"],
                                "document_type": rec1["document_type"],
                                "publication_year": rec1["publication_year"],
                            },
                        }
                    ],
                }
            },
        )

    def _test_delete():
        """Test relation creation."""
        rec1, rec2 = recrel_choose_endpoints_and_do_request(
            (client, json_headers, "DELETE"),
            (
                first_pid_value,
                first_pid_type,
                second_pid_value,
                second_pid_type,
            ),
            payload,
        )

        rec_docid_1 = get_test_record(testdata, "documents", "docid-1")
        rec_docid_6 = get_test_record(testdata, "documents", "docid-6")

        recrel_assert_record_relations(
            rec1,
            expected={
                "relations": {
                    "language": [
                        {
                            "pid_value": rec_docid_1["pid"],
                            "pid_type": "docid",
                            "relation_type": "language",
                            "record_metadata": {
                                "title": rec_docid_1["title"],
                                "edition": rec_docid_1["edition"],
                                "languages": rec_docid_1["languages"],
                                "document_type": rec_docid_1["document_type"],
                                "publication_year": rec_docid_1[
                                    "publication_year"
                                ],
                            },
                        },
                        {
                            "pid_value": rec_docid_6["pid"],
                            "pid_type": "docid",
                            "relation_type": "language",
                            "record_metadata": {
                                "title": rec_docid_6["title"],
                                "document_type": rec_docid_6["document_type"],
                                "languages": rec_docid_6["languages"],
                                "publication_year": rec_docid_6[
                                    "publication_year"
                                ],
                            },
                        },
                    ]
                }
            },
        )
        recrel_assert_record_relations(
            rec2,
            expected={
                "relations": {
                    "edition": [
                        {
                            "pid_value": rec_docid_1["pid"],
                            "pid_type": "docid",
                            "relation_type": "edition",
                            "record_metadata": {
                                "title": rec_docid_1["title"],
                                "edition": rec_docid_1["edition"],
                                "languages": rec_docid_1["languages"],
                                "document_type": rec_docid_1["document_type"],
                                "publication_year": rec_docid_1[
                                    "publication_year"
                                ],
                            },
                        }
                    ]
                }
            },
        )

    _test_create()
    _test_delete()
    # recreate for the next one, to have some more valuable test data
    _test_create()


def _test_sibl_invalid_relations_should_fail(
    client, json_headers, invalids, status_code=400
):
    """Test relation creation with invalid siblings should fail."""
    api_endpoint_documents = "invenio_app_ils_relations.docid_relations"
    api_endpoint_series = "invenio_app_ils_relations.serid_relations"

    for invalid in invalids:
        first_pid_value = invalid["first_pid_value"]
        first_pid_type = invalid["first_pid_type"]
        second_pid_value = invalid["second_pid_value"]
        second_pid_type = invalid["second_pid_type"]
        relation_type = invalid["relation_type"]

        api_endpoint = (
            api_endpoint_documents
            if first_pid_type == "docid"
            else api_endpoint_series
        )

        url = url_for(api_endpoint, pid_value=first_pid_value)
        payload = {
            "pid_value": second_pid_value,
            "pid_type": second_pid_type,
            "relation_type": relation_type,
        }

        res = client.post(url, headers=json_headers, data=json.dumps(payload))
        assert res.status_code == status_code
        if status_code == 400:
            error = json.loads(res.data.decode("utf-8"))
            assert "message" in error
            assert first_pid_value in error["message"]
            assert second_pid_value in error["message"]


def test_siblings_relations(client, json_headers, testdata, users):
    """Test siblings relations."""

    # only one test method to speed up tests and avoid testdata recreation at
    # each test. As drawback, testdata is not cleaned between each test, so
    # do not change the order of execution of the following tests :)

    _test_sibl_invalid_relations_should_fail(
        client,
        json_headers,
        [
            {
                "first_pid_value": "docid-1",
                "first_pid_type": "docid",
                "second_pid_value": "docid-2",
                "second_pid_type": "docid",
                "relation_type": "language",
            }
        ],
        status_code=401,
    )

    user_login(client, "librarian", users)

    # docid-1 --language--> docid-2 and docid-6
    _test_sibl_language_relation(client, json_headers)

    # docid-3 --edition--> docid-1
    _test_sibl_edition_relation(client, json_headers, testdata)

    # docid-2 --other--> docid-3
    _test_sibl_other_relation(client, json_headers, testdata)

    # test wrong relations
    invalids = [
        # different pid type
        {
            "first_pid_value": "docid-1",
            "first_pid_type": "docid",
            "second_pid_value": "serid-1",
            "second_pid_type": "serid",
            "relation_type": "language",
        },
        # invalid edition: document with serial
        {
            "first_pid_value": "serid-3",
            "first_pid_type": "serid",
            "second_pid_value": "docid-5",
            "second_pid_type": "docid",
            "relation_type": "edition",
        },
        # different pid type
        {
            "first_pid_value": "serid-1",
            "first_pid_type": "serid",
            "second_pid_value": "docid-1",
            "second_pid_type": "docid",
            "relation_type": "other",
        },
        # same record
        {
            "first_pid_value": "docid-6",
            "first_pid_type": "docid",
            "second_pid_value": "docid-6",
            "second_pid_type": "docid",
            "relation_type": "language",
        },
    ]
    _test_sibl_invalid_relations_should_fail(client, json_headers, invalids)
