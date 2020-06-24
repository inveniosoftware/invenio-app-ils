# -*- coding: utf-8 -*-
#
# Copyright (C) 2019 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify
# it under the terms of the MIT License; see LICENSE file for more details.

"""Helper proxy to the state object."""

from flask import current_app
from werkzeug.local import LocalProxy

current_ils_acq = LocalProxy(
    lambda: current_app.extensions["invenio-ils-acq"]
)
"""Helper proxy to get the current ILS Acquisition extension."""
