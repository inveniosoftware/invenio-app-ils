# -*- coding: utf-8 -*-
#
# Copyright (C) 2018 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""Circulation PID providers."""

from invenio_pidstore.models import PIDStatus
from invenio_pidstore.providers.recordid_v2 import RecordIdProviderV2

from .pids import (  # isort:skip
    EITEM_PID_TYPE,
    INTERNAL_LOCATION_PID_TYPE,
    ITEM_PID_TYPE,
    LOCATION_PID_TYPE,
    SERIES_PID_TYPE,
)


class ItemIdProvider(RecordIdProviderV2):
    """Item identifier provider."""

    pid_type = ITEM_PID_TYPE
    """Type of persistent identifier."""

    pid_provider = None
    """Provider name.

    The provider name is not recorded in the PID since the provider does not
    provide any additional features besides creation of record ids.
    """

    default_status = PIDStatus.REGISTERED
    """Record IDs are by default registered immediately."""


class EItemIdProvider(RecordIdProviderV2):
    """EItem identifier provider."""

    pid_type = EITEM_PID_TYPE
    """Type of persistent identifier."""

    pid_provider = None
    """Provider name.

    The provider name is not recorded in the PID since the provider does not
    provide any additional features besides creation of record ids.
    """

    default_status = PIDStatus.REGISTERED
    """Record IDs are by default registered immediately."""


class LocationIdProvider(RecordIdProviderV2):
    """Location identifier provider."""

    pid_type = LOCATION_PID_TYPE
    """Type of persistent identifier."""

    pid_provider = None
    """Provider name.

    The provider name is not recorded in the PID since the provider does not
    provide any additional features besides creation of record ids.
    """

    default_status = PIDStatus.REGISTERED
    """Record IDs are by default registered immediately."""


class InternalLocationIdProvider(RecordIdProviderV2):
    """Internal Location identifier provider."""

    pid_type = INTERNAL_LOCATION_PID_TYPE
    """Type of persistent identifier."""

    pid_provider = None
    """Provider name.

    The provider name is not recorded in the PID since the provider does not
    provide any additional features besides creation of record ids.
    """

    default_status = PIDStatus.REGISTERED
    """Record IDs are by default registered immediately."""


class SeriesIdProvider(RecordIdProviderV2):
    """Series identifier provider."""

    pid_type = SERIES_PID_TYPE
    """Type of persistent identifier."""

    pid_provider = None
    """Provider name.

    The provider name is not recorded in the PID since the provider does not
    provide any additional features besides creation of record ids.
    """

    default_status = PIDStatus.REGISTERED
    """Record IDs are by default registered immediately."""
