# -*- coding: utf-8 -*-
#
# Copyright (C) 2021 CERN.
#
# Invenio-Circulation is free software; you can redistribute it and/or modify
# it under the terms of the MIT License; see LICENSE file for more details.

"""Tests eitems CRUD."""

import pytest

from invenio_app_ils.eitems.api import EItem
from invenio_app_ils.errors import DocumentNotFoundError


def test_eitem_refs(app, testdata):
    """Test creation of an eitem."""
    eitem = EItem.create(
        dict(
            pid="eitemid-99",
            document_pid="docid-1",
            created_by=dict(type="script", value="demo"),
        )
    )
    assert "$schema" in eitem
    assert "document" in eitem and "$ref" in eitem["document"]

    eitem = EItem.get_record_by_pid("eitemid-4")
    eitem = eitem.replace_refs()
    assert "document" in eitem and eitem["document"]["title"]


def test_eitem_validation(db, testdata):
    """Test validation when updating an eitem."""
    eitem_pid = testdata["eitems"][0]["pid"]
    eitem = EItem.get_record_by_pid(eitem_pid)

    # change document pid
    eitem["document_pid"] = "not_found_doc"
    with pytest.raises(DocumentNotFoundError):
        eitem.commit()
