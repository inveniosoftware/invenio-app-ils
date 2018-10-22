# -*- coding: utf-8 -*-
#
# Copyright (C) 2018 CERN.
#
# Invenio-Circulation is free software; you can redistribute it and/or modify
# it under the terms of the MIT License; see LICENSE file for more details.

"""Invenio module for the circulation of bibliographic items."""

from __future__ import absolute_import, print_function

from invenio_indexer.api import RecordIndexer
from werkzeug.utils import cached_property

from . import config
from .circulation.receivers import register_circulation_signals
from .pidstore.pids import ITEM_PID_TYPE


class _InvenioAppIlsState(object):
    """Invenio App ILS app."""

    def __init__(self, app):
        """Initialize state."""
        self.app = app

    @cached_property
    def item_indexer(self):
        """Return an Item indexer instance."""
        endpoints = self.app.config.get('RECORDS_REST_ENDPOINTS', [])
        pid_type = ITEM_PID_TYPE
        _cls = endpoints.get(pid_type, {}).get('indexer_class', RecordIndexer)
        return _cls()


class InvenioAppIlsUI(object):
    """Invenio App ILS UI app."""

    def __init__(self, app=None):
        """Extension initialization."""
        if app:
            self.app = app
            self._init_app(app)

    def _init_app(self, app):
        """Flask application initialization."""
        self._init_config(app)
        app.extensions['invenio-app-ils'] = _InvenioAppIlsState(app)

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
        app.extensions['invenio-app-ils'] = _InvenioAppIlsState(app)
        self._register_signals()

    def _init_config(self, app):
        """Initialize configuration."""
        for k in dir(config):
            if k.startswith("ILS_"):
                app.config.setdefault(k, getattr(config, k))

    def _register_signals(self):
        """Register signals."""
        register_circulation_signals(self.app)
