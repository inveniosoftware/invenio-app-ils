# SPDX-FileCopyrightText: 2021 CERN.
# SPDX-License-Identifier: MIT

"""Provider exceptions."""

from invenio_app_ils.errors import IlsException


class ProviderNotFoundError(IlsException):
    """Raised when a provider cannot not be found."""

    description = "Provider PID '{}' was not found"

    def __init__(self, provider_pid, **kwargs):
        """Initialize exception."""
        self.description = self.description.format(provider_pid)
        super().__init__(description=self.description)
