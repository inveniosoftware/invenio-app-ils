# -*- coding: utf-8 -*-
#
# Copyright (C) 2021 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""Test record delete."""

import pytest
from elasticsearch import VERSION as ES_VERSION

from invenio_app_ils.errors import DocumentNotFoundError, PatronNotFoundError
from invenio_app_ils.ill.api import BorrowingRequest
from invenio_app_ils.ill.errors import ILLError, LibraryNotFoundError

lt_es7 = ES_VERSION[0] < 7


def test_update_ill_brw(db, testdata):
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
