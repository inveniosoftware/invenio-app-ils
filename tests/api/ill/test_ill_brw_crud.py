# -*- coding: utf-8 -*-
#
# Copyright (C) 2021 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""Test record CRUD."""

import pytest

from invenio_app_ils.errors import DocumentNotFoundError, PatronNotFoundError
from invenio_app_ils.ill.api import BorrowingRequest
from invenio_app_ils.ill.errors import ILLError, LibraryNotFoundError


def test_brw_req_refs(app, testdata):
    """Test creation of a borrowing request."""
    brw_req = BorrowingRequest.create(
        dict(
            pid="illlid-99",
            document_pid="docid-1",
            patron_pid="1",
            library_pid="illlid-1",
            status="PENDING",
            type="PHYSICAL_COPY",
        )
    )
    assert "$schema" in brw_req
    assert "library" in brw_req and "$ref" in brw_req["library"]
    assert "document" in brw_req and "$ref" in brw_req["document"]
    assert "patron" in brw_req and "$ref" in brw_req["patron"]

    brw_req = BorrowingRequest.get_record_by_pid("illbid-1")
    brw_req = brw_req.replace_refs()
    assert "library" in brw_req and brw_req["library"]["name"]
    assert "document" in brw_req and brw_req["document"]["title"]
    assert "patron" in brw_req and brw_req["patron"]["name"]


def test_ill_brw_validation(db, testdata):
    """Test validation when updating a borrowing request."""
    borrowing_request_pid = testdata["ill_brw_reqs"][0]["pid"]

    # change document pid
    borrowing_request = BorrowingRequest.get_record_by_pid(
        borrowing_request_pid
    )
    borrowing_request["document_pid"] = "not_found_doc"
    with pytest.raises(DocumentNotFoundError):
        borrowing_request.commit()

    # change library pid
    borrowing_request = BorrowingRequest.get_record_by_pid(
        borrowing_request_pid
    )
    borrowing_request["library_pid"] = "not_found_lib"
    with pytest.raises(LibraryNotFoundError):
        borrowing_request.commit()

    # change patron pid
    borrowing_request = BorrowingRequest.get_record_by_pid(
        borrowing_request_pid
    )
    borrowing_request["patron_pid"] = "9999"
    with pytest.raises(PatronNotFoundError):
        borrowing_request.commit()

    # add cancel reason without status CANCELLED
    borrowing_request = BorrowingRequest.get_record_by_pid(
        borrowing_request_pid
    )
    borrowing_request["cancel_reason"] = "USER_CANCEL"
    with pytest.raises(ILLError):
        borrowing_request.commit()

    # update status to CANCELLED without cancel_reason
    borrowing_request = BorrowingRequest.get_record_by_pid(
        borrowing_request_pid
    )
    borrowing_request["status"] = "CANCELLED"
    with pytest.raises(ILLError):
        borrowing_request.commit()
