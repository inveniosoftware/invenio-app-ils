# -*- coding: utf-8 -*-
#
# Copyright (C) 2019 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""ILS PID relation nodes."""

from invenio_pidrelations.api import PIDNodeOrdered


class PIDNodeRelated(PIDNodeOrdered):
    """PID Node for related records in ILS."""
