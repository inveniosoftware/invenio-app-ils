# -*- coding: utf-8 -*-
#
# Copyright (C) 2019 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""Test records relations."""

from __future__ import unicode_literals

import json

from flask import url_for
from invenio_accounts.models import User
from invenio_accounts.testutils import login_user_via_session

from invenio_app_ils.documents.api import Document

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


def _fetch_record(client, json_headers, url):
    """Fetch a record."""
    res = client.get(url_for(url[0], pid_value=url[1]), headers=json_headers)
    assert res.status_code == 200
    return json.loads(res.data.decode("utf-8"))["metadata"]


def _assert_record_relations(record, expected):
    """Test `relations_metadata` and `relations` field on parent record."""
    relations_metadata = record.get("relations_metadata", {})
    expected_metadata = expected.get("relations_metadata", {})

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


def _do_request_for_valid_relation(
    client, json_headers, payload, url, method="POST"
):
    """Create a new valid relation."""
    func = client.delete if method == "DELETE" else client.post
    res = func(
        url_for(url[0], pid_value=url[1]),
        headers=json_headers,
        data=json.dumps(payload),
    )
    expected_status_code = 200 if method == "DELETE" else 201
    assert res.status_code == expected_status_code
    return json.loads(res.data.decode("utf-8"))["metadata"]


def _choose_endpoints_and_do_request(
    client_params, relation, payload, create_using_pid1=True
):
    """Choose which endpoint to use, create relation, return records."""
    client, json_headers, method = client_params
    pid1, pid1_type, pid2, pid2_type = relation

    if create_using_pid1:
        url_create_rel = (TYPES_ENDPOINTS["relation"][pid1_type], pid1)
        url_other = (TYPES_ENDPOINTS["get"][pid2_type], pid2)

        record1 = _do_request_for_valid_relation(
            client, json_headers, payload, url_create_rel, method=method
        )
        record2 = _fetch_record(client, json_headers, url_other)
    else:
        url_create_rel = (TYPES_ENDPOINTS["relation"][pid2_type], pid2)
        url_other = (TYPES_ENDPOINTS["get"][pid1_type], pid1)

        record2 = _do_request_for_valid_relation(
            client, json_headers, payload, url_create_rel, method=method
        )
        record1 = _fetch_record(client, json_headers, url_other)

    return record1, record2


def _test_pc_mm_document(client, json_headers):
    """Test create and delete relations MM->Document."""

    parent_pid = "serid-1"
    parent_pid_type = "serid"
    child_pid = "docid-1"
    child_pid_type = "docid"
    relation_type = "multipart_monograph"

    payload = {
        "parent_pid": parent_pid,
        "parent_pid_type": parent_pid_type,
        "child_pid": child_pid,
        "child_pid_type": child_pid_type,
        "relation_type": relation_type,
    }

    def _test_create_mm_document(create_using_pid1=True):
        """Test relation creation of Multipart Monograph and Document."""

        parent, child = _choose_endpoints_and_do_request(
            (client, json_headers, "POST"),
            (parent_pid, parent_pid_type, child_pid, child_pid_type),
            payload,
            create_using_pid1=create_using_pid1,
        )

        _assert_record_relations(
            parent,
            expected={
                "relations": {},
            },
        )

        _assert_record_relations(
            child,
            expected={
                "relations": {
                    "multipart_monograph": [
                        {
                            "pid": parent_pid,
                            "pid_type": parent_pid_type,
                            "title": parent["title"],
                            "relation_type": "multipart_monograph",
                        }
                    ]
                }
            },
        )

    def _test_delete_mm_document(create_using_pid1=True):
        """Test relation deletion of Multipart Monograph and Document."""

        parent, child = _choose_endpoints_and_do_request(
            (client, json_headers, "DELETE"),
            (parent_pid, parent_pid_type, child_pid, child_pid_type),
            payload,
            create_using_pid1=create_using_pid1,
        )

        _assert_record_relations(parent, expected={"relations": {}})
        _assert_record_relations(child, expected={"relations": {}})

    _test_create_mm_document()
    _test_delete_mm_document()
    _test_create_mm_document(create_using_pid1=False)
    _test_delete_mm_document(create_using_pid1=False)
    # recreate for the next one, to have some more valuable test data
    _test_create_mm_document()


def _test_pc_mm_document_with_volume(client, json_headers):
    """Test create and delete relations MM->Document with volume."""

    parent_pid = "serid-1"
    parent_pid_type = "serid"
    child_pid = "docid-2"
    child_pid_type = "docid"
    relation_type = "multipart_monograph"

    payload = {
        "parent_pid": parent_pid,
        "parent_pid_type": parent_pid_type,
        "child_pid": child_pid,
        "child_pid_type": child_pid_type,
        "relation_type": relation_type,
        "volume": "v.3",
    }

    def _test_create_mm_document_with_volume(create_using_pid1=True):
        """Test relation creation with volume of MM and Document."""

        parent, child = _choose_endpoints_and_do_request(
            (client, json_headers, "POST"),
            (parent_pid, parent_pid_type, child_pid, child_pid_type),
            payload,
            create_using_pid1=create_using_pid1,
        )

        _assert_record_relations(
            parent,
            expected={
                "relations_metadata": {
                    "multipart_monograph": [
                        {
                            "pid": child_pid,
                            "pid_type": child_pid_type,
                            "volume": "v.3",

                        }
                    ]
                },
                "relations": {},
            },
        )

        _assert_record_relations(
            child,
            expected={
                "relations": {
                    "multipart_monograph": [
                        {
                            "pid": parent_pid,
                            "pid_type": parent_pid_type,
                            "title": parent["title"],
                            "volume": "v.3",
                            "relation_type": "multipart_monograph",
                        }
                    ]
                }
            },
        )

    def _test_delete_mm_document_with_volume(create_using_pid1=True):
        """Test relation deletion with volume of MM and Document."""

        parent, child = _choose_endpoints_and_do_request(
            (client, json_headers, "DELETE"),
            (parent_pid, parent_pid_type, child_pid, child_pid_type),
            payload,
            create_using_pid1=create_using_pid1,
        )

        _assert_record_relations(
            parent,
            expected={
                "relations": {}
            },
        )
        _assert_record_relations(child, expected={"relations": {}})

    _test_create_mm_document_with_volume()
    _test_delete_mm_document_with_volume()
    _test_create_mm_document_with_volume(create_using_pid1=False)
    _test_delete_mm_document_with_volume(create_using_pid1=False)
    # recreate for the next one, to have some more valuable test data
    _test_create_mm_document_with_volume()


def _test_pc_serial_to_mm(client, json_headers):
    """Test relation create/delete of Serial and Multipart Monograph."""
    parent_pid = "serid-3"
    parent_pid_type = "serid"
    child_pid = "serid-1"
    child_pid_type = "serid"
    relation_type = "serial"

    payload = {
        "parent_pid": parent_pid,
        "parent_pid_type": parent_pid_type,
        "child_pid": child_pid,
        "child_pid_type": child_pid_type,
        "relation_type": relation_type,
        "volume": "vol. 1",
    }

    def _test_create_serial_to_mm(create_using_pid1=True):
        """Test relation create of Serial and Multipart Monograph."""

        parent, child = _choose_endpoints_and_do_request(
            (client, json_headers, "POST"),
            (parent_pid, parent_pid_type, child_pid, child_pid_type),
            payload,
            create_using_pid1=create_using_pid1,
        )

        _assert_record_relations(
            parent,
            expected={
                "relations_metadata": {
                    "serial": [
                        {
                            "pid": child_pid,
                            "pid_type": child_pid_type,
                            "volume": "vol. 1",
                        }
                    ]
                },
                "relations": {}
            },
        )

        _assert_record_relations(
            child,
            expected={
                "relations_metadata": {
                    "multipart_monograph": [
                        {
                            "pid": "docid-2",
                            "pid_type": "docid",
                            "volume": "v.3",

                        }
                    ]
                },
                "relations": {
                    "serial": [
                        {
                            "pid": parent_pid,
                            "pid_type": parent_pid_type,
                            "title": "Springer tracts in modern physics",
                            "volume": "vol. 1",
                            "relation_type": "serial",
                        }
                    ],
                },
            },
        )

    def _test_delete_serial_to_mm(create_using_pid1=True):
        """Test relation delete of Serial and Multipart Monograph."""

        parent, child = _choose_endpoints_and_do_request(
            (client, json_headers, "DELETE"),
            (parent_pid, parent_pid_type, child_pid, child_pid_type),
            payload,
            create_using_pid1=create_using_pid1,
        )

        _assert_record_relations(parent, expected={"relations": {}})
        _assert_record_relations(
            child,
            expected={
                "relations_metadata": {
                    "multipart_monograph": [
                        {
                            "pid": "docid-2",
                            "pid_type": "docid",
                            "volume": "v.3",

                        },
                    ]
                },
                "relations": {},
            },
        )

    _test_create_serial_to_mm()
    _test_delete_serial_to_mm()
    _test_create_serial_to_mm(create_using_pid1=False)
    _test_delete_serial_to_mm(create_using_pid1=False)
    # recreate for the next one, to have some more valuable test data
    _test_create_serial_to_mm()


def _test_pc_serial_to_document(client, json_headers):
    """Test relation create/delete of Serial to Document."""
    parent_pid = "serid-3"
    parent_pid_type = "serid"
    child_pid = "docid-3"
    child_pid_type = "docid"
    relation_type = "serial"

    payload = {
        "parent_pid": parent_pid,
        "parent_pid_type": parent_pid_type,
        "child_pid": child_pid,
        "child_pid_type": child_pid_type,
        "relation_type": relation_type,
        "volume": "vol. 1",
    }

    def _test_create_serial_to_document(create_using_pid1=True):
        """Test relation create of Serial to Document."""

        parent, child = _choose_endpoints_and_do_request(
            (client, json_headers, "POST"),
            (parent_pid, parent_pid_type, child_pid, child_pid_type),
            payload,
            create_using_pid1=create_using_pid1,
        )

        _assert_record_relations(
            parent,
            expected={
                "relations_metadata": {
                    "serial": [
                        {
                            "pid": "serid-1",
                            "pid_type": "serid",
                            "volume": "vol. 1",
                        },
                        {
                            "pid": child_pid,
                            "pid_type": child_pid_type,
                            "volume": "vol. 1",
                        },
                    ]
                },
                "relations": {}
            },
        )

        _assert_record_relations(
            child,
            expected={
                "relations": {
                    "serial": [
                        {
                            "pid": parent_pid,
                            "pid_type": parent_pid_type,
                            "title": "Springer tracts in modern physics",
                            "volume": "vol. 1",
                            "relation_type": "serial",
                        }
                    ]
                }
            },
        )

    def _test_delete_serial_to_document(create_using_pid1=True):
        """Test relation delete of Serial to Document."""

        parent, child = _choose_endpoints_and_do_request(
            (client, json_headers, "DELETE"),
            (parent_pid, parent_pid_type, child_pid, child_pid_type),
            payload,
            create_using_pid1=create_using_pid1,
        )

        _assert_record_relations(
            parent,
            expected={
                "relations_metadata": {
                    "serial": [
                        {
                            "pid": "serid-1",
                            "pid_type": "serid",
                            "volume": "vol. 1",
                        }
                    ]
                },
                "relations": {}
            },
        )
        _assert_record_relations(child, expected={"relations": {}})

    _test_create_serial_to_document()
    _test_delete_serial_to_document()
    _test_create_serial_to_document(create_using_pid1=False)
    _test_delete_serial_to_document(create_using_pid1=False)
    # recreate for the next one, to have some more valuable test data
    _test_create_serial_to_document()


def _test_pc_invalid_relations_should_fail(client, json_headers, invalids,
                                           status_code=400):
    """Test relation creation with invalid parent-child should fail."""
    api_endpoint_documents = "invenio_app_ils_relations.docid_relations"
    api_endpoint_series = "invenio_app_ils_relations.serid_relations"

    for invalid in invalids:
        parent_pid = invalid["parent_pid"]
        parent_pid_type = invalid["parent_pid_type"]
        child_pid = invalid["child_pid"]
        child_pid_type = invalid["child_pid_type"]
        relation_type = invalid["relation_type"]

        api_endpoint = (
            api_endpoint_documents
            if parent_pid_type == "docid"
            else api_endpoint_series
        )

        url = url_for(api_endpoint, pid_value=parent_pid)
        payload = {
            "parent_pid": parent_pid,
            "parent_pid_type": parent_pid_type,
            "child_pid": child_pid,
            "child_pid_type": child_pid_type,
            "relation_type": relation_type,
        }

        res = client.post(url, headers=json_headers, data=json.dumps(payload))
        assert res.status_code == status_code
        if status_code == 400:
            error = json.loads(res.data.decode("utf-8"))
            assert "message" in error
            assert parent_pid in error["message"]
            assert child_pid in error["message"]


def test_parent_child_relations(client, json_headers, testdata, users):
    """Test parent child relations."""

    _test_pc_invalid_relations_should_fail(client, json_headers, [
        {
            "parent_pid": "serid-3",
            "parent_pid_type": "serid",
            "child_pid": "docid-1",
            "child_pid_type": "docid",
            "relation_type": "serial",
        }
    ], status_code=401)

    user = users['librarian']
    login_user_via_session(client, user=User.query.get(user.id))

    # only one test method to speed up tests and avoid testdata recreation at
    # each test. As drawback, testdata is not cleaned between each test, so
    # do not change the order of execution of the following tests :)

    # serid-1 [MM] -> docid-1
    _test_pc_mm_document(client, json_headers)

    #      serid-1 [MM]
    #          |
    #        docid-1

    # serid-1 [MM] --- v.3 ---> docid-2
    _test_pc_mm_document_with_volume(client, json_headers)

    #         serid-1 [MM]
    #             |
    #            / \ v.3
    #     docid-1   docid-2

    # serid-3 [SERIAL] -> serid-1 [MM]
    _test_pc_serial_to_mm(client, json_headers)

    #        serid-3 [SERIAL]
    #             |
    #         serid-1 [MM]
    #              |
    #             / \ v.3
    #      docid-1   docid-2

    # serid-3 [SERIAL] -> docid-3
    _test_pc_serial_to_document(client, json_headers)

    #           serid-3 [SERIAL]
    #                  |
    #                 / \
    #          docid-3   serid-1 [MM]
    #                         |
    #                        / \ v.3
    #                 docid-1   docid-2

    # test wrong relations
    invalids = [
        {
            "parent_pid": "docid-1",
            "parent_pid_type": "docid",
            "child_pid": "serid-1",  # Multipart Monograph
            "child_pid_type": "serid",
            "relation_type": "multipart_monograph",
        },
        {
            "parent_pid": "docid-1",
            "parent_pid_type": "docid",
            "child_pid": "serid-3",  # Serial
            "child_pid_type": "serid",
            "relation_type": "serial",
        },
        {
            "parent_pid": "serid-1",  # Multipart Monograph
            "parent_pid_type": "serid",
            "child_pid": "serid-3",  # Serial
            "child_pid_type": "serid",
            "relation_type": "multipart_monograph",
        },
        {
            "parent_pid": "docid-1",
            "parent_pid_type": "docid",
            "child_pid": "docid-2",
            "child_pid_type": "docid",
            "relation_type": "serial",
        },
        # already existing
        {
            "parent_pid": "serid-3",  # Serial
            "parent_pid_type": "serid",
            "child_pid": "docid-3",
            "child_pid_type": "docid",
            "relation_type": "serial",
        },
    ]
    _test_pc_invalid_relations_should_fail(client, json_headers, invalids)


def _test_sibl_language_relation(client, json_headers):
    """Test creation/deletion siblings language relations."""
    first_pid = "docid-1"
    first_pid_type = "docid"
    second_pid = "docid-2"
    second_pid_type = "docid"
    third_pid = "docid-6"
    third_pid_type = "docid"
    relation_type = "language"

    payload = [
        {
            "pid": second_pid,
            "pid_type": second_pid_type,
            "relation_type": relation_type,
        },
        {
            "pid": third_pid,
            "pid_type": third_pid_type,
            "relation_type": relation_type,
        }
    ]

    def _test_create():
        """Test relation creation."""
        rec1, rec2 = _choose_endpoints_and_do_request(
            (client, json_headers, "POST"),
            (first_pid, first_pid_type, second_pid, second_pid_type),
            payload,
        )
        rec3 = Document.get_record_by_pid(third_pid)
        rec3 = rec3.replace_refs()
        _assert_record_relations(
            rec1,
            expected={
                "relations": {
                    "language": [
                        {
                            "pid": second_pid,
                            "pid_type": second_pid_type,
                            "title": rec2["title"],
                            "languages": rec2["languages"],
                            "relation_type": "language",
                        },
                        {
                            "pid": third_pid,
                            "pid_type": third_pid_type,
                            "title": rec3["title"],
                            "relation_type": "language",
                        },
                    ]
                }
            },
        )
        _assert_record_relations(
            rec2,
            expected={
                "relations": {
                    "language": [
                        {
                            "pid": first_pid,
                            "pid_type": first_pid_type,
                            "title": rec1["title"],
                            "languages": rec1["languages"],
                            "edition": rec1["edition"],
                            "relation_type": "language",
                        },
                        {
                            "pid": third_pid,
                            "pid_type": third_pid_type,
                            "title": rec3["title"],
                            "relation_type": "language",
                        },
                    ]
                }
            },
        )
        _assert_record_relations(
            rec3,
            expected={
                "relations": {
                    "language": [
                        {
                            "pid": first_pid,
                            "pid_type": first_pid_type,
                            "title": rec1["title"],
                            "languages": rec1["languages"],
                            "edition": rec1["edition"],
                            "relation_type": "language",
                        },
                        {
                            "pid": second_pid,
                            "pid_type": second_pid_type,
                            "title": rec2["title"],
                            "languages": rec2["languages"],
                            "relation_type": "language",
                        },
                    ]
                }
            },
        )

    def _test_delete():
        """Test relation creation."""
        rec1, rec2 = _choose_endpoints_and_do_request(
            (client, json_headers, "DELETE"),
            (first_pid, first_pid_type, second_pid, second_pid_type),
            payload,
        )
        rec3 = Document.get_record_by_pid(third_pid)
        rec3 = rec3.replace_refs()
        _assert_record_relations(rec1, expected={"relations": {}})
        _assert_record_relations(rec2, expected={"relations": {}})
        _assert_record_relations(rec3, expected={"relations": {}})

    _test_create()
    _test_delete()
    # recreate for the next one, to have some more valuable test data
    _test_create()


def _test_sibl_edition_relation(client, json_headers):
    """Test creation/deletion siblings edition relations."""
    first_pid = "docid-3"
    first_pid_type = "docid"
    second_pid = "docid-1"
    second_pid_type = "docid"
    relation_type = "edition"

    payload = {
        "pid": second_pid,
        "pid_type": second_pid_type,
        "relation_type": relation_type,
    }

    def _test_create():
        """Test relation creation."""
        rec1, rec2 = _choose_endpoints_and_do_request(
            (client, json_headers, "POST"),
            (first_pid, first_pid_type, second_pid, second_pid_type),
            payload,
        )
        _assert_record_relations(
            rec1,
            expected={
                "relations": {
                    "edition": [
                        {
                            "pid": second_pid,
                            "pid_type": second_pid_type,
                            "title": rec2["title"],
                            "edition": rec2["edition"],
                            "languages": rec2["languages"],
                            "relation_type": "edition",
                        }
                    ]
                }
            },
        )
        _assert_record_relations(
            rec2,
            expected={
                "relations": {
                    "edition": [
                        {
                            "pid": first_pid,
                            "pid_type": first_pid_type,
                            "title": "Half-light: Collected Poems 1965-2016",
                            "edition": "ed. 3",
                            "relation_type": "edition",
                        }
                    ],
                    "language": [
                        {
                            "pid": "docid-2",
                            "pid_type": "docid",
                            "title": "Prairie Fires: The American Dreams of "
                                     "Laura Ingalls Wilder",
                            "languages": ["it"],
                            "relation_type": "language",
                        },
                        {
                            "pid": "docid-6",
                            "pid_type": "docid",
                            "title": "Less: A Novel",
                            "relation_type": "language",
                        }
                    ],
                }
            },
        )

    def _test_delete():
        """Test relation creation."""
        rec1, rec2 = _choose_endpoints_and_do_request(
            (client, json_headers, "DELETE"),
            (first_pid, first_pid_type, second_pid, second_pid_type),
            payload,
        )
        _assert_record_relations(rec1, expected={"relations": {}})
        _assert_record_relations(
            rec2,
            expected={
                "relations": {
                    "language": [
                        {
                            "pid": "docid-2",
                            "pid_type": "docid",
                            "title": "Prairie Fires: The American Dreams of "
                                     "Laura Ingalls Wilder",
                            "languages": ["it"],
                            "relation_type": "language",
                        },
                        {
                            "pid": "docid-6",
                            "pid_type": "docid",
                            "title": "Less: A Novel",
                            "relation_type": "language",
                        }
                    ]
                }
            },
        )

    _test_create()
    # _test_delete()
    # recreate for the next one, to have some more valuable test data
    # _test_create()


def _test_sibl_other_relation(client, json_headers):
    """Test creation/deletion siblings other relations."""
    first_pid = "docid-2"
    first_pid_type = "docid"
    second_pid = "docid-3"
    second_pid_type = "docid"
    relation_type = "other"

    payload = {
        "pid": second_pid,
        "pid_type": second_pid_type,
        "relation_type": relation_type,
        "note": "exercise",
    }

    def _test_create():
        """Test relation creation."""
        rec1, rec2 = _choose_endpoints_and_do_request(
            (client, json_headers, "POST"),
            (first_pid, first_pid_type, second_pid, second_pid_type),
            payload,
        )
        _assert_record_relations(
            rec1,
            expected={
                "relations_metadata": {
                    "other": [
                        {
                            "pid": second_pid,
                            "pid_type": second_pid_type,
                            "note": "exercise",
                        }
                    ]
                },
                "relations": {
                    "language": [
                        {
                            "pid": "docid-1",
                            "pid_type": "docid",
                            "title": "The Gulf: The Making of An American Sea",
                            "languages": ["en"],
                            "edition": "ed. 1",
                            "relation_type": "language",
                        },
                        {
                            "pid": "docid-6",
                            "pid_type": "docid",
                            "title": "Less: A Novel",
                            "relation_type": "language",
                        }
                    ],
                    "other": [
                        {
                            "pid": second_pid,
                            "pid_type": second_pid_type,
                            "title": "Half-light: Collected Poems 1965-2016",
                            "edition": "ed. 3",
                            "note": "exercise",
                            "relation_type": "other",
                        }
                    ],
                },
            },
        )
        _assert_record_relations(
            rec2,
            expected={
                "relations": {
                    "edition": [
                        {
                            "pid": "docid-1",
                            "pid_type": "docid",
                            "title": "The Gulf: The Making of An American Sea",
                            "languages": ["en"],
                            "edition": "ed. 1",
                            "relation_type": "edition",
                        }
                    ],
                    "other": [
                        {
                            "pid": first_pid,
                            "pid_type": first_pid_type,
                            "title": rec1["title"],
                            "languages": rec1["languages"],
                            "relation_type": "other",
                        }
                    ],
                }
            },
        )

    def _test_delete():
        """Test relation creation."""
        rec1, rec2 = _choose_endpoints_and_do_request(
            (client, json_headers, "DELETE"),
            (first_pid, first_pid_type, second_pid, second_pid_type),
            payload,
        )
        _assert_record_relations(
            rec1,
            expected={
                "relations": {
                    "language": [
                        {
                            "pid": "docid-1",
                            "pid_type": "docid",
                            "title": "The Gulf: The Making of An American Sea",
                            "languages": ["en"],
                            "edition": "ed. 1",
                            "relation_type": "language",
                        },
                        {
                            "pid": "docid-6",
                            "pid_type": "docid",
                            "title": "Less: A Novel",
                            "relation_type": "language",
                        }
                    ]
                }
            },
        )
        _assert_record_relations(
            rec2,
            expected={
                "relations": {
                    "edition": [
                        {
                            "pid": "docid-1",
                            "pid_type": "docid",
                            "title": "The Gulf: The Making of An American Sea",
                            "language": ["en"],
                            "edition": "ed. 1",
                            "relation_type": "edition",
                        }
                    ]
                }
            },
        )

    _test_create()
    _test_delete()
    # recreate for the next one, to have some more valuable test data
    _test_create()


def _test_sibl_invalid_relations_should_fail(client, json_headers, invalids,
                                             status_code=400):
    """Test relation creation with invalid siblings should fail."""
    api_endpoint_documents = "invenio_app_ils_relations.docid_relations"
    api_endpoint_series = "invenio_app_ils_relations.serid_relations"

    for invalid in invalids:
        first_pid = invalid["first_pid"]
        first_pid_type = invalid["first_pid_type"]
        second_pid = invalid["second_pid"]
        second_pid_type = invalid["second_pid_type"]
        relation_type = invalid["relation_type"]

        api_endpoint = (
            api_endpoint_documents
            if first_pid_type == "docid"
            else api_endpoint_series
        )

        url = url_for(api_endpoint, pid_value=first_pid)
        payload = {
            "pid": second_pid,
            "pid_type": second_pid_type,
            "relation_type": relation_type,
        }

        res = client.post(url, headers=json_headers, data=json.dumps(payload))
        assert res.status_code == status_code
        if status_code == 400:
            error = json.loads(res.data.decode("utf-8"))
            assert "message" in error
            assert first_pid in error["message"]
            assert second_pid in error["message"]


def test_siblings_relations(client, json_headers, testdata, users):
    """Test siblings relations."""

    # only one test method to speed up tests and avoid testdata recreation at
    # each test. As drawback, testdata is not cleaned between each test, so
    # do not change the order of execution of the following tests :)

    _test_sibl_invalid_relations_should_fail(client, json_headers, [
        {
            "first_pid": "docid-1",
            "first_pid_type": "docid",
            "second_pid": "docid-2",
            "second_pid_type": "docid",
            "relation_type": "language",
        }
    ], status_code=401)

    user = users['librarian']
    login_user_via_session(client, user=User.query.get(user.id))

    # docid-1 --language--> docid-2
    _test_sibl_language_relation(client, json_headers)

    # docid-3 --edition--> docid-1
    # _test_sibl_edition_relation(client, json_headers)

    # docid-2 --other--> docid-3
    # _test_sibl_other_relation(client, json_headers)

    # test wrong relations
    invalids = [
        # different pid type
        {
            "first_pid": "docid-1",
            "first_pid_type": "docid",
            "second_pid": "serid-1",
            "second_pid_type": "serid",
            "relation_type": "language",
        },
        # invalid edition: document with serial
        {
            "first_pid": "serid-3",
            "first_pid_type": "serid",
            "second_pid": "docid-5",
            "second_pid_type": "docid",
            "relation_type": "edition",
        },
        # different pid type
        {
            "first_pid": "serid-1",
            "first_pid_type": "serid",
            "second_pid": "docid-1",
            "second_pid_type": "docid",
            "relation_type": "other",
        },
        # same record
        {
            "first_pid": "docid-6",
            "first_pid_type": "docid",
            "second_pid": "docid-6",
            "second_pid_type": "docid",
            "relation_type": "language",
        }
    ]
    _test_sibl_invalid_relations_should_fail(client, json_headers, invalids)
