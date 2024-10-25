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

    def get_body(self, environ=None, scope=None):
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
        self.record_id = record_id


class ItemCannotCirculateError(IlsException):
    """The item cannot circulate."""

    description = "This item cannot circulate."


class ItemHasActiveLoanError(IlsException):
    """The item which we are trying to update has an active loan."""

    description = (
        "Could not update item because it has an active loan with pid: {loan_pid}."
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

    code = 400
    description = "Patron '{0}' has already an active loan on item '{1}:{2}'"

    def __init__(self, patron_pid, item_pid, **kwargs):
        """Initialize PatronHasActiveLoanOnItem exception.

        :param loan_params: Loan request parameters.
        :param prop: Missing property from loan request.
        """
        super().__init__(**kwargs)
        self.patron_pid = patron_pid
        self.item_pid = item_pid
        self.description = self.description.format(
            patron_pid, item_pid["type"], item_pid["value"]
        )


class PatronHasRequestOnDocumentError(IlsException):
    """A patron already has a loan request on a document."""

    code = 400
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

    code = 400
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


class LoanCheckoutByPatronForbidden(IlsException):
    """A patron cannot checkout an item for another patron."""

    code = 403
    description = "Forbidden. Patron '{current_user_pid}' cannot checkout item for another Patron '{patron_pid}'."

    def __init__(self, patron_pid, current_user_pid, **kwargs):
        """Initialize LoanCheckoutByPatronForbidden exception."""
        super().__init__(**kwargs)
        self.description = self.description.format(
            patron_pid=patron_pid, current_user_pid=current_user_pid
        )


class LoanSelfCheckoutItemUnavailable(IlsException):
    """A patron cannot self-checkout an item."""

    code = 400
    description = "This literature is not available for self-checkout. Please contact the library for more information."

    def get_body(self, environ=None, scope=None):
        """Get the request body."""
        body = dict(
            status=self.code,
            message=self.get_description(environ),
        )

        if self.supportCode:
            body["supportCode"] = self.supportCode

        return json.dumps(body)


class LoanSelfCheckoutItemInvalidStatus(LoanSelfCheckoutItemUnavailable):
    """A patron cannot self-checkout an item that cannot circulate."""

    supportCode = "SELF-CHECKOUT-001"


class LoanSelfCheckoutDocumentOverbooked(LoanSelfCheckoutItemUnavailable):
    """A patron cannot self-checkout an item for an overbooked document."""

    supportCode = "SELF-CHECKOUT-002"


class LoanSelfCheckoutItemActiveLoan(LoanSelfCheckoutItemUnavailable):
    """A patron cannot self-checkout an item that cannot circulate."""

    supportCode = "SELF-CHECKOUT-003"


class LoanSelfCheckoutItemNotFound(LoanSelfCheckoutItemUnavailable):
    """A patron cannot self-checkout an item because item with provided barcode doesn't exist."""

    supportCode = "SELF-CHECKOUT-004"
    description = "Literature not found. Please try again with another barcode or contact the library."


class NotImplementedConfigurationError(IlsException):
    """Exception raised when function is not implemented."""

    code = 500
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

    code = 400


class InvalidParameterError(IlsException):
    """Exception raised when an invalid parameter is has been given."""

    code = 400


class DocumentNotFoundError(IlsException):
    """Raised when a document could not be found."""

    code = 404
    description = "Document PID '{}' was not found."

    def __init__(self, document_pid, **kwargs):
        """Initialize exception."""
        super().__init__(**kwargs)
        self.description = self.description.format(document_pid)


class ItemNotFoundError(IlsException):
    """Raised when an item could not be found."""

    code = 404
    description = "Item not found."

    def __init__(self, pid=None, barcode=None, **kwargs):
        """Initialize exception."""
        super().__init__(**kwargs)
        if pid:
            self.description += " PID: {}".format(pid)
        if barcode:
            self.description += " Barcode: {}".format(barcode)


class MultipleItemsBarcodeFoundError(IlsException):
    """Raised when multiple items with the same barcode has been found."""

    code = 500
    description = "Multiple items with barcode {} found."

    def __init__(self, barcode, **kwargs):
        """Initialize exception."""
        super().__init__(**kwargs)
        self.description = self.description.format(barcode)


class LocationNotFoundError(IlsException):
    """Raised when a location could not be found."""

    code = 404
    description = "Location PID '{}' was not found."

    def __init__(self, location_pid, **kwargs):
        """Initialize exception."""
        super().__init__(**kwargs)
        self.description = self.description.format(location_pid)


class InternalLocationNotFoundError(IlsException):
    """Raised when an internal location could not be found."""

    code = 404
    description = "Internal Location PID '{}' was not found."

    def __init__(self, internal_location_pid, **kwargs):
        """Initialize exception."""
        super().__init__(**kwargs)
        self.description = self.description.format(internal_location_pid)


class UnknownItemPidTypeError(IlsException):
    """Raised when the given item PID type is unknown."""

    code = 400
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


class DocumentOverbookedError(IlsException):
    """Raised when a document is overbooked."""

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
