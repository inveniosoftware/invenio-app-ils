# -*- coding: utf-8 -*-
#
# Copyright (C) 2019-2020 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify
# it under the terms of the MIT License; see LICENSE file for more details.

"""Invenio acquisition module for Integrated Library System app."""

from flask import current_app
from invenio_rest.errors import RESTException
from werkzeug.utils import cached_property

from invenio_app_ils.ext import handle_rest_exceptions

from . import config
from .api import ORDER_PID_TYPE, VENDOR_PID_TYPE


class _InvenioIlsAcquisitionState(object):
    """Invenio ILS acquisition app."""

    def __init__(self, app):
        """Initialize state."""
        self.app = app

    def record_class_by_pid_type(self, pid_type):
        """Return a record class by pid type."""
        endpoints = current_app.config.get("RECORDS_REST_ENDPOINTS", [])
        return endpoints[pid_type]["record_class"]

    def search_class_by_pid_type(self, pid_type):
        """Return a search class by pid type."""
        endpoints = current_app.config.get("RECORDS_REST_ENDPOINTS", [])
        return endpoints[pid_type]["search_class"]

    def indexer_by_pid_type(self, pid_type):
        """Return an indexer instance by pid type."""
        endpoints = current_app.config.get("RECORDS_REST_ENDPOINTS", [])
        return endpoints[pid_type]["indexer_class"]()

    @cached_property
    def order_record_cls(self):
        """Return the Order record class."""
        return self.record_class_by_pid_type(ORDER_PID_TYPE)

    @cached_property
    def vendor_record_cls(self):
        """Return the Vendor record class."""
        return self.record_class_by_pid_type(VENDOR_PID_TYPE)

    @cached_property
    def order_indexer(self):
        """Return an Order indexer instance."""
        return self.indexer_by_pid_type(ORDER_PID_TYPE)

    @cached_property
    def vendor_indexer(self):
        """Return a Vendor indexer instance."""
        return self.indexer_by_pid_type(VENDOR_PID_TYPE)

    @cached_property
    def order_search_cls(self):
        """Return the Order search class."""
        return self.search_class_by_pid_type(ORDER_PID_TYPE)

    @cached_property
    def vendor_search_cls(self):
        """Return the Vendor search class."""
        return self.search_class_by_pid_type(VENDOR_PID_TYPE)


class InvenioIlsAcquisition(object):
    """Invenio ILS Acquisition app."""

    def __init__(self, app=None):
        """Extension initialization."""
        if app:
            self.app = app
            self.init_app(app)
            app.errorhandler(RESTException)(handle_rest_exceptions)

    def init_app(self, app):
        """Flask application initialization."""
        self.init_config(app)
        app.extensions["invenio-ils-acq"] = _InvenioIlsAcquisitionState(app)

    def init_config(self, app):
        """Initialize configuration."""
        acq_endpoints = getattr(config, "RECORDS_REST_ENDPOINTS")
        app.config.setdefault("RECORDS_REST_ENDPOINTS", {})
        app.config["RECORDS_REST_ENDPOINTS"].update(acq_endpoints)

        acq_sort_options = getattr(config, "RECORDS_REST_SORT_OPTIONS")
        app.config.setdefault("RECORDS_REST_SORT_OPTIONS", {})
        app.config["RECORDS_REST_SORT_OPTIONS"].update(acq_sort_options)

        acq_facets = getattr(config, "RECORDS_REST_FACETS")
        app.config.setdefault("RECORDS_REST_FACETS", {})
        app.config["RECORDS_REST_FACETS"].update(acq_facets)

        for k in dir(config):
            if k.startswith("ILS_ACQ_"):
                app.config.setdefault(k, getattr(config, k))
