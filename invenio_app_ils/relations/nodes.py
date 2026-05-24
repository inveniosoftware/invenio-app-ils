# SPDX-FileCopyrightText: 2019 CERN.
# SPDX-License-Identifier: MIT

"""ILS PID relation nodes."""

from invenio_pidrelations.api import PIDNodeOrdered


class PIDNodeRelated(PIDNodeOrdered):
    """PID Node for related records in ILS."""
