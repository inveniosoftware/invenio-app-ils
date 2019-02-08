# -*- coding: utf-8 -*-
#
# Copyright (C) 2018 CERN.
#
# Invenio-Circulation is free software; you can redistribute it and/or modify
# it under the terms of the MIT License; see LICENSE file for more details.

"""Invenio module for the circulation of bibliographic items."""

from __future__ import absolute_import, print_function

from flask import Blueprint
from invenio_indexer.api import RecordIndexer
from werkzeug.utils import cached_property

from . import config
from .circulation.receivers import register_circulation_signals
from .pidstore.pids import DOCUMENT_PID_TYPE, ITEM_PID_TYPE


class _InvenioAppIlsState(object):
    """Invenio App ILS app."""

    def __init__(self, app):
        """Initialize state."""
        self.app = app

    @cached_property
    def document_indexer(self):
        """Return a document indexer instance."""
        endpoints = self.app.config.get('RECORDS_REST_ENDPOINTS', [])
        pid_type = DOCUMENT_PID_TYPE
        _cls = endpoints.get(pid_type, {}).get('indexer_class', RecordIndexer)
        return _cls()

    @cached_property
    def item_indexer(self):
        """Return an item indexer instance."""
        endpoints = self.app.config.get('RECORDS_REST_ENDPOINTS', [])
        pid_type = ITEM_PID_TYPE
        _cls = endpoints.get(pid_type, {}).get('indexer_class', RecordIndexer)
        return _cls()

    @cached_property
    def loan_indexer(self):
        """Return a loan indexer instance."""
        endpoints = self.app.config.get('RECORDS_REST_ENDPOINTS', [])
        pid_type = DOCUMENT_PID_TYPE
        _cls = endpoints.get(pid_type, {}).get('indexer_class', RecordIndexer)
        return _cls()


class InvenioAppIls(object):
    """Invenio App ILS UI app."""

    def __init__(self, app=None):
        """Extension initialization."""
        if app:
            self.app = app
            self.init_app(app)

    def init_app(self, app):
        """Flask application initialization."""
        self.init_config(app)
        app.extensions['invenio-app-ils'] = _InvenioAppIlsState(app)
        app.register_blueprint(
            Blueprint(
                "invenio_app_ils_mail",
                __name__,
                template_folder="templates"
            )
        )

    def init_config(self, app):
        """Initialize configuration."""
        for k in dir(config):
            if k.startswith('ILS_'):
                app.config.setdefault(k, getattr(config, k))


class InvenioAppIlsUI(InvenioAppIls):
    """Invenio App ILS UI app."""


class InvenioAppIlsREST(InvenioAppIls):
    """Invenio App ILS REST API app."""

    def init_app(self, app):
        """Flask application initialization."""
        super(InvenioAppIlsREST, self).init_app(app)
        self._register_signals()

    def _register_signals(self):
        """Register signals."""
        register_circulation_signals()
