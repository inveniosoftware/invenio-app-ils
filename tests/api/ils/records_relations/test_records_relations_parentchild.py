# -*- coding: utf-8 -*-
#
# Copyright (C) 2020 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""Test records relations parent child."""

import json

import pytest
from flask import url_for

from invenio_app_ils.errors import RecordRelationsError
from invenio_app_ils.records_relations.api import RecordRelationsParentChild
from invenio_app_ils.relations.api import Relation
from tests.helpers import user_login

from .helpers import (
    recrel_assert_record_relations,
    recrel_choose_endpoints_and_do_request,
)


def _test_pc_mm_document(client, json_headers):
    """Test create and delete relations MM->Document."""

    parent_pid_value = "serid-1"
    parent_pid_type = "serid"
    child_pid_value = "docid-1"
    child_pid_type = "docid"
    relation_type = "multipart_monograph"

    payload = {
        "parent_pid_value": parent_pid_value,
        "parent_pid_type": parent_pid_type,
        "child_pid_value": child_pid_value,
        "child_pid_type": child_pid_type,
        "relation_type": relation_type,
    }

    def _test_create_mm_document(create_using_pid1=True):
        """Test relation creation of Multipart Monograph and Document."""

        parent, child = recrel_choose_endpoints_and_do_request(
            (client, json_headers, "POST"),
            (
                parent_pid_value,
                parent_pid_type,
                child_pid_value,
                child_pid_type,
            ),
            payload,
            create_using_pid1=create_using_pid1,
        )

        recrel_assert_record_relations(parent, expected={"relations": {}})

        recrel_assert_record_relations(
            child,
            expected={
                "relations": {
                    "multipart_monograph": [
                        {
                            "pid_value": parent_pid_value,
                            "pid_type": parent_pid_type,
                            "relation_type": "multipart_monograph",
                            "record_metadata": {
                                "title": parent["title"],
                                "mode_of_issuance": parent["mode_of_issuance"],
                            },
                        }
                    ]
                }
            },
        )

    def _test_delete_mm_document(create_using_pid1=True):
        """Test relation deletion of Multipart Monograph and Document."""

        parent, child = recrel_choose_endpoints_and_do_request(
            (client, json_headers, "DELETE"),
            (
                parent_pid_value,
                parent_pid_type,
                child_pid_value,
                child_pid_type,
            ),
            payload,
            create_using_pid1=create_using_pid1,
        )

        recrel_assert_record_relations(parent, expected={"relations": {}})
        recrel_assert_record_relations(child, expected={"relations": {}})

    _test_create_mm_document()
    _test_delete_mm_document()
    _test_create_mm_document(create_using_pid1=False)
    _test_delete_mm_document(create_using_pid1=False)
    # recreate for the next one, to have some more valuable test data
    _test_create_mm_document()


def _test_pc_mm_document_with_volume(client, json_headers):
    """Test create and delete relations MM->Document with volume."""

    parent_pid_value = "serid-1"
    parent_pid_type = "serid"
    child_pid_value = "docid-2"
    child_pid_type = "docid"
    relation_type = "multipart_monograph"

    payload = {
        "parent_pid_value": parent_pid_value,
        "parent_pid_type": parent_pid_type,
        "child_pid_value": child_pid_value,
        "child_pid_type": child_pid_type,
        "relation_type": relation_type,
        "volume": "v.3",
    }

    def _test_create_mm_document_with_volume(create_using_pid1=True):
        """Test relation creation with volume of MM and Document."""

        parent, child = recrel_choose_endpoints_and_do_request(
            (client, json_headers, "POST"),
            (
                parent_pid_value,
                parent_pid_type,
                child_pid_value,
                child_pid_type,
            ),
            payload,
            create_using_pid1=create_using_pid1,
        )

        recrel_assert_record_relations(
            parent,
            expected={
                "relations": {},
            },
        )

        recrel_assert_record_relations(
            child,
            expected={
                "relations": {
                    "multipart_monograph": [
                        {
                            "pid_value": parent_pid_value,
                            "pid_type": parent_pid_type,
                            "volume": "v.3",
                            "relation_type": "multipart_monograph",
                            "record_metadata": {
                                "title": parent["title"],
                                "mode_of_issuance": parent["mode_of_issuance"],
                            },
                        }
                    ]
                },
                "relations_extra_metadata": {
                    "multipart_monograph": [
                        {
                            "pid_value": parent_pid_value,
                            "pid_type": parent_pid_type,
                            "volume": "v.3",
                        }
                    ]
                },
            },
        )

    def _test_delete_mm_document_with_volume(create_using_pid1=True):
        """Test relation deletion with volume of MM and Document."""

        parent, child = recrel_choose_endpoints_and_do_request(
            (client, json_headers, "DELETE"),
            (
                parent_pid_value,
                parent_pid_type,
                child_pid_value,
                child_pid_type,
            ),
            payload,
            create_using_pid1=create_using_pid1,
        )

        recrel_assert_record_relations(parent, expected={"relations": {}})
        recrel_assert_record_relations(child, expected={"relations": {}})

    _test_create_mm_document_with_volume()
    _test_delete_mm_document_with_volume()
    _test_create_mm_document_with_volume(create_using_pid1=False)
    _test_delete_mm_document_with_volume(create_using_pid1=False)
    # recreate for the next one, to have some more valuable test data
    _test_create_mm_document_with_volume()


def _test_pc_serial_to_mm(client, json_headers):
    """Test relation create/delete of Serial and Multipart Monograph."""
    parent_pid_value = "serid-3"
    parent_pid_type = "serid"
    child_pid_value = "serid-1"
    child_pid_type = "serid"
    relation_type = "serial"

    payload = {
        "parent_pid_value": parent_pid_value,
        "parent_pid_type": parent_pid_type,
        "child_pid_value": child_pid_value,
        "child_pid_type": child_pid_type,
        "relation_type": relation_type,
        "volume": "vol. 1",
    }

    def _test_create_serial_to_mm(create_using_pid1=True):
        """Test relation create of Serial and Multipart Monograph."""

        parent, child = recrel_choose_endpoints_and_do_request(
            (client, json_headers, "POST"),
            (
                parent_pid_value,
                parent_pid_type,
                child_pid_value,
                child_pid_type,
            ),
            payload,
            create_using_pid1=create_using_pid1,
        )

        recrel_assert_record_relations(
            parent,
            expected={
                "relations": {},
            },
        )

        recrel_assert_record_relations(
            child,
            expected={
                "relations_extra_metadata": {
                    "serial": [
                        {
                            "pid_value": parent_pid_value,
                            "pid_type": parent_pid_type,
                            "volume": "vol. 1",
                        }
                    ]
                },
                "relations": {
                    "serial": [
                        {
                            "pid_value": parent_pid_value,
                            "pid_type": parent_pid_type,
                            "volume": "vol. 1",
                            "relation_type": "serial",
                            "record_metadata": {
                                "title": parent["title"],
                                "mode_of_issuance": parent["mode_of_issuance"],
                            },
                        }
                    ]
                },
            },
        )

    def _test_delete_serial_to_mm(create_using_pid1=True):
        """Test relation delete of Serial and Multipart Monograph."""

        parent, child = recrel_choose_endpoints_and_do_request(
            (client, json_headers, "DELETE"),
            (
                parent_pid_value,
                parent_pid_type,
                child_pid_value,
                child_pid_type,
            ),
            payload,
            create_using_pid1=create_using_pid1,
        )

        recrel_assert_record_relations(parent, expected={"relations": {}})
        recrel_assert_record_relations(
            child,
            expected={
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
    parent_pid_value = "serid-3"
    parent_pid_type = "serid"
    child_pid_value = "docid-3"
    child_pid_type = "docid"
    relation_type = "serial"

    payload = {
        "parent_pid_value": parent_pid_value,
        "parent_pid_type": parent_pid_type,
        "child_pid_value": child_pid_value,
        "child_pid_type": child_pid_type,
        "relation_type": relation_type,
        "volume": "vol. 1",
    }

    def _test_create_serial_to_document(create_using_pid1=True):
        """Test relation create of Serial to Document."""

        parent, child = recrel_choose_endpoints_and_do_request(
            (client, json_headers, "POST"),
            (
                parent_pid_value,
                parent_pid_type,
                child_pid_value,
                child_pid_type,
            ),
            payload,
            create_using_pid1=create_using_pid1,
        )

        recrel_assert_record_relations(
            parent,
            expected={
                "relations": {},
            },
        )

        recrel_assert_record_relations(
            child,
            expected={
                "relations": {
                    "serial": [
                        {
                            "pid_value": parent_pid_value,
                            "pid_type": parent_pid_type,
                            "volume": "vol. 1",
                            "relation_type": "serial",
                            "record_metadata": {
                                "title": parent["title"],
                                "mode_of_issuance": parent["mode_of_issuance"],
                            },
                        }
                    ]
                },
                "relations_extra_metadata": {
                    "serial": [
                        {
                            "pid_value": parent_pid_value,
                            "pid_type": parent_pid_type,
                            "volume": "vol. 1",
                        },
                    ]
                },
            },
        )

    def _test_delete_serial_to_document(create_using_pid1=True):
        """Test relation delete of Serial to Document."""

        parent, child = recrel_choose_endpoints_and_do_request(
            (client, json_headers, "DELETE"),
            (
                parent_pid_value,
                parent_pid_type,
                child_pid_value,
                child_pid_type,
            ),
            payload,
            create_using_pid1=create_using_pid1,
        )

        recrel_assert_record_relations(
            parent,
            expected={
                "relations": {},
            },
        )
        recrel_assert_record_relations(child, expected={"relations": {}})

    _test_create_serial_to_document()
    _test_delete_serial_to_document()
    _test_create_serial_to_document(create_using_pid1=False)
    _test_delete_serial_to_document(create_using_pid1=False)
    # recreate for the next one, to have some more valuable test data
    _test_create_serial_to_document()


def _test_pc_invalid_relations_should_fail(
    client, json_headers, invalids, status_code=400
):
    """Test relation creation with invalid parent-child should fail."""
    api_endpoint_documents = "invenio_app_ils_relations.docid_relations"
    api_endpoint_series = "invenio_app_ils_relations.serid_relations"

    for invalid in invalids:
        parent_pid_value = invalid["parent_pid_value"]
        parent_pid_type = invalid["parent_pid_type"]
        child_pid_value = invalid["child_pid_value"]
        child_pid_type = invalid["child_pid_type"]
        relation_type = invalid["relation_type"]

        api_endpoint = (
            api_endpoint_documents
            if parent_pid_type == "docid"
            else api_endpoint_series
        )

        url = url_for(api_endpoint, pid_value=parent_pid_value)
        payload = {
            "parent_pid_value": parent_pid_value,
            "parent_pid_type": parent_pid_type,
            "child_pid_value": child_pid_value,
            "child_pid_type": child_pid_type,
            "relation_type": relation_type,
        }

        res = client.post(url, headers=json_headers, data=json.dumps(payload))
        assert res.status_code == status_code
        if status_code == 400:
            error = json.loads(res.data.decode("utf-8"))
            assert "message" in error
            assert parent_pid_value in error["message"]
            assert child_pid_value in error["message"]


def test_parent_child_relations(client, json_headers, testdata, users):
    """Test parent child relations."""

    _test_pc_invalid_relations_should_fail(
        client,
        json_headers,
        [
            {
                "parent_pid_value": "serid-3",
                "parent_pid_type": "serid",
                "child_pid_value": "docid-1",
                "child_pid_type": "docid",
                "relation_type": "serial",
            }
        ],
        status_code=401,
    )

    user_login(client, "librarian", users)

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
            "parent_pid_value": "docid-1",
            "parent_pid_type": "docid",
            "child_pid_value": "serid-1",  # Multipart Monograph
            "child_pid_type": "serid",
            "relation_type": "multipart_monograph",
        },
        {
            "parent_pid_value": "docid-1",
            "parent_pid_type": "docid",
            "child_pid_value": "serid-3",  # Serial
            "child_pid_type": "serid",
            "relation_type": "serial",
        },
        {
            "parent_pid_value": "serid-1",  # Multipart Monograph
            "parent_pid_type": "serid",
            "child_pid_value": "serid-3",  # Serial
            "child_pid_type": "serid",
            "relation_type": "multipart_monograph",
        },
        {
            "parent_pid_value": "docid-1",
            "parent_pid_type": "docid",
            "child_pid_value": "docid-2",
            "child_pid_type": "docid",
            "relation_type": "serial",
        },
        # already existing
        {
            "parent_pid_value": "serid-3",  # Serial
            "parent_pid_type": "serid",
            "child_pid_value": "docid-3",
            "child_pid_type": "docid",
            "relation_type": "serial",
        },
    ]
    _test_pc_invalid_relations_should_fail(client, json_headers, invalids)


def test_max_one_multipart(testdata):
    doc = testdata["documents"][0]
    series1 = testdata["series"][0]
    rr = RecordRelationsParentChild()
    res = rr.add(
        series1,
        doc,
        Relation.get_relation_by_name("multipart_monograph"),
    )

    assert res

    series2 = testdata["series"][1]

    with pytest.raises(RecordRelationsError) as error:
        rr = RecordRelationsParentChild()
        res = rr.add(
            series2,
            doc,
            "multipart_monograph",
        )

    assert isinstance(error.value, RecordRelationsError)
