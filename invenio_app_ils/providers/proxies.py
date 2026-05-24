# SPDX-FileCopyrightText: 2021 CERN.
# SPDX-License-Identifier: MIT

"""Helper proxy to the state object."""

from flask import current_app
from werkzeug.local import LocalProxy

current_ils_prov = LocalProxy(lambda: current_app.extensions["invenio-ils-prov"])
"""Helper proxy to get the current ILS Providers extension."""
