# -*- coding: utf-8 -*-
#
# Copyright (C) 2018 CERN.
# Copyright (C) 2018 RERO.
#
# Invenio-Circulation is free software; you can redistribute it and/or modify
# it under the terms of the MIT License; see LICENSE file for more details.

"""Invenio module for the circulation of bibliographic items."""

from __future__ import absolute_import, print_function

from copy import deepcopy

from flask import current_app
from werkzeug.utils import cached_property

from invenio_records_rest.utils import allow_all

from . import config
from .views import (
    backoffice_blueprint,
    main_blueprint,
    build_loan_request_blueprint,
)


class InvenioAppIls(object):
    """Invenio-Circulation extension."""

    def __init__(self, app=None):
        """Extension initialization."""
        if app:
            self.init_app(app)

    def init_app(self, app):
        """Flask application initialization."""
        self.init_config(app)
        _blueprint = build_loan_request_blueprint(app, main_blueprint)
        app.register_blueprint(_blueprint)
        app.register_blueprint(backoffice_blueprint)
        app.extensions["invenio-app-ils"] = self

    def init_config(self, app):
        """Initialize configuration."""
        for k in dir(config):
            if k.startswith("ILS_"):
                app.config.setdefault(k, getattr(config, k))
