# -*- coding: utf-8 -*-
#
# Copyright (C) 2020 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""Test Items resolvers."""

from invenio_circulation.pidstore.pids import CIRCULATION_LOAN_PID_TYPE

from invenio_app_ils.acquisition.api import ORDER_PID_TYPE
from invenio_app_ils.document_requests.api import DOCUMENT_REQUEST_PID_TYPE
from invenio_app_ils.documents.api import DOCUMENT_PID_TYPE, Document
from invenio_app_ils.documents.indexer import DocumentIndexer
from invenio_app_ils.eitems.api import EITEM_PID_TYPE, EItem
from invenio_app_ils.eitems.indexer import EItemIndexer
from invenio_app_ils.ill.api import BORROWING_REQUEST_PID_TYPE
from invenio_app_ils.internal_locations.indexer import InternalLocationIndexer
from invenio_app_ils.items.api import ITEM_PID_TYPE, Item
from invenio_app_ils.items.indexer import ItemIndexer
from invenio_app_ils.locations.api import LOCATION_PID_TYPE, Location
from invenio_app_ils.locations.indexer import LocationIndexer
from invenio_app_ils.patrons.api import PATRON_PID_TYPE, Patron
from invenio_app_ils.patrons.indexer import PatronIndexer

from invenio_app_ils.internal_locations.api import (  # isort:skip
    INTERNAL_LOCATION_PID_TYPE,
    InternalLocation,
)


def test_jsonresolvers(testdata, mocker):
    """Test that all records referencing a changed record are re-indexed."""

    def _get_mock():
        return mocker.patch(
            "invenio_app_ils.indexer.ReferencedRecordsIndexer.index"
        )

    def _assert_origin(indexer, pid_type, pid_value):
        """Assert that origin is called and return all referenced."""
        assert indexer.called
        all_calls = indexer.call_args_list
        first_call = all_calls[0]
        indexed, referenced = first_call[0]
        assert indexed["pid_type"] == pid_type
        assert indexed["record"]["pid"] == pid_value

        # call[0] is the list of arguments passed to the function
        # call[0][0] is the origin record, call[0][1] is the referenced record
        all_referenced = []
        for call in all_calls:
            origin, referenced = call[0]
            all_referenced += referenced
        return all_referenced

    def _assert_contains(referenced, pid_type):
        """Assert that given PID is contained in one of the referenced."""
        found = False
        for r in referenced:
            if r["pid_type"] == pid_type:
                found = True
                break
        assert found

    def test_on_document_update():
        """Test document resolvers."""
        indexer = _get_mock()

        pid = "docid-2"
        document = Document.get_record_by_pid(pid)
        DocumentIndexer().index(document)

        referenced = _assert_origin(indexer, DOCUMENT_PID_TYPE, pid)

        # should re-index document request
        n_doc_req = 1  # from test data
        _assert_contains(referenced, DOCUMENT_REQUEST_PID_TYPE)

        # should re-index eitem
        n_eitems = 1  # from test data
        _assert_contains(referenced, EITEM_PID_TYPE)

        # should re-index item
        n_items = 1  # from test data
        _assert_contains(referenced, ITEM_PID_TYPE)

        # should re-index acq
        n_acq = 1  # from test data
        _assert_contains(referenced, ORDER_PID_TYPE)

        # should re-index ill
        n_ill = 1  # from test data
        _assert_contains(referenced, BORROWING_REQUEST_PID_TYPE)

        expected_total = n_doc_req + n_eitems + n_items + n_acq + n_ill
        assert len(referenced) == expected_total

    def test_on_eitem_update():
        """Test eitem resolvers."""
        indexer = _get_mock()

        pid = "eitemid-1"
        eitem = EItem.get_record_by_pid(pid)
        EItemIndexer().index(eitem)

        referenced = _assert_origin(indexer, EITEM_PID_TYPE, pid)

        # should re-index documents
        n_documents = 1  # from test data
        _assert_contains(referenced, DOCUMENT_PID_TYPE)

        assert len(referenced) == n_documents

    def test_on_internal_location_update():
        """Test internal location resolvers."""
        indexer = _get_mock()

        pid = "ilocid-2"
        intloc = InternalLocation.get_record_by_pid(pid)
        InternalLocationIndexer().index(intloc)

        referenced = _assert_origin(indexer, INTERNAL_LOCATION_PID_TYPE, pid)

        # should re-index items
        n_items = 4  # from test data
        _assert_contains(referenced, ITEM_PID_TYPE)

        assert len(referenced) == n_items

    def test_on_item_update():
        """Test item resolvers."""
        indexer = _get_mock()

        # item on loan
        pid = "itemid-56"
        item = Item.get_record_by_pid(pid)
        ItemIndexer().index(item)

        referenced = _assert_origin(indexer, ITEM_PID_TYPE, pid)

        # should re-index loans
        n_loans = 2  # from test data, including pending
        _assert_contains(referenced, CIRCULATION_LOAN_PID_TYPE)

        # should re-index document
        n_documents = 1  # from test data
        _assert_contains(referenced, DOCUMENT_PID_TYPE)

        assert len(referenced) == n_loans + n_documents

    def test_on_location_update():
        """Test location resolvers."""
        indexer = _get_mock()

        pid = "locid-2"
        loc = Location.get_record_by_pid(pid)
        LocationIndexer().index(loc)

        referenced = _assert_origin(indexer, LOCATION_PID_TYPE, pid)

        # should re-index internal locations
        n_intlocs = 1  # from test data
        _assert_contains(referenced, INTERNAL_LOCATION_PID_TYPE)

        # should re-index internal items
        n_items = 1  # from test data
        _assert_contains(referenced, ITEM_PID_TYPE)

        assert len(referenced) == n_intlocs + n_items

    def test_on_patron_update():
        """Test patron resolvers."""
        indexer = _get_mock()

        pid = "2"
        patron = Patron.get_patron(pid)
        PatronIndexer().index(patron)

        referenced = _assert_origin(indexer, PATRON_PID_TYPE, pid)

        # should re-index loans
        n_loans = 3  # from test data
        _assert_contains(referenced, CIRCULATION_LOAN_PID_TYPE)

        # should re-index document request
        n_doc_req = 1  # from test data
        _assert_contains(referenced, DOCUMENT_REQUEST_PID_TYPE)

        # should re-index acq
        n_acq = 1  # from test data
        _assert_contains(referenced, ORDER_PID_TYPE)

        # should re-index ill
        n_ill = 3  # from test data
        _assert_contains(referenced, BORROWING_REQUEST_PID_TYPE)

        expected_total = n_loans + n_doc_req + n_acq + n_ill
        assert len(referenced) == expected_total

    test_on_document_update()
    test_on_eitem_update()
    test_on_internal_location_update()
    test_on_item_update()
    test_on_location_update()
    test_on_patron_update()
