# -*- coding: utf-8 -*-
#
# Copyright (C) 2018-2020 CERN.
#
# Invenio-Circulation is free software; you can redistribute it and/or modify
# it under the terms of the MIT License; see LICENSE file for more details.

"""Invenio module for the circulation of bibliographic items."""

from __future__ import absolute_import, print_function

import logging

from flask import Blueprint, current_app
from invenio_rest.errors import RESTException
from werkzeug.utils import cached_property

from . import config
from .circulation import config as circulation_config
from .circulation.receivers import register_circulation_signals
from .document_requests.api import DOCUMENT_REQUEST_PID_TYPE
from .documents.api import DOCUMENT_PID_TYPE
from .files.receivers import register_files_signals
from .pidstore.pids import EITEM_PID_TYPE, INTERNAL_LOCATION_PID_TYPE, \
    ITEM_PID_TYPE, LOCATION_PID_TYPE, PATRON_PID_TYPE, SERIES_PID_TYPE


def handle_rest_exceptions(exception):
    """Handle Invenio REST exceptions."""
    current_app.logger.exception(exception)
    return exception.get_response()


class _InvenioAppIlsState(object):
    """Invenio App ILS app."""

    def __init__(self, app):
        """Initialize state."""
        self.app = app

    def record_class_by_pid_type(self, pid_type):
        endpoints = current_app.config.get("RECORDS_REST_ENDPOINTS", {})
        return endpoints[pid_type]["record_class"]

    def indexer_by_pid_type(self, pid_type):
        endpoints = current_app.config.get("RECORDS_REST_ENDPOINTS", {})
        _cls = endpoints[pid_type]["indexer_class"]
        return _cls()

    def search_by_pid_type(self, pid_type):
        endpoints = current_app.config.get("RECORDS_REST_ENDPOINTS", {})
        return endpoints[pid_type]["search_class"]

    @cached_property
    def document_request_record_cls(self):
        """Return the document request record class."""
        return self.record_class_by_pid_type(DOCUMENT_REQUEST_PID_TYPE)

    @cached_property
    def document_request_search_cls(self):
        """Return the document request search cls."""
        return self.search_by_pid_type(DOCUMENT_REQUEST_PID_TYPE)

    @cached_property
    def document_request_indexer(self):
        """Return a document request indexer instance."""
        return self.indexer_by_pid_type(DOCUMENT_REQUEST_PID_TYPE)

    @cached_property
    def document_record_cls(self):
        """Return the document record class."""
        return self.record_class_by_pid_type(DOCUMENT_PID_TYPE)

    @cached_property
    def document_search_cls(self):
        """Return the document search cls."""
        return self.search_by_pid_type(DOCUMENT_PID_TYPE)

    @cached_property
    def document_indexer(self):
        """Return a document indexer instance."""
        return self.indexer_by_pid_type(DOCUMENT_PID_TYPE)

    @cached_property
    def eitem_record_cls(self):
        """Return the eitem record class."""
        return self.record_class_by_pid_type(EITEM_PID_TYPE)

    @cached_property
    def eitem_search_cls(self):
        """Return the eitem search cls."""
        return self.search_by_pid_type(EITEM_PID_TYPE)

    @cached_property
    def eitem_indexer(self):
        """Return an eitem indexer instance."""
        return self.indexer_by_pid_type(EITEM_PID_TYPE)

    @cached_property
    def internal_location_record_cls(self):
        """Return the internal location record class."""
        return self.record_class_by_pid_type(INTERNAL_LOCATION_PID_TYPE)

    @cached_property
    def internal_location_search_cls(self):
        """Return the internal location search cls."""
        return self.search_by_pid_type(INTERNAL_LOCATION_PID_TYPE)

    @cached_property
    def internal_location_indexer(self):
        """Return an internal location indexer instance."""
        return self.indexer_by_pid_type(INTERNAL_LOCATION_PID_TYPE)

    @cached_property
    def location_record_cls(self):
        """Return the location record class."""
        return self.record_class_by_pid_type(LOCATION_PID_TYPE)

    @cached_property
    def location_search_cls(self):
        """Return the location search cls."""
        return self.search_by_pid_type(LOCATION_PID_TYPE)

    @cached_property
    def location_indexer(self):
        """Return the location indexer instance."""
        return self.indexer_by_pid_type(LOCATION_PID_TYPE)

    @cached_property
    def item_record_cls(self):
        """Return the item record class."""
        return self.record_class_by_pid_type(ITEM_PID_TYPE)

    @cached_property
    def item_search_cls(self):
        """Return the item search cls."""
        return self.search_by_pid_type(ITEM_PID_TYPE)

    @cached_property
    def item_indexer(self):
        """Return an item indexer instance."""
        return self.indexer_by_pid_type(ITEM_PID_TYPE)

    @cached_property
    def patron_cls(self):
        """Return the patron record class."""
        return self.record_class_by_pid_type(PATRON_PID_TYPE)

    @cached_property
    def series_record_cls(self):
        """Return the series record class."""
        return self.record_class_by_pid_type(SERIES_PID_TYPE)

    @cached_property
    def series_search_cls(self):
        """Return the series search cls."""
        return self.search_by_pid_type(SERIES_PID_TYPE)

    @cached_property
    def series_indexer(self):
        """Return a series indexer instance."""
        return self.indexer_by_pid_type(SERIES_PID_TYPE)


class InvenioAppIls(object):
    """Invenio App ILS UI app."""

    def __init__(self, app=None):
        """Extension initialization."""
        if app:
            self.app = app
            self.init_app(app)

    def init_app(self, app):
        """Flask application initialization."""
        self.update_config_records_rest(app)
        app.extensions["invenio-app-ils"] = _InvenioAppIlsState(app)
        app.register_blueprint(
            Blueprint(
                "invenio_app_ils",
                __name__,
                static_folder="static",
                template_folder="templates",
            )
        )
        # disable warnings being logged to Sentry
        logging.getLogger("py.warnings").propagate = False

    def update_config_records_rest(self, app):
        """Merge overridden circ records rest into global records rest."""
        for k in dir(circulation_config):
            if k.startswith("ILS_CIRCULATION_RECORDS_REST_"):
                records_rest = k.replace("ILS_CIRCULATION_", "")
                app.config[records_rest].update(getattr(circulation_config, k))


class InvenioAppIlsUI(InvenioAppIls):
    """Invenio App ILS UI app."""


class InvenioAppIlsREST(InvenioAppIls):
    """Invenio App ILS REST API app."""

    def init_app(self, app):
        """Flask application initialization."""
        super(InvenioAppIlsREST, self).init_app(app)
        self._register_signals()
        app.errorhandler(RESTException)(handle_rest_exceptions)

    def _register_signals(self):
        """Register signals."""
        register_circulation_signals()
        register_files_signals()
