# -*- coding: utf-8 -*-
#
# Copyright (C) 2018 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""Default configuration for invenio-app-ils.

You overwrite and set instance-specific configuration by either:

- Configuration file: ``<virtualenv prefix>/var/instance/invenio.cfg``
- Environment variables: ``APP_<variable name>``
"""

from __future__ import absolute_import, print_function

import os
from datetime import timedelta

from invenio_indexer.api import RecordIndexer
from invenio_records_rest.utils import allow_all

from .api import Document, Item, Location
from .circulation.utils import (
    circulation_document_retriever,
    circulation_is_item_available,
    circulation_item_exists,
    circulation_item_location_retriever,
    circulation_items_retriever,
    circulation_patron_exists,
)
from .search import DocumentSearch, ItemSearch, LocationSearch


def _(x):
    """Identity function used to trigger string extraction."""
    return x


# Rate limiting
# =============
#: Storage for ratelimiter.
RATELIMIT_STORAGE_URL = "redis://localhost:6379/3"

# I18N
# ====
#: Default language
BABEL_DEFAULT_LANGUAGE = "en"
#: Default time zone
BABEL_DEFAULT_TIMEZONE = "Europe/Zurich"
#: Other supported languages (do not include the default language in list).
I18N_LANGUAGES = [
    # ('fr', _('French'))
]

# Base templates
# ==============
#: Global base template.
BASE_TEMPLATE = "invenio_theme/page.html"
#: Cover page base template (used for e.g. login/sign-up).
COVER_TEMPLATE = "invenio_theme/page_cover.html"
#: Footer base template.
FOOTER_TEMPLATE = "invenio_theme/footer.html"
#: Header base template.
HEADER_TEMPLATE = "invenio_theme/header.html"
#: Settings base template.
SETTINGS_TEMPLATE = "invenio_theme/page_settings.html"

# Theme configuration
# ===================
#: Site name
THEME_SITENAME = _("invenio-app-ils")
#: Use default frontpage.
THEME_FRONTPAGE = True
#: Frontpage title.
THEME_FRONTPAGE_TITLE = _("invenio-app-ils")
#: Frontpage template.
THEME_FRONTPAGE_TEMPLATE = "invenio_app_ils/frontpage.html"

# Email configuration
# ===================
#: Email address for support.
SUPPORT_EMAIL = "info@inveniosoftware.org"
#: Disable email sending by default.
MAIL_SUPPRESS_SEND = True

# Assets
# ======
#: Static files collection method (defaults to copying files).
COLLECT_STORAGE = "flask_collect.storage.file"

# Accounts
# ========
#: Email address used as sender of account registration emails.
SECURITY_EMAIL_SENDER = SUPPORT_EMAIL
#: Email subject for account registration emails.
SECURITY_EMAIL_SUBJECT_REGISTER = _("Welcome to invenio-app-ils!")
#: Redis session storage URL.
ACCOUNTS_SESSION_REDIS_URL = "redis://localhost:6379/1"

# Celery configuration
# ====================

BROKER_URL = "amqp://guest:guest@localhost:5672/"
#: URL of message broker for Celery (default is RabbitMQ).
CELERY_BROKER_URL = "amqp://guest:guest@localhost:5672/"
#: URL of backend for result storage (default is Redis).
CELERY_RESULT_BACKEND = "redis://localhost:6379/2"
#: Scheduled tasks configuration (aka cronjobs).
CELERY_BEAT_SCHEDULE = {
    "indexer": {
        "task": "invenio_indexer.tasks.process_bulk_queue",
        "schedule": timedelta(minutes=5),
    },
    "accounts": {
        "task": "invenio_accounts.tasks.clean_session_table",
        "schedule": timedelta(minutes=60),
    },
}

# Database
# ========
#: Database URI including user and password
SQLALCHEMY_DATABASE_URI = "postgresql+psycopg2://invenio_app_ils:invenio_app_ils@localhost/invenio_app_ils"

# JSONSchemas
# ===========
#: Hostname used in URLs for local JSONSchemas.
JSONSCHEMAS_HOST = os.environ.get("JSONSCHEMAS_HOST", "localhost:5000")

# Flask configuration
# ===================
# See details on
# http://flask.pocoo.org/docs/0.12/config/#builtin-configuration-values

#: Secret key - each installation (dev, production, ...) needs a separate key.
#: It should be changed before deploying.
SECRET_KEY = "CHANGE_ME"
#: Max upload size for form data via application/mulitpart-formdata.
MAX_CONTENT_LENGTH = 100 * 1024 * 1024  # 100 MiB
#: Sets cookie with the secure flag by default
SESSION_COOKIE_SECURE = True
#: Since HAProxy and Nginx route all requests no matter the host header
#: provided, the allowed hosts variable is set to localhost. In production it
#: should be set to the correct host and it is strongly recommended to only
#: route correct hosts to the application.
APP_ALLOWED_HOSTS = ["localhost", "127.0.0.1"]

# OAI-PMH
# =======
OAISERVER_ID_PREFIX = "oai:invenio_app_ils.com:"

# Debug
# =====
# Flask-DebugToolbar is by default enabled when the application is running in
# debug mode. More configuration options are available at
# https://flask-debugtoolbar.readthedocs.io/en/latest/#configuration

#: Switches off incept of redirects by Flask-DebugToolbar.
DEBUG_TB_INTERCEPT_REDIRECTS = False

# PID
# ===
_DOCUMENT_PID_TYPE = "docid"
_ITEM_PID_TYPE = "itemid"
_LOCATION_PID_TYPE = "locid"

_DOCUMENT_PID = 'pid(docid, record_class="invenio_app_ils.api:Document")'
_ITEM_PID = 'pid(itemid, record_class="invenio_app_ils.api:Item")'
_LOCATION_PID = 'pid(locid, record_class="invenio_app_ils.api:Location")'
# RECORDS REST
# ============
RECORDS_REST_ENDPOINTS = dict(
    docid=dict(
        pid_type=_DOCUMENT_PID_TYPE,
        pid_minter="document_pid_minter",
        pid_fetcher="document_pid_fetcher",
        search_class=DocumentSearch,
        record_class=Document,
        record_serializers={
            "application/json": (
                "invenio_records_rest.serializers" ":json_v1_response"
            )
        },
        search_serializers={
            "application/json": (
                "invenio_records_rest.serializers" ":json_v1_search"
            )
        },
        list_route="/documents/",
        item_route="/documents/<{0}:pid_value>".format(_DOCUMENT_PID),
        default_media_type="application/json",
        indexer_class=RecordIndexer,
        max_result_window=10000,
        error_handlers=dict(),
        create_permission_factory_imp=allow_all,
        update_permission_factory_imp=allow_all,
    ),
    itemid=dict(
        pid_type=_ITEM_PID_TYPE,
        pid_minter="item_pid_minter",
        pid_fetcher="item_pid_fetcher",
        search_class=ItemSearch,
        record_class=Item,
        record_serializers={
            "application/json": (
                "invenio_records_rest.serializers" ":json_v1_response"
            )
        },
        search_serializers={
            "application/json": (
                "invenio_records_rest.serializers" ":json_v1_search"
            )
        },
        list_route="/items/",
        item_route="/items/<{0}:pid_value>".format(_ITEM_PID),
        default_media_type="application/json",
        max_result_window=10000,
        indexer_class=RecordIndexer,
        error_handlers=dict(),
        create_permission_factory_imp=allow_all,
        delete_permission_factory_imp=allow_all,
    ),
    locid=dict(
        pid_type=_LOCATION_PID_TYPE,
        pid_minter="location_pid_minter",
        pid_fetcher="location_pid_fetcher",
        search_class=LocationSearch,
        record_class=Location,
        record_serializers={
            "application/json": (
                "invenio_records_rest.serializers" ":json_v1_response"
            )
        },
        search_serializers={
            "application/json": (
                "invenio_records_rest.serializers" ":json_v1_search"
            )
        },
        list_route="/locations/",
        item_route="/locations/<{0}:pid_value>".format(_LOCATION_PID),
        default_media_type="application/json",
        max_result_window=10000,
        indexer_class=RecordIndexer,
        error_handlers=dict(),
        create_permission_factory_imp=allow_all,
    ),
)

# RECORDS UI
# ==========
RECORDS_UI_ENDPOINTS = {
    "docid": {
        "pid_type": _DOCUMENT_PID_TYPE,
        "route": "/documents/<pid_value>",
        "template": "invenio_records_ui/detail.html",
    },
    "docid_export": {
        "pid_type": _DOCUMENT_PID_TYPE,
        "route": "/documents/<pid_value>/export/<format>",
        "view_imp": "invenio_records_ui.views.export",
        "template": "invenio_records_ui/export.html",
    },
    "itemid": {
        "pid_type": _ITEM_PID_TYPE,
        "route": "/items/<pid_value>",
        "template": "invenio_records_ui/detail.html",
    },
    "itemid_export": {
        "pid_type": _ITEM_PID_TYPE,
        "route": "/items/<pid_value>/export/<format>",
        "view_imp": "invenio_records_ui.views.export",
        "template": "invenio_records_ui/export.html",
    },
    "locid": {
        "pid_type": _LOCATION_PID_TYPE,
        "route": "/locations/<pid_value>",
        "template": "invenio_records_ui/detail.html",
    },
    "locid_export": {
        "pid_type": _LOCATION_PID_TYPE,
        "route": "/locations/<pid_value>/export/<format>",
        "view_imp": "invenio_records_ui.views.export",
        "template": "invenio_records_ui/export.html",
    },
}

# SEARCH UI
# =========
SEARCH_UI_SEARCH_API = "/api/documents/"

SEARCH_UI_SEARCH_INDEX = "documents"


# CIRCULATION
# ===========
CIRCULATION_ITEMS_RETRIEVER_FROM_DOCUMENT = circulation_items_retriever
CIRCULATION_DOCUMENT_RETRIEVER_FROM_ITEM = circulation_document_retriever
CIRCULATION_PATRON_EXISTS = circulation_patron_exists
CIRCULATION_ITEM_EXISTS = circulation_item_exists
CIRCULATION_ITEM_LOCATION_RETRIEVER = circulation_item_location_retriever
CIRCULATION_POLICIES["checkout"][
    "item_available"
] = circulation_is_item_available
