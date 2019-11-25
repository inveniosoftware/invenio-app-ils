# -*- coding: utf-8 -*-
#
# Copyright (C) 2018 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""Acquisition PID providers."""

from invenio_pidstore.models import PIDStatus
from invenio_pidstore.providers.recordid import RecordIdProvider

from .pids import ORDER_PID_TYPE, VENDOR_PID_TYPE


class VendorIdProvider(RecordIdProvider):
    """Vendor identifier provider."""

    pid_type = VENDOR_PID_TYPE
    """Type of persistent identifier."""

    pid_provider = None
    """Provider name.

    The provider name is not recorded in the PID since the provider does not
    provide any additional features besides creation of record ids.
    """

    default_status = PIDStatus.REGISTERED
    """Record IDs are by default registered immediately."""


class OrderIdProvider(RecordIdProvider):
    """Acquisition order identifier provider."""

    pid_type = ORDER_PID_TYPE
    """Type of persistent identifier."""

    pid_provider = None
    """Provider name.

    The provider name is not recorded in the PID since the provider does not
    provide any additional features besides creation of record ids.
    """

    default_status = PIDStatus.REGISTERED
    """Record IDs are by default registered immediately."""
