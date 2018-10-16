# -*- coding: utf-8 -*-
#
# Copyright (C) 2018 CERN.
#
# Invenio-Circulation is free software; you can redistribute it and/or modify
# it under the terms of the MIT License; see LICENSE file for more details.

"""Invenio module for the circulation of bibliographic items."""

from __future__ import absolute_import, print_function

from . import config
from .circulation.receivers import register_circulation_signals


class InvenioAppIlsUI(object):
    """Invenio App ILS UI app."""

    def __init__(self, app=None):
        """Extension initialization."""
        if app:
            self._init_app(app)

    def _init_app(self, app):
        """Flask application initialization."""
        self._init_config(app)
        app.extensions['invenio-app-ils-ui'] = self

    def _init_config(self, app):
        """Initialize configuration."""
        for k in dir(config):
            if k.startswith('ILS_'):
                app.config.setdefault(k, getattr(config, k))


class InvenioAppIlsREST(object):
    """Invenio App ILS REST API app."""

    def __init__(self, app=None):
        """Extension initialization."""
        if app:
            self.app = app
            self._init_app(app)

    def _init_app(self, app):
        """Flask application initialization."""
        self._init_config(app)
        app.extensions['invenio-app-ils-rest'] = self
        self._register_signals()

    def _init_config(self, app):
        """Initialize configuration."""
        for k in dir(config):
            if k.startswith("ILS_"):
                app.config.setdefault(k, getattr(config, k))

    def _register_signals(self):
        """Register signals."""
        register_circulation_signals(self.app)
