# -*- coding: utf-8 -*-
#
# Copyright (C) 2018-2019  CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""Test custom serializers."""
import copy
import json
import uuid

from invenio_circulation.api import Loan
from invenio_circulation.pidstore.pids import CIRCULATION_LOAN_MINTER
from invenio_db import db
from invenio_pidstore import current_pidstore

from invenio_app_ils.records.serializers import (  # isort:skip
    MultipleCheckoutJSONSerializer,
    json_v1)


def create_loan(data):
    """Create a test record."""
    with db.session.begin_nested():
        data = copy.deepcopy(data)
        rec_uuid = uuid.uuid4()
        pid = current_pidstore.minters[CIRCULATION_LOAN_MINTER](rec_uuid, data)
        record = Loan.create(data, id_=rec_uuid)
        return pid, record


def test_multiple_response_serializer(testdata):
    """Test the serializer of multiple loans response."""

    data = dict(
        loans=[testdata['loan_records'][0], testdata['loan_records'][1]],
        errors=[
            dict(
                item_barcode=123456,
                error=404,
                error_msg='testtest'
            ),
            dict(
                item_barcode=1234567,
                error=404,
                error_msg='testtest'
            )
        ]
    )

    output = MultipleCheckoutJSONSerializer() \
        .serialize(data['loans'], data['errors'], record_serializer=json_v1)

    expected_errors = [
        {"error": 404, "error_msg": "testtest", "item_barcode": 123456},
        {"error": 404, "error_msg": "testtest", "item_barcode": 1234567}
    ]

    expected_loans = [
        {
            "metadata": {
                "document_pid": "docid-1",
                "item": {"barcode": "123456789"},
                "patron_pid": "1",
            },
        },
        {
            "metadata": {
                "document_pid": "docid-1",
                "item": {"barcode": "12345678910"},
                "patron_pid": "1",
            }
        }
    ]

    json_output = json.loads(output)
    assert expected_errors == json_output['errors']
    assert expected_loans[0]['metadata']['item']['barcode'] \
        == json_output['loans'][0]['metadata']['item']['barcode']
    assert expected_loans[1]['metadata']['item']['barcode'] \
        == json_output['loans'][1]['metadata']['item']['barcode']
