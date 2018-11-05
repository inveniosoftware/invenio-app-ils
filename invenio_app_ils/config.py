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

from datetime import timedelta

from invenio_app.config import APP_DEFAULT_SECURE_HEADERS
from invenio_circulation.search.api import LoansSearch

from .records.api import Document, InternalLocation, Item, Location
from .records.permissions import record_create_permission_factory, \
    record_delete_permission_factory, record_read_permission_factory, \
    record_update_permission_factory
from .search.api import DocumentSearch, InternalLocationSearch, ItemSearch, \
    LocationSearch

from invenio_circulation.config import (  # isort:skip
    CIRCULATION_POLICIES,
    _LOANID_CONVERTER,
)
from invenio_circulation.pidstore.pids import (  # isort:skip
    CIRCULATION_LOAN_FETCHER,
    CIRCULATION_LOAN_MINTER,
    CIRCULATION_LOAN_PID_TYPE
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
    authenticated_user_permission,
    backoffice_permission,
    LoanOwnerPermission,
    views_permissions_factory,
)
from .pidstore.pids import (  # isort:skip
    DOCUMENT_PID_FETCHER,
    DOCUMENT_PID_MINTER,
    DOCUMENT_PID_TYPE,
    INTERNAL_LOCATION_PID_FETCHER,
    INTERNAL_LOCATION_PID_MINTER,
    INTERNAL_LOCATION_PID_TYPE,
    ITEM_PID_FETCHER,
    ITEM_PID_MINTER,
    ITEM_PID_TYPE,
    LOCATION_PID_FETCHER,
    LOCATION_PID_MINTER,
    LOCATION_PID_TYPE
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
JSONSCHEMAS_HOST = "ils.mydomain.org"

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
OAISERVER_ID_PREFIX = "oai:invenio_app_ils.org:"

###############################################################################
# Debug
###############################################################################
DEBUG = True
DEBUG_TB_ENABLED = True
DEBUG_TB_INTERCEPT_REDIRECTS = False


_DOCID_CONVERTER = 'pid(docid, record_class="invenio_app_ils.records.api:Document")'
_ITEMID_CONVERTER = 'pid(itemid, record_class="invenio_app_ils.records.api:Item")'
_LOCID_CONVERTER = 'pid(locid, record_class="invenio_app_ils.records.api:Location")'
_ILOCID_CONVERTER = 'pid(ilocid, record_class="invenio_app_ils.records.api:InternalLocation")'

# RECORDS REST
# ============
RECORDS_REST_ENDPOINTS = dict(
    docid=dict(
        pid_type=DOCUMENT_PID_TYPE,
        pid_minter=DOCUMENT_PID_MINTER,
        pid_fetcher=DOCUMENT_PID_FETCHER,
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
        item_route="/documents/<{0}:pid_value>".format(_DOCID_CONVERTER),
        default_media_type="application/json",
        max_result_window=10000,
        error_handlers=dict(),
        read_permission_factory_imp=record_read_permission_factory,
        create_permission_factory_imp=record_create_permission_factory,
        update_permission_factory_imp=record_update_permission_factory,
        delete_permission_factory_imp=record_delete_permission_factory,
    ),
    itemid=dict(
        pid_type=ITEM_PID_TYPE,
        pid_minter=ITEM_PID_MINTER,
        pid_fetcher=ITEM_PID_FETCHER,
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
        item_route="/items/<{0}:pid_value>".format(_ITEMID_CONVERTER),
        default_media_type="application/json",
        max_result_window=10000,
        error_handlers=dict(),
        read_permission_factory_imp=record_read_permission_factory,
        create_permission_factory_imp=record_create_permission_factory,
        update_permission_factory_imp=record_update_permission_factory,
        delete_permission_factory_imp=record_delete_permission_factory,
    ),
    locid=dict(
        pid_type=LOCATION_PID_TYPE,
        pid_minter=LOCATION_PID_MINTER,
        pid_fetcher=LOCATION_PID_FETCHER,
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
        item_route="/locations/<{0}:pid_value>".format(_LOCID_CONVERTER),
        default_media_type="application/json",
        max_result_window=10000,
        error_handlers=dict(),
        read_permission_factory_imp=record_read_permission_factory,
        create_permission_factory_imp=record_create_permission_factory,
        update_permission_factory_imp=record_update_permission_factory,
        delete_permission_factory_imp=record_delete_permission_factory,
    ),
    ilocid=dict(
        pid_type=INTERNAL_LOCATION_PID_TYPE,
        pid_minter=INTERNAL_LOCATION_PID_MINTER,
        pid_fetcher=INTERNAL_LOCATION_PID_FETCHER,
        search_class=InternalLocationSearch,
        record_class=InternalLocation,
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
        list_route="/internal-locations/",
        item_route="/internal-locations/<{0}:pid_value>".format(_ILOCID_CONVERTER),
        default_media_type="application/json",
        max_result_window=10000,
        error_handlers=dict(),
        read_permission_factory_imp=record_read_permission_factory,
        create_permission_factory_imp=record_create_permission_factory,
        update_permission_factory_imp=record_update_permission_factory,
        delete_permission_factory_imp=record_delete_permission_factory,
    ),
)

# RECORDS UI
# ==========
RECORDS_UI_ENDPOINTS = {
    "docid": {
        "pid_type": DOCUMENT_PID_TYPE,
        "route": "/documents/<pid_value>",
        "template": "invenio_records_ui/detail.html",
    },
    "docid_export": {
        "pid_type": DOCUMENT_PID_TYPE,
        "route": "/documents/<pid_value>/export/<format>",
        "view_imp": "invenio_records_ui.views.export",
        "template": "invenio_records_ui/export.html",
    },
    "itemid": {
        "pid_type": ITEM_PID_TYPE,
        "route": "/items/<pid_value>",
        "template": "invenio_records_ui/detail.html",
    },
    "itemid_export": {
        "pid_type": ITEM_PID_TYPE,
        "route": "/items/<pid_value>/export/<format>",
        "view_imp": "invenio_records_ui.views.export",
        "template": "invenio_records_ui/export.html",
    },
    "locid": {
        "pid_type": LOCATION_PID_TYPE,
        "route": "/locations/<pid_value>",
        "template": "invenio_records_ui/detail.html",
    },
    "locid_export": {
        "pid_type": LOCATION_PID_TYPE,
        "route": "/locations/<pid_value>/export/<format>",
        "view_imp": "invenio_records_ui.views.export",
        "template": "invenio_records_ui/export.html",
    },
    "ilocid": {
        "pid_type": INTERNAL_LOCATION_PID_TYPE,
        "route": "/internal-locations/<pid_value>",
        "template": "invenio_records_ui/detail.html",
    },
    "ilocid_export": {
        "pid_type": INTERNAL_LOCATION_PID_TYPE,
        "route": "/internal-locations/<pid_value>/export/<format>",
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
            permission_factory=authenticated_user_permission,
        ),
        dict(
            dest="ITEM_ON_LOAN",
            trigger="checkout",
            transition=CreatedToItemOnLoan,
            permission_factory=backoffice_permission,
        ),
    ],
    "PENDING": [
        dict(
            dest="ITEM_AT_DESK",
            transition=PendingToItemAtDesk,
            permission_factory=backoffice_permission,
        ),
        dict(
            dest="ITEM_IN_TRANSIT_FOR_PICKUP",
            transition=PendingToItemInTransitPickup,
            permission_factory=backoffice_permission,
        ),
        dict(
            dest="CANCELLED",
            trigger="cancel",
            permission_factory=backoffice_permission,
        ),
    ],
    "ITEM_AT_DESK": [
        dict(
            dest="ITEM_ON_LOAN",
            transition=ItemAtDeskToItemOnLoan,
            permission_factory=backoffice_permission,
        ),
        dict(
            dest="CANCELLED",
            trigger="cancel",
            permission_factory=backoffice_permission,
        ),
    ],
    "ITEM_IN_TRANSIT_FOR_PICKUP": [
        dict(dest="ITEM_AT_DESK", permission_factory=backoffice_permission),
        dict(
            dest="CANCELLED",
            trigger="cancel",
            permission_factory=backoffice_permission,
        ),
    ],
    "ITEM_ON_LOAN": [
        dict(
            dest="ITEM_RETURNED",
            transition=ItemOnLoanToItemReturned,
            permission_factory=backoffice_permission,
        ),
        dict(
            dest="ITEM_IN_TRANSIT_TO_HOUSE",
            transition=ItemOnLoanToItemInTransitHouse,
            permission_factory=backoffice_permission,
        ),
        dict(
            dest="ITEM_ON_LOAN",
            transition=ItemOnLoanToItemOnLoan,
            trigger="extend",
            permission_factory=backoffice_permission,
        ),
        dict(
            dest="CANCELLED",
            trigger="cancel",
            permission_factory=backoffice_permission,
        ),
    ],
    "ITEM_IN_TRANSIT_TO_HOUSE": [
        dict(
            dest="ITEM_RETURNED",
            transition=ItemInTransitHouseToItemReturned,
            permission_factory=backoffice_permission,
        ),
        dict(
            dest="CANCELLED",
            trigger="cancel",
            permission_factory=backoffice_permission,
        ),
    ],
    "ITEM_RETURNED": [],
    "CANCELLED": [],
}

CIRCULATION_REST_ENDPOINTS = dict(
    loanid=dict(
        pid_type=CIRCULATION_LOAN_PID_TYPE,
        pid_minter=CIRCULATION_LOAN_MINTER,
        pid_fetcher=CIRCULATION_LOAN_FETCHER,
        search_class=LoansSearch,
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
        item_route="/circulation/loans/<{0}:pid_value>".format(_LOANID_CONVERTER),
        default_media_type="application/json",
        links_factory_imp="invenio_circulation.links:loan_links_factory",
        max_result_window=10000,
        error_handlers=dict(),
        read_permission_factory_imp=LoanOwnerPermission,
        create_permission_factory_imp=backoffice_permission,
        update_permission_factory_imp=backoffice_permission,
        delete_permission_factory_imp=backoffice_permission,
        list_permission_factory_imp=authenticated_user_permission,
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
