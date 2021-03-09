# -*- coding: utf-8 -*-
#
# Copyright (C) 2021 CERN.
#
# Invenio-Circulation is free software; you can redistribute it and/or modify
# it under the terms of the MIT License; see LICENSE file for more details.

"""Tests orders CRUD."""

from copy import deepcopy
from datetime import datetime

import pytest

from invenio_app_ils.acquisition.api import Order
from invenio_app_ils.acquisition.errors import AcquisitionError
from invenio_app_ils.errors import DocumentNotFoundError, PatronNotFoundError
from invenio_app_ils.providers.errors import ProviderNotFoundError


def _assert_extra_fields(order):
    """Test that extra fields are automatically added."""
    assert "$schema" in order
    assert "provider" in order and "$ref" in order["provider"]
    assert (
        "resolved_order_lines" in order
        and "$ref" in order["resolved_order_lines"]
    )


def _assert_refs_values(order):
    """Test that refs are replaced correctly"""
    assert "provider" in order and order["provider"]["name"]
    for order_line in order["resolved_order_lines"]:
        assert "document" in order_line and order_line["document"]["title"]
        assert "patron" in order_line and order_line["patron"]["name"]


def test_order_refs(app, testdata):
    """Test creation of an order."""
    order = Order.create(
        dict(
            pid="acqoid-99",
            order_date=datetime.now().isoformat(),
            status="ORDERED",
            provider_pid="acq-provid-1",
            order_lines=[
                dict(
                    document_pid="docid-3",
                    recipient="PATRON",
                    patron_pid="1",
                    medium="PAPER",
                    copies_ordered=2,
                )
            ],
        )
    )
    _assert_extra_fields(order)

    order = Order.get_record_by_pid("acqoid-6")
    order = order.replace_refs()
    _assert_refs_values(order)


def test_acq_order_validation(db, testdata):
    """Test validation when updating an order."""
    order_pid = testdata["acq_orders"][0]["pid"]
    orginal_order = Order.get_record_by_pid(order_pid)

    # add cancel reason without status CANCELLED
    order = deepcopy(orginal_order)
    order["cancel_reason"] = "A reason to cancel"
    with pytest.raises(AcquisitionError):
        order.commit()

    # update status to CANCELLED without cancel_reason
    order = deepcopy(orginal_order)
    order["status"] = "CANCELLED"
    with pytest.raises(AcquisitionError):
        order.commit()

    # change provider pid
    order = deepcopy(orginal_order)
    order["provider_pid"] = "not-existing"
    with pytest.raises(ProviderNotFoundError):
        order.commit()

    order = deepcopy(orginal_order)
    first_order_line = order["order_lines"][0]

    # change document pid
    first_order_line["document_pid"] = "not_found_doc"
    with pytest.raises(DocumentNotFoundError):
        order.commit()

    order = deepcopy(orginal_order)
    first_order_line = order["order_lines"][0]

    # change patron pid
    first_order_line["patron_pid"] = "99999"
    with pytest.raises(PatronNotFoundError):
        order.commit()
