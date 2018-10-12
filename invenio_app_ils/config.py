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

from invenio_app.config import APP_DEFAULT_SECURE_HEADERS
from invenio_records_rest.utils import allow_all

from .api import Document, Item, Location
from .search import DocumentSearch, ItemSearch, LocationSearch

from invenio_circulation.config import (  # isort:skip
    _CIRCULATION_LOAN_FETCHER,
    _CIRCULATION_LOAN_MINTER,
    _CIRCULATION_LOAN_PID_TYPE,
    CIRCULATION_POLICIES,
    _Loan_PID,
)
from invenio_circulation.transitions.transitions import (  # isort:skip
    CreatedToItemOnLoan,
    CreatedToPending,
    ItemAtDeskToItemOnLoan,
    ItemInTransitHouseToItemReturned,
    ItemOnLoanToItemInTransitHouse,
    ItemOnLoanToItemOnLoan,
    ItemOnLoanToItemReturned,
    PendingToItemAtDesk,
    PendingToItemInTransitPickup,
)

from .circulation.utils import (  # isort:skip
    circulation_document_retriever,
    circulation_is_item_available,
    circulation_item_exists,
    circulation_item_location_retriever,
    circulation_items_retriever,
    circulation_patron_exists,
)
from .permissions import (  # isort:skip
    allow_librarians,
    loan_owner,
    login_required,
    views_permissions_factory,
)


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
THEME_FRONTPAGE_TEMPLATE = "invenio_app_ils/main.html"

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
SQLALCHEMY_DATABASE_URI = "postgresql+psycopg2://test:psw@localhost/ils"

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
APP_DEFAULT_SECURE_HEADERS['content_security_policy'] = {}
# OAI-PMH
# =======
OAISERVER_ID_PREFIX = "oai:invenio_app_ils.com:"

###############################################################################
# Debug
###############################################################################
DEBUG = True
DEBUG_TB_ENABLED = True
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
        error_handlers=dict(),
        create_permission_factory_imp=allow_all,
    ),
)

# Allow all GET requests
RECORDS_REST_DEFAULT_READ_PERMISSION_FACTORY = allow_all

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

CIRCULATION_LOAN_TRANSITIONS = {
    "CREATED": [
        dict(
            dest="PENDING",
            trigger="request",
            transition=CreatedToPending,
            permission_factory=login_required,
        ),
        dict(
            dest="ITEM_ON_LOAN",
            trigger="checkout",
            transition=CreatedToItemOnLoan,
            permission_factory=allow_librarians,
        ),
    ],
    "PENDING": [
        dict(
            dest="ITEM_AT_DESK",
            transition=PendingToItemAtDesk,
            permission_factory=allow_librarians,
        ),
        dict(
            dest="ITEM_IN_TRANSIT_FOR_PICKUP",
            transition=PendingToItemInTransitPickup,
            permission_factory=allow_librarians,
        ),
        dict(
            dest="CANCELLED",
            trigger="cancel",
            permission_factory=allow_librarians,
        ),
    ],
    "ITEM_AT_DESK": [
        dict(
            dest="ITEM_ON_LOAN",
            transition=ItemAtDeskToItemOnLoan,
            permission_factory=allow_librarians,
        ),
        dict(
            dest="CANCELLED",
            trigger="cancel",
            permission_factory=allow_librarians,
        ),
    ],
    "ITEM_IN_TRANSIT_FOR_PICKUP": [
        dict(dest="ITEM_AT_DESK", permission_factory=allow_librarians),
        dict(
            dest="CANCELLED",
            trigger="cancel",
            permission_factory=allow_librarians,
        ),
    ],
    "ITEM_ON_LOAN": [
        dict(
            dest="ITEM_RETURNED",
            transition=ItemOnLoanToItemReturned,
            permission_factory=allow_librarians,
        ),
        dict(
            dest="ITEM_IN_TRANSIT_TO_HOUSE",
            transition=ItemOnLoanToItemInTransitHouse,
            permission_factory=allow_librarians,
        ),
        dict(
            dest="ITEM_ON_LOAN",
            transition=ItemOnLoanToItemOnLoan,
            trigger="extend",
            permission_factory=allow_librarians,
        ),
        dict(
            dest="CANCELLED",
            trigger="cancel",
            permission_factory=allow_librarians,
        ),
    ],
    "ITEM_IN_TRANSIT_TO_HOUSE": [
        dict(
            dest="ITEM_RETURNED",
            transition=ItemInTransitHouseToItemReturned,
            permission_factory=allow_librarians,
        ),
        dict(
            dest="CANCELLED",
            trigger="cancel",
            permission_factory=allow_librarians,
        ),
    ],
    "ITEM_RETURNED": [],
    "CANCELLED": [],
}

CIRCULATION_REST_ENDPOINTS = dict(
    loanid=dict(
        pid_type=_CIRCULATION_LOAN_PID_TYPE,
        pid_minter=_CIRCULATION_LOAN_MINTER,
        pid_fetcher=_CIRCULATION_LOAN_FETCHER,
        search_class="invenio_app_ils.circulation.search:IlsLoansSearch",
        search_factory_imp="invenio_app_ils.circulation.search"
        ":circulation_search_factory",
        record_class="invenio_circulation.api:Loan",
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
        list_route="/circulation/loans/",
        item_route="/circulation/loans/<{0}:pid_value>".format(_Loan_PID),
        default_media_type="application/json",
        links_factory_imp="invenio_circulation.links:loan_links_factory",
        max_result_window=10000,
        error_handlers=dict(),
        read_permission_factory_imp=loan_owner,
        create_permission_factory_imp=allow_librarians,
        update_permission_factory_imp=allow_librarians,
        delete_permission_factory_imp=allow_librarians,
        list_permission_factory_imp=login_required,
    )
)

# ILS
# ===
ILS_VIEWS_PERMISSIONS_FACTORY = views_permissions_factory
"""Permissions factory for ILS views to handle all ILS actions."""

# Records Editor
# ==============
RECORDS_EDITOR_URL_PREFIX = '/editor'
"""Default URL we want to serve our editor application, i.e /editor."""
