# -*- coding: utf-8 -*-
#
# Copyright (C) 2019-2020 CERN.
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
        super().__init__(**kwargs)

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
            error_class=self.name,
        )

        errors = self.get_errors()
        if self.errors:
            body["errors"] = errors

        if self.code and (self.code >= 500) and hasattr(g, "sentry_event_id"):
            body["error_id"] = str(g.sentry_event_id)

        return json.dumps(body)


class UnauthorizedSearchError(IlsException):
    """The user performing the search is not authorized."""

    code = 403
    description = "Search '{query}' not allowed by 'patron_pid:{pid}'"

    def __init__(self, query, patron_pid=None, **kwargs):
        """Initialize UnauthorizedSearchError exception.

        :param query: Unauthorized search query.
        :param patron_pid: Patron that performed the unauthorized search.
        """
        super().__init__(**kwargs)
        if not patron_pid:
            self.code = 401
        self.description = self.description.format(query=query, pid=patron_pid)


class SearchQueryError(IlsException):
    """Invalid query syntax."""

    description = "Invalid query syntax: '{query}'"

    def __init__(self, query, **kwargs):
        """Initialize UnauthorizedSearchError exception.

        :param query: Invalid search query.
        """
        super().__init__(**kwargs)
        self.description = self.description.format(query=query)


class RecordHasReferencesError(IlsException):
    """The record which we are trying to delete has references."""

    description = (
        "Cannot delete the {record_type} {record_id} record because it has "
        "references from {ref_type} records with ids: {ref_ids}."
    )

    def __init__(self, record_type, record_id, ref_type, ref_ids, **kwargs):
        """Initialize RecordHasReferencesError exception."""
        super().__init__(**kwargs)
        self.description = self.description.format(
            record_type=record_type,
            record_id=record_id,
            ref_type=ref_type,
            ref_ids=ref_ids,
        )


class ItemHasActiveLoanError(IlsException):
    """The item which we are trying to update has an active loan."""

    description = (
        "Could not update item because it has an active loan with "
        "pid: {loan_pid}."
    )

    def __init__(self, loan_pid, **kwargs):
        """Initialize ItemHasActiveLoanError exception."""
        super().__init__(**kwargs)
        self.description = self.description.format(loan_pid=loan_pid)


class PatronNotFoundError(IlsException):
    """A patron could not be found."""

    code = 404
    description = "Patron with ID '{patron_pid}' was not found."

    def __init__(self, patron_pid, **kwargs):
        """Initialize PatronNotFoundError exception."""
        super().__init__(**kwargs)
        self.description = self.description.format(patron_pid=patron_pid)


class PatronHasLoanOnItemError(IlsException):
    """A patron already has an active loan or a loan request on an item."""

    description = "Patron '{0}' has already an active loan on item '{1}:{2}'"

    def __init__(self, patron_pid, item_pid, **kwargs):
        """Initialize PatronHasActiveLoanOnItem exception.

        :param loan_params: Loan request parameters.
        :param prop: Missing property from loan request.
        """
        super().__init__(**kwargs)
        self.description = self.description.format(
            patron_pid, item_pid["type"], item_pid["value"]
        )


class PatronHasRequestOnDocumentError(IlsException):
    """A patron already has a loan request on a document."""

    description = (
        "Patron '{patron_pid}' has already a loan "
        "request on document '{document_pid}'"
    )

    def __init__(self, patron_pid, document_pid, **kwargs):
        """Initialize PatronHasActiveLoanOnDocument exception.

        :param loan_params: Loan request parameters.
        :param prop: Missing property from loan request.
        """
        super().__init__(**kwargs)
        self.description = self.description.format(
            patron_pid=patron_pid, document_pid=document_pid
        )


class PatronHasLoanOnDocumentError(IlsException):
    """A patron already has an active loan on a document."""

    description = (
        "Patron '{patron_pid}' has already an active loan "
        "on document '{document_pid}'"
    )

    def __init__(self, patron_pid, document_pid, **kwargs):
        """Initialize PatronHasLoanOnDocumentError exception.

        :param loan_params: Loan request parameters.
        :param prop: Missing property from loan request.
        """
        super().__init__(**kwargs)
        self.description = self.description.format(
            patron_pid=patron_pid, document_pid=document_pid
        )


class NotImplementedConfigurationError(IlsException):
    """Exception raised when function is not implemented."""

    description = (
        "Function is not implemented. Implement this function in your module "
        "and pass it to the config variable"
    )

    def __init__(self, config_variable=None, **kwargs):
        """Initialize exception."""
        super().__init__(**kwargs)
        self.description = "{} '{}'".format(self.description, config_variable)


class MissingRequiredParameterError(IlsException):
    """Exception raised when required parameter is missing."""


class InvalidParameterError(IlsException):
    """Exception raised when an invalid parameter is has been given."""


class DocumentNotFoundError(IlsException):
    """Raised when a document could not be found."""

    description = "Document PID '{}' was not found"

    def __init__(self, document_pid, **kwargs):
        """Initialize exception."""
        super().__init__(**kwargs)
        self.description = self.description.format(document_pid)


class LocationNotFoundError(IlsException):
    """Raised when a location could not be found."""

    description = "Location PID '{}' was not found"

    def __init__(self, location_pid, **kwargs):
        """Initialize exception."""
        super().__init__(**kwargs)
        self.description = self.description.format(location_pid)


class InternalLocationNotFoundError(IlsException):
    """Raised when an internal location could not be found."""

    description = "Internal Location PID '{}' was not found"

    def __init__(self, internal_location_pid, **kwargs):
        """Initialize exception."""
        super().__init__(**kwargs)
        self.description = self.description.format(internal_location_pid)


class UnknownItemPidTypeError(IlsException):
    """Raised when the given item PID type is unknown."""

    description = "Unknown Item PID type '{}'"

    def __init__(self, pid_type, **kwargs):
        """Initialize exception."""
        super().__init__(**kwargs)
        self.description = self.description.format(pid_type)


class RecordRelationsError(IlsException):
    """Raised when an error occurs with related records."""

    def __init__(self, description):
        """Initialize exception."""
        super().__init__(description=description)


class OverdueLoansNotificationError(IlsException):
    """Raised when an error occurs with related records."""

    def __init__(self, description):
        """Initialize exception."""
        super().__init__(description=description)


class IlsValidationError(IlsException):
    """Raised when there is an error during record validation."""

    def __init__(self, errors, original_exception=None, **kwargs):
        """Initialize exception."""
        super().__init__(errors=errors, **kwargs)
        self.original_exception = original_exception


class DocumentRequestError(IlsException):
    """Raised when there is an error with a document request."""

    def __init__(self, description):
        """Initialize exception."""
        super().__init__(description=description)


class VocabularyError(IlsException):
    """Generic vocabulary exception."""

    def __init__(self, description):
        """Initialize exception."""
        super().__init__(description=description)


class StatsError(IlsException):
    """Generic stats exception."""

    def __init__(self, description):
        """Initialize exception."""
        super().__init__(description=description)


class InvalidLoanExtendError(IlsException):
    """Raised when loan cannot be extended."""

    description = "{}"

    def __init__(self, msg, **kwargs):
        """Initialize exception."""
        super().__init__(**kwargs)
        self.description = self.description.format(msg)


class AnonymizationActiveLoansError(IlsException):
    """Raised when anonymizing a patron with active loans."""

    description = "{}"

    def __init__(self, msg, **kwargs):
        """Initialize exception."""
        super().__init__(**kwargs)
        self.description = self.description.format(msg)


class ItemHasPastLoansError(IlsException):
    """Raised when an item cannot be updated due to past loans."""

    description = "{}"

    def __init__(self, msg, **kwargs):
        """Initialize exception."""
        super().__init__(**kwargs)
        self.description = self.description.format(msg)
