# SPDX-FileCopyrightText: 2018 CERN.
# SPDX-License-Identifier: MIT

"""Helper proxy to the state object."""

from flask import current_app
from werkzeug.local import LocalProxy

current_app_ils = LocalProxy(lambda: current_app.extensions["invenio-app-ils"])
"""Helper proxy to get the current App ILS extension."""
