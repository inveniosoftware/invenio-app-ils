# -*- coding: utf-8 -*-
#
# Copyright (C) 2019 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""ILL PID providers."""

from invenio_pidstore.models import PIDStatus
from invenio_pidstore.providers.recordid_v2 import RecordIdProviderV2

from .pids import BORROWING_REQUEST_PID_TYPE, LIBRARY_PID_TYPE


class LibraryIdProvider(RecordIdProviderV2):
    """Library identifier provider."""

    pid_type = LIBRARY_PID_TYPE
    pid_provider = None
    default_status = PIDStatus.REGISTERED


class BorrowingRequestIdProvider(RecordIdProviderV2):
    """Borrowing Request identifier provider."""

    pid_type = BORROWING_REQUEST_PID_TYPE
    pid_provider = None
    default_status = PIDStatus.REGISTERED
