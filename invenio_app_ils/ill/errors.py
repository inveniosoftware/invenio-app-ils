# -*- coding: utf-8 -*-
#
# Copyright (C) 2020 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""Invenio App ILS ILL errors."""

from invenio_app_ils.errors import IlsException


class ILLError(IlsException):
    """Raised when there is an error with an InterLibrary Loan."""

    def __init__(self, description):
        """Initialize exception."""
        super().__init__(description=description)
