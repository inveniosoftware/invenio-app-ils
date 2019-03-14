# -*- coding: utf-8 -*-
#
# Copyright (C) 2019 CERN.
#
# Invenio-App-Ils is free software; you can redistribute it and/or modify
# it under the terms of the MIT License; see LICENSE file for more details.

"""ILS exceptions."""

import json

from flask import g
from invenio_rest.errors import RESTException


class IlsException(RESTException):
    """Base Exception for ILS module, inherit, don't raise."""

    code = 400

    def __init__(self, **kwargs):
        """Initialize exception."""
        super(IlsException, self).__init__(**kwargs)

    @property
    def name(self):
        """The status name."""
        return type(self).__name__

    def get_body(self, environ=None):
        """Get the request body."""
        body = dict(
            status=self.code,
            message=self.get_description(environ),
            error_module="ILS",
            error_class=self.name
        )

        errors = self.get_errors()
        if self.errors:
            body['errors'] = errors

        if self.code and (self.code >= 500) and hasattr(g, 'sentry_event_id'):
            body['error_id'] = str(g.sentry_event_id)

        return json.dumps(body)


class UnauthorizedSearchError(IlsException):
    """The user performing the search is not authorized."""

    code = 403
    description = "Search `{query}` not allowed by `patron_pid:{pid}`"

    def __init__(self, query, patron_pid, **kwargs):
        """Initialize UnauthorizedSearchError exception.

        :param query: Unauthorized search query.
        :param patron_pid: Patron that performed the unauthorized search.
        """
        super(UnauthorizedSearchError, self).__init__(**kwargs)
        self.description = self.description.format(query=query, pid=patron_pid)


class SearchQueryError(IlsException):
    """Invalid query syntax."""

    description = "Invalid query syntax: '{query}'"

    def __init__(self, query, **kwargs):
        """Initialize UnauthorizedSearchError exception.

        :param query: Invalid search query.
        """
        super(SearchQueryError, self).__init__(**kwargs)
        self.description = self.description.format(query=query)


class PatronNotFoundError(IlsException):
    """A patron could not be found."""

    code = 404
    description = "Patron with PID `{patron_pid}` was not found."

    def __init__(self, patron_pid, **kwargs):
        """Initialize PatronNotFoundError exception."""
        super(PatronNotFoundError, self).__init__(**kwargs)
        self.description = self.description.format(patron_pid=patron_pid)


class PatronHasLoanOnItemError(IlsException):
    """A patron already has an active loan or a loan request on an item."""

    description = ("Patron `patron_pid:{patron_pid}` already has an active "
                   "loan or a loan request on item `item_pid:{item_pid}`")

    def __init__(self, patron_pid, item_pid, **kwargs):
        """Initialize PatronHasActiveLoanOnItem exception.

        :param loan_params: Loan request parameters.
        :param prop: Missing property from loan request.
        """
        super(PatronHasLoanOnItemError, self).__init__(**kwargs)
        self.description = self.description.format(
            patron_pid=patron_pid, item_pid=item_pid)


class NotImplementedConfigurationError(IlsException):
    """Exception raised when function is not implemented."""

    description = (
        "Function is not implemented. Implement this function in your module "
        "and pass it to the config variable"
    )

    def __init__(self, config_variable=None, **kwargs):
        """Initialize exception."""
        super(NotImplementedConfigurationError, self).__init__(**kwargs)
        self.description = "{} '{}'".format(self.description, config_variable)


class MissingRequiredParameterError(IlsException):
    """Exception raised when required parameter is missing."""


class DocumentKeywordNotFoundError(IlsException):
    """Raised when trying to remove a non-existing keyword from a document."""

    description = "Document PID '{}' has no keyword with PID '{}'"

    def __init__(self, document_pid, keyword_pid, **kwargs):
        """Initialize exception."""
        super(DocumentKeywordNotFoundError, self).__init__(**kwargs)
        self.description = self.description.format(document_pid, keyword_pid)
