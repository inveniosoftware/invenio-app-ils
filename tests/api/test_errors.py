# -*- coding: utf-8 -*-
#
# Copyright (C) 2018 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""Test errors."""

import pytest

from invenio_app_ils.errors import DocumentKeywordNotFoundError, \
    ItemHasActiveLoanError, NotImplementedConfigurationError, \
    PatronHasLoanOnItemError, PatronNotFoundError, RecordHasReferencesError, \
    SearchQueryError, UnauthorizedSearchError


def test_unauthorized_search_with_patron_pid(app):
    """Test UnauthorizedSearchError with patron_pid defined."""
    query = "test query"
    pid = "1"
    msg = "Search `{query}` not allowed by `patron_pid:{patron_pid}`"
    with pytest.raises(UnauthorizedSearchError) as ex:
        raise UnauthorizedSearchError(query=query, patron_pid=pid)
    assert ex.value.code == 403
    assert ex.value.description == msg.format(query=query, patron_pid=pid)


def test_unauthorized_search_without_patron_pid(app):
    """Test UnauthorizedSearchError without patron_pid defined."""
    query = "test query"
    msg = "Search `{query}` not allowed by `patron_pid:None`"
    with pytest.raises(UnauthorizedSearchError) as ex:
        raise UnauthorizedSearchError(query=query)
    assert ex.value.code == 401
    assert ex.value.description == msg.format(query=query)


def test_invalid_search_query(app):
    """Test SearchQueryError."""
    query = "invalid query"
    msg = "Invalid query syntax: '{query}'"
    with pytest.raises(SearchQueryError) as ex:
        raise SearchQueryError(query=query)
    assert ex.value.code == SearchQueryError.code
    assert ex.value.description == msg.format(query=query)


def test_not_implemented(app):
    """Test NotImplementedConfigurationError."""
    config_variable = 'CONFIG_VAR'
    msg = (
        "Function is not implemented. Implement this function in your module "
        "and pass it to the config variable '{}'".format(config_variable)
    )
    with pytest.raises(NotImplementedConfigurationError) as ex:
        raise NotImplementedConfigurationError(config_variable="CONFIG_VAR")
    assert ex.value.code == NotImplementedConfigurationError.code
    assert ex.value.description == msg


def test_patron_not_found(app):
    """Test PatronNotFoundError."""
    patron_pid = "1"
    msg = "Patron with PID `{patron_pid}` was not found."
    with pytest.raises(PatronNotFoundError) as ex:
        raise PatronNotFoundError(patron_pid)
    assert ex.value.code == PatronNotFoundError.code
    assert ex.value.description == msg.format(patron_pid=patron_pid)


def test_patron_has_loan_on_item(app):
    """Test PatronHasLoanOnItemError."""
    patron_pid = "1"
    item_pid = "2"
    msg = ("Patron `patron_pid:{patron_pid}` already has an active loan"
           " or a loan request on item `item_pid:{item_pid}`")
    with pytest.raises(PatronHasLoanOnItemError) as ex:
        raise PatronHasLoanOnItemError(patron_pid, item_pid)
    assert ex.value.code == PatronHasLoanOnItemError.code
    assert ex.value.description == msg.format(
        patron_pid=patron_pid, item_pid=item_pid)


def test_document_keyword_not_found_error(app):
    """Test DocumentKeywordNotFoundError."""
    document_pid = "1"
    keyword_pid = "2"
    msg = "Document PID '{}' has no keyword with PID '{}'"
    with pytest.raises(DocumentKeywordNotFoundError) as ex:
        raise DocumentKeywordNotFoundError(document_pid, keyword_pid)
    assert ex.value.code == DocumentKeywordNotFoundError.code
    assert ex.value.description == msg.format(document_pid, keyword_pid)


def test_record_has_references_error(app):
    """Test RecordHasReferencesError."""
    record_type = 'Item'
    record_id = 'item-1'
    ref_type = 'RecordType'
    ref_ids = ['1', '2', '3']
    msg = (
        "Cannot delete the {record_type} {record_id} record because it has "
        "references from {ref_type} records with ids: {ref_ids}."
    ).format(
        record_type=record_type,
        record_id=record_id,
        ref_type=ref_type,
        ref_ids=ref_ids
    )

    with pytest.raises(RecordHasReferencesError) as ex:
        raise RecordHasReferencesError(
            record_type=record_type,
            record_id=record_id,
            ref_type=ref_type,
            ref_ids=ref_ids
        )
    assert ex.value.code == RecordHasReferencesError.code
    assert ex.value.description == msg


def test_item_has_active_loan_error(app):
    loan_pid = "1"
    msg = (
        "Could not update item because it has an active loan with "
        "pid: {loan_pid}."
    ).format(
        loan_pid=loan_pid
    )
    with pytest.raises(ItemHasActiveLoanError) as ex:
        raise ItemHasActiveLoanError(loan_pid=loan_pid)
    assert ex.value.code == ItemHasActiveLoanError.code
    assert ex.value.description == msg
