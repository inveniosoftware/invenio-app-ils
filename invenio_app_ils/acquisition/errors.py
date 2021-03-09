# -*- coding: utf-8 -*-
#
# Copyright (C) 2021 CERN.
#
# Invenio-App-Ils is free software; you can redistribute it and/or modify
# it under the terms of the MIT License; see LICENSE file for more details.

"""Acquisition exceptions."""

from invenio_app_ils.errors import IlsException


class AcquisitionError(IlsException):
    """Raised when there is an error with Acquisition."""

    def __init__(self, description):
        """Initialize exception."""
        super().__init__(description=description)
