# -*- coding: utf-8 -*-
#
# Copyright (C) 2018 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify
# it under the terms of the MIT License; see LICENSE file for more details.

"""Helper proxy to the state object."""

from flask import current_app
from werkzeug.local import LocalProxy

current_app_ils = LocalProxy(lambda: current_app.extensions["invenio-app-ils"])
"""Helper proxy to get the current App ILS extension."""
