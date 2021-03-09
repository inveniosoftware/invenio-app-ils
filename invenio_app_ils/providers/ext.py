# -*- coding: utf-8 -*-
#
# Copyright (C) 2019-2021 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify
# it under the terms of the MIT License; see LICENSE file for more details.

"""Invenio providers module for Integrated Library System app."""

from flask import current_app
from invenio_rest.errors import RESTException
from werkzeug.utils import cached_property

from invenio_app_ils.ext import handle_rest_exceptions

from . import config
from .api import PROVIDER_PID_TYPE


class _InvenioIlsProvidersState(object):
    """Invenio ILS providers app."""

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
    def provider_record_cls(self):
        """Return the Provider record class."""
        return self.record_class_by_pid_type(PROVIDER_PID_TYPE)

    @cached_property
    def provider_indexer(self):
        """Return a Provider indexer instance."""
        return self.indexer_by_pid_type(PROVIDER_PID_TYPE)

    @cached_property
    def provider_search_cls(self):
        """Return the Provider search class."""
        return self.search_class_by_pid_type(PROVIDER_PID_TYPE)


class InvenioIlsProviders(object):
    """Invenio ILS Providers app."""

    def __init__(self, app=None):
        """Extension initialization."""
        if app:
            self.app = app
            self.init_app(app)
            app.errorhandler(RESTException)(handle_rest_exceptions)

    def init_app(self, app):
        """Flask application initialization."""
        self.init_config(app)
        app.extensions["invenio-ils-prov"] = _InvenioIlsProvidersState(app)

    def init_config(self, app):
        """Initialize configuration."""
        prov_endpoints = getattr(config, "RECORDS_REST_ENDPOINTS")
        app.config.setdefault("RECORDS_REST_ENDPOINTS", {})
        app.config["RECORDS_REST_ENDPOINTS"].update(prov_endpoints)

        prov_sort_options = getattr(config, "RECORDS_REST_SORT_OPTIONS")
        app.config.setdefault("RECORDS_REST_SORT_OPTIONS", {})
        app.config["RECORDS_REST_SORT_OPTIONS"].update(prov_sort_options)

        prov_facets = getattr(config, "RECORDS_REST_FACETS")
        app.config.setdefault("RECORDS_REST_FACETS", {})
        app.config["RECORDS_REST_FACETS"].update(prov_facets)

        for k in dir(config):
            if k.startswith("ILS_PROV_"):
                app.config.setdefault(k, getattr(config, k))
