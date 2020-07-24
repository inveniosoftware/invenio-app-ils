# -*- coding: utf-8 -*-
#
# Copyright (C) 2020 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""Test accessibility of document request resource endpoints."""

from flask import url_for

from tests.helpers import user_login, validate_response


def test_get_document_request_endpoint(client, json_headers, testdata, users):
    """Test GET permissions."""

    tests = [
        ("patron1", "dreq-1", 200),
        ("librarian", "dreq-1", 200),
        ("admin", "dreq-1", 200),
        ("patron2", "dreq-1", 403),
        ("anonymous", "dreq-1", 401),
        ("patron2", "dreq-2", 200),
        ("librarian", "dreq-2", 200),
        ("admin", "dreq-2", 200),
        ("patron1", "dreq-2", 403),
        ("anonymous", "dreq-2", 401),
    ]

    for user, res_id, expected_resp_code in tests:
        user_login(client, user, users)
        url = url_for("invenio_records_rest.dreqid_item", pid_value=res_id)
        validate_response(
            client, "get", url, json_headers, None, expected_resp_code
        )


def test_document_request_add_document(client, json_headers, testdata, users):
    """Test add document to Document Request permissions."""

    tests = [
        ("patron1", "dreq-1", 403),
        ("librarian", "dreq-1", 202),
        ("admin", "dreq-1", 202),
        ("anonymous", "dreq-1", 401),
    ]

    for user, res_id, expected_resp_code in tests:
        user_login(client, user, users)
        url = url_for(
            "invenio_app_ils_document_requests.dreqid_document",
            pid_value=res_id,
        )
        data = {"document_pid": "docid-1"}
        validate_response(
            client, "post", url, json_headers, data, expected_resp_code
        )


def test_document_request_remove_document(
    client, json_headers, testdata, users
):
    """Test remove document from Document Request permissions."""

    tests = [
        ("patron1", "dreq-1", 403),
        ("librarian", "dreq-1", 202),
        ("admin", "dreq-1", 202),
        ("anonymous", "dreq-1", 401),
    ]

    for user, res_id, expected_resp_code in tests:
        user_login(client, user, users)
        url = url_for(
            "invenio_app_ils_document_requests.dreqid_document",
            pid_value=res_id,
        )
        data = {"document_pid": "docid-1"}
        validate_response(
            client, "delete", url, json_headers, data, expected_resp_code
        )


def test_document_request_add_provider(client, json_headers, testdata, users):
    """Test add provider to Document Request permissions."""

    tests = [
        ("patron1", "dreq-1", 403),
        ("librarian", "dreq-1", 202),
        ("admin", "dreq-1", 202),
        ("anonymous", "dreq-1", 401),
    ]

    for user, res_id, expected_resp_code in tests:
        user_login(client, user, users)
        url = url_for(
            "invenio_app_ils_document_requests.dreqid_provider",
            pid_value=res_id,
        )
        data = {
            "physical_item_provider": {
                "pid": "acquisition-order-pid",
                "pid_type": "acquisition",
            }
        }
        validate_response(
            client, "post", url, json_headers, data, expected_resp_code
        )


def test_document_request_remove_provider(
    client, json_headers, testdata, users
):
    """Test remove provider from Document Request permissions."""

    tests = [
        ("patron1", "dreq-1", 403),
        ("librarian", "dreq-1", 202),
        ("admin", "dreq-1", 202),
        ("anonymous", "dreq-1", 401),
    ]

    for user, res_id, expected_resp_code in tests:
        user_login(client, user, users)
        url = url_for(
            "invenio_app_ils_document_requests.dreqid_provider",
            pid_value=res_id,
        )
        validate_response(
            client, "delete", url, json_headers, None, expected_resp_code
        )


def test_document_request_accept(client, json_headers, testdata, users):
    """Test Document Request permissions to accept request."""

    tests = [
        ("patron1", "dreq-1", 403),
        ("librarian", "dreq-5", 202),
        ("admin", "dreq-6", 202),
        ("anonymous", "dreq-1", 401),
        ("admin", "dreq-2", 400),
    ]

    for user, res_id, expected_resp_code in tests:
        user_login(client, user, users)
        url = url_for(
            "invenio_app_ils_document_requests.dreqid_accept", pid_value=res_id
        )
        data = {"state": "ACCEPTED"}
        validate_response(
            client, "post", url, json_headers, data, expected_resp_code
        )


def test_document_request_reject(client, json_headers, testdata, users):
    """Test Document Request permissions to reject request."""

    tests = [
        ("patron1", "dreq-1", 202),
        ("librarian", "dreq-5", 202),
        ("admin", "dreq-6", 202),
        ("anonymous", "dreq-1", 401),
        ("admin", "dreq-2", 400),
    ]

    for user, res_id, expected_resp_code in tests:
        user_login(client, user, users)
        url = url_for(
            "invenio_app_ils_document_requests.dreqid_reject", pid_value=res_id
        )
        data = {"reject_reason": "USER_CANCEL"}
        validate_response(
            client, "post", url, json_headers, data, expected_resp_code
        )
