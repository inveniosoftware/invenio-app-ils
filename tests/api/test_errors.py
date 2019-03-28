# -*- coding: utf-8 -*-
#
# Copyright (C) 2018 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""Test errors."""

import pytest

from invenio_app_ils.errors import NotImplementedConfigurationError, \
    PatronHasLoanOnItemError, PatronNotFoundError, SearchQueryError, \
    UnauthorizedSearchError


def test_unauthorized_search(app):
    """Test UnauthorizedSearchError."""
    query = "test query"
    pid = "1"
    msg = "Search `{query}` not allowed by `patron_pid:{patron_pid}`"
    with pytest.raises(UnauthorizedSearchError) as ex:
        raise UnauthorizedSearchError(query=query, patron_pid=pid)
    assert ex.value.code == UnauthorizedSearchError.code
    assert ex.value.description == msg.format(query=query, patron_pid=pid)


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
