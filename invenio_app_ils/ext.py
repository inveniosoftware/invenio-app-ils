# -*- coding: utf-8 -*-
#
# Copyright (C) 2018-2020 CERN.
#
# Invenio-Circulation is free software; you can redistribute it and/or modify
# it under the terms of the MIT License; see LICENSE file for more details.

"""Invenio module for the circulation of bibliographic items."""

import logging

from flask import Blueprint, current_app
from invenio_indexer.signals import before_record_index
from invenio_rest.errors import RESTException
from werkzeug.utils import cached_property

from invenio_app_ils.records.metadata_extensions import (
    MetadataExtensions, add_es_metadata_extensions)

from .circulation import config as circulation_config
from .circulation.receivers import register_circulation_signals
from .document_requests.api import DOCUMENT_REQUEST_PID_TYPE
from .documents.api import DOCUMENT_PID_TYPE
from .eitems.api import EITEM_PID_TYPE
from .files.receivers import register_files_signals
from .internal_locations.api import INTERNAL_LOCATION_PID_TYPE
from .items.api import ITEM_PID_TYPE
from .locations.api import LOCATION_PID_TYPE
from .locations.receivers import register_location_signals
from .patrons.api import PATRON_PID_TYPE
from .series.api import SERIES_PID_TYPE


def handle_rest_exceptions(exception):
    """Handle Invenio REST exceptions."""
    current_app.logger.exception(exception)
    return exception.get_response()


class _InvenioAppIlsState(object):
    """Invenio App ILS app."""

    def __init__(self, app):
        """Initialize state."""
        self.app = app

    @cached_property
    def get_default_location_pid(self):
        """By default, return the record of the first location created."""
        from invenio_pidstore.models import PersistentIdentifier, PIDStatus

        pid = (
            PersistentIdentifier.query.filter_by(
                pid_type=LOCATION_PID_TYPE,
                object_type="rec",
                status=PIDStatus.REGISTERED,
            )
            .order_by(PersistentIdentifier.created.asc())
            .first()
        )
        if not pid:
            raise KeyError("There are no locations defined in the system.")
        return pid.pid_value, pid

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
    def patron_indexer(self):
        """Return the patron record class."""
        return self.indexer_by_pid_type(PATRON_PID_TYPE)

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
            self.init_metadata_extensions(app)

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
        app.register_blueprint(
            Blueprint(
                "invenio_app_ils_circulation_mail",
                __name__,
                template_folder="circulation/templates",
            )
        )
        # disable warnings being logged to Sentry
        logging.getLogger("py.warnings").propagate = False

    def init_metadata_extensions(self, app):
        """Metadata extensions initialization."""
        for rec_type in app.config["ILS_RECORDS_METADATA_EXTENSIONS"].keys():
            namespaces = app.config["ILS_RECORDS_METADATA_NAMESPACES"].get(
                rec_type, {}
            )
            extensions = app.config["ILS_RECORDS_METADATA_EXTENSIONS"].get(
                rec_type, {}
            )
            setattr(
                app.extensions["invenio-app-ils"],
                "{}_metadata_extensions".format(rec_type),
                MetadataExtensions(namespaces, extensions),
            )
            before_record_index.dynamic_connect(
                before_record_index_hook,
                sender=app,
                weak=False,
                index="{0}s-{0}-v1.0.0".format(rec_type),
            )

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
        super().init_app(app)
        self._register_signals(app)
        app.errorhandler(RESTException)(handle_rest_exceptions)

    def _register_signals(self, app):
        """Register signals."""
        register_circulation_signals()
        register_files_signals()
        if app.config["EXTEND_LOANS_LOCATION_UPDATED"]:
            register_location_signals()


def before_record_index_hook(
    sender, json=None, record=None, index=None, **kwargs
):
    """Hook to transform record before indexing in ES.

    :param sender: The entity sending the signal.
    :param json: The dumped Record dict which will be indexed.
    :param record: The correspondng Record object.
    :param index: The index in which the json will be indexed.
    :param kwargs: Any other parameters.
    """
    add_es_metadata_extensions(json)  # mutates json
