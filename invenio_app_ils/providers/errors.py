# -*- coding: utf-8 -*-
#
# Copyright (C) 2021 CERN.
#
# Invenio-App-Ils is free software; you can redistribute it and/or modify
# it under the terms of the MIT License; see LICENSE file for more details.

"""Provider exceptions."""

from invenio_app_ils.errors import IlsException


class ProviderNotFoundError(IlsException):
    """Raised when a provider cannot not be found."""

    description = "Provider PID '{}' was not found"

    def __init__(self, provider_pid, **kwargs):
        """Initialize exception."""
        self.description = self.description.format(provider_pid)
        super().__init__(description=self.description)
