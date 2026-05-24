# SPDX-FileCopyrightText: 2019 CERN.
# SPDX-License-Identifier: MIT

"""Helper proxy to the state object."""

from flask import current_app
from werkzeug.local import LocalProxy

current_ils_acq = LocalProxy(lambda: current_app.extensions["invenio-ils-acq"])
"""Helper proxy to get the current ILS Acquisition extension."""
