# -*- coding: utf-8 -*-
#
# Copyright (C) 2019-2020 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify
# it under the terms of the MIT License; see LICENSE file for more details.

"""Invenio ILL module for Integrated Library System app."""

from __future__ import absolute_import, print_function

from flask import current_app
from werkzeug.utils import cached_property

from . import config
from .api import BORROWING_REQUEST_PID_TYPE, LIBRARY_PID_TYPE


def handle_rest_exceptions(exception):
    """Handle Invenio REST exceptions."""
    current_app.logger.exception(exception)
    return exception.get_response()


class _InvenioIlsIllState(object):
    """Invenio ILS ILL app."""

    def __init__(self, app):
        """Initialize state."""
        self.app = app

    def record_class_by_pid_type(self, pid_type):
        endpoints = self.app.config.get('RECORDS_REST_ENDPOINTS', [])
        return endpoints[pid_type]['record_class']

    def search_by_pid_type(self, pid_type):
        endpoints = self.app.config.get("RECORDS_REST_ENDPOINTS", [])
        return endpoints[pid_type]["search_class"]

    def indexer_by_pid_type(self, pid_type):
        endpoints = self.app.config.get("RECORDS_REST_ENDPOINTS", [])
        return endpoints[pid_type]["indexer_class"]

    @cached_property
    def borrowing_request_record_cls(self):
        """Return the BorrowingRequest record class."""
        return self.record_class_by_pid_type(BORROWING_REQUEST_PID_TYPE)

    @cached_property
    def borrowing_request_search_cls(self):
        """Return an BorrowingRequest search instance."""
        return self.search_by_pid_type(BORROWING_REQUEST_PID_TYPE)

    @cached_property
    def borrowing_request_indexer_cls(self):
        """Return a Borrowing Request indexer instance."""
        return self.indexer_by_pid_type(BORROWING_REQUEST_PID_TYPE)

    @cached_property
    def library_record_cls(self):
        """Return the Library record class."""
        return self.record_class_by_pid_type(LIBRARY_PID_TYPE)


class InvenioIlsIll(object):
    """Invenio ILS ILL app."""

    def __init__(self, app=None):
        """Extension initialization."""
        if app:
            self.app = app
            self.init_app(app)

    def init_app(self, app):
        """Flask application initialization."""
        self.init_config(app)
        app.extensions["invenio-ils-ill"] = _InvenioIlsIllState(app)

    def init_config(self, app):
        """Initialize configuration."""
        ill_endpoints = getattr(config, "RECORDS_REST_ENDPOINTS")
        app.config.setdefault("RECORDS_REST_ENDPOINTS", {})
        app.config["RECORDS_REST_ENDPOINTS"].update(ill_endpoints)

        for k in dir(config):
            if k.startswith("ILS_ILL_"):
                app.config.setdefault(k, getattr(config, k))
