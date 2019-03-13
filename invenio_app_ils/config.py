# -*- coding: utf-8 -*-
#
# Copyright (C) 2018-2019 CERN.
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

from flask import request
from invenio_app.config import APP_DEFAULT_SECURE_HEADERS
from invenio_circulation.search.api import LoansSearch
from invenio_records_rest.facets import terms_filter

from .indexer import DocumentIndexer, ItemIndexer, LoanIndexer
from .jwt import ils_jwt_create_token
from .records.api import Document, InternalLocation, Item, Location
from .records.jsonresolver.loan import item_resolver

from .records.permissions import (  # isort:skip
    record_create_permission_factory,
    record_delete_permission_factory,
    record_read_permission_factory,
    record_update_permission_factory,
)

from .search.api import (  # isort:skip
    DocumentSearch,
    InternalLocationSearch,
    ItemSearch,
    LocationSearch,
)

from invenio_circulation.config import (  # isort:skip
    _LOANID_CONVERTER,
)
from invenio_circulation.pidstore.pids import (  # isort:skip
    CIRCULATION_LOAN_FETCHER,
    CIRCULATION_LOAN_MINTER,
    CIRCULATION_LOAN_PID_TYPE,
)
from invenio_circulation.transitions.transitions import (  # isort:skip
    ToItemOnLoan,
    CreatedToPending,
    ItemOnLoanToItemReturned,
    ItemOnLoanToItemOnLoan,
)

from .circulation.utils import (  # isort:skip
    circulation_default_extension_duration,
    circulation_default_extension_max_count,
    circulation_default_loan_duration,
    circulation_document_retriever,
    circulation_is_item_available,
    circulation_is_loan_duration_valid,
    circulation_item_exists,
    circulation_item_location_retriever,
    circulation_items_retriever,
    circulation_patron_exists,
    circulation_build_item_ref,
    circulation_can_be_requested,
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
    LOCATION_PID_TYPE,
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

# Email templates
# ===============
#: Loan status email templates
LOAN_MAIL_TEMPLATES = {}

# Email message loaders
# ===============
#: Loan message loader
LOAN_MSG_LOADER = "invenio_app_ils.circulation.mail.loader:loan_message_loader"

# Theme configuration
# ===================
THEME_FRONTPAGE = False

# Email configuration
# ===================
#: Email address for support.
SUPPORT_EMAIL = "info@inveniosoftware.org"
#: Disable email sending by default.
MAIL_SUPPRESS_SEND = True

# Notification configuration
# ==========================
#: Email address for email notification sender.
MAIL_NOTIFY_SENDER = "noreply@inveniosoftware.org"
#: Email CC address(es) for email notifications.
MAIL_NOTIFY_CC = []
#: Email BCC address(es) for email notification.
MAIL_NOTIFY_BCC = []

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
JSONSCHEMAS_HOST = "127.0.0.1:5000"

# CORS
# ====
REST_ENABLE_CORS = True
# change this only while developing
CORS_SEND_WILDCARD = True
CORS_SUPPORTS_CREDENTIALS = False

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
APP_DEFAULT_SECURE_HEADERS["content_security_policy"] = {}

# OAI-PMH
# =======
OAISERVER_ID_PREFIX = "oai:invenio_app_ils.org:"

###############################################################################
# Debug
###############################################################################
DEBUG = True
DEBUG_TB_ENABLED = True
DEBUG_TB_INTERCEPT_REDIRECTS = False


_DOCID_CONVERTER = (
    'pid(docid, record_class="invenio_app_ils.records.api:Document")'
)
_ITEMID_CONVERTER = (
    'pid(itemid, record_class="invenio_app_ils.records.api:Item")'
)
_LOCID_CONVERTER = (
    'pid(locid, record_class="invenio_app_ils.records.api:Location")'
)
_ILOCID_CONVERTER = (
    'pid(ilocid, record_class="invenio_app_ils.records.api:InternalLocation")'
)

# RECORDS REST
# ============
RECORDS_REST_ENDPOINTS = dict(
    docid=dict(
        pid_type=DOCUMENT_PID_TYPE,
        pid_minter=DOCUMENT_PID_MINTER,
        pid_fetcher=DOCUMENT_PID_FETCHER,
        search_class=DocumentSearch,
        record_class=Document,
        indexer_class=DocumentIndexer,
        record_loaders={
            "application/json": (
                "invenio_app_ils.records.loaders:document_loader"
            ),
            "application/json-patch+json": (
                lambda: request.get_json(force=True)
            ),
        },
        record_serializers={
            "application/json": (
                "invenio_app_ils.records.serializers:json_v1_response"
            ),
        },
        search_serializers={
            "application/json": (
                "invenio_records_rest.serializers:json_v1_search"
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
        indexer_class=ItemIndexer,
        record_loaders={
            "application/json": (
                "invenio_app_ils.records.loaders:item_loader"
            ),
            "application/json-patch+json": (
                lambda: request.get_json(force=True)
            ),
        },
        record_serializers={
            "application/json": (
                "invenio_app_ils.records.serializers:json_v1_response"
            ),
        },
        search_serializers={
            "application/json": (
                "invenio_records_rest.serializers:json_v1_search"
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
        record_loaders={
            "application/json": (
                "invenio_app_ils.records.loaders:location_loader"
            ),
            "application/json-patch+json": (
                lambda: request.get_json(force=True)
            ),
        },
        record_serializers={
            "application/json": (
                "invenio_app_ils.records.serializers:json_v1_response"
            ),
        },
        search_serializers={
            "application/json": (
                "invenio_records_rest.serializers:json_v1_search"
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
        record_loaders={
            "application/json": (
                "invenio_app_ils.records.loaders:internal_location_loader"
            ),
            "application/json-patch+json": (
                lambda: request.get_json(force=True)
            ),
        },
        record_serializers={
            "application/json": (
                "invenio_app_ils.records.serializers:json_v1_response"
            ),
        },
        search_serializers={
            "application/json": (
                "invenio_records_rest.serializers:json_v1_search"
            )
        },
        list_route="/internal-locations/",
        item_route="/internal-locations/<{0}:pid_value>".format(
            _ILOCID_CONVERTER
        ),
        default_media_type="application/json",
        max_result_window=10000,
        error_handlers=dict(),
        read_permission_factory_imp=record_read_permission_factory,
        create_permission_factory_imp=record_create_permission_factory,
        update_permission_factory_imp=record_update_permission_factory,
        delete_permission_factory_imp=record_delete_permission_factory,
    ),
)

# CIRCULATION
# ===========
CIRCULATION_ITEMS_RETRIEVER_FROM_DOCUMENT = circulation_items_retriever

CIRCULATION_DOCUMENT_RETRIEVER_FROM_ITEM = circulation_document_retriever

CIRCULATION_PATRON_EXISTS = circulation_patron_exists

CIRCULATION_ITEM_EXISTS = circulation_item_exists

CIRCULATION_ITEM_LOCATION_RETRIEVER = circulation_item_location_retriever

CIRCULATION_POLICIES = dict(
    checkout=dict(
        duration_default=circulation_default_loan_duration,
        duration_validate=circulation_is_loan_duration_valid,
        item_available=circulation_is_item_available
    ),
    extension=dict(
        from_end_date=True,
        duration_default=circulation_default_extension_duration,
        max_count=circulation_default_extension_max_count
    ),
    request=dict(
        can_be_requested=circulation_can_be_requested
    ),
)

CIRCULATION_ITEM_RESOLVING_PATH = \
    "/api/resolver/circulation/loans/<loan_pid>/item"

CIRCULATION_ITEM_RESOLVER_ENDPOINT = item_resolver

CIRCULATION_ITEM_REF_BUILDER = circulation_build_item_ref

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
            transition=ToItemOnLoan,
            permission_factory=backoffice_permission,
        ),
    ],
    "PENDING": [
        dict(
            dest="ITEM_ON_LOAN",
            trigger="checkout",
            transition=ToItemOnLoan,
            permission_factory=backoffice_permission,
        ),
        dict(
            dest="CANCELLED",
            trigger="cancel",
            permission_factory=backoffice_permission,
        ),
    ],
    "ITEM_ON_LOAN": [
        dict(
            dest="ITEM_RETURNED",
            trigger="checkin",
            transition=ItemOnLoanToItemReturned,
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
        indexer_class=LoanIndexer,
        record_serializers={
            "application/json": (
                "invenio_app_ils.records.serializers:json_v1_response"
            )
        },
        search_serializers={
            "application/json": (
                "invenio_records_rest.serializers:json_v1_search"
            )
        },
        list_route="/circulation/loans/",
        item_route="/circulation/loans/<{0}:pid_value>".format(
            _LOANID_CONVERTER
        ),
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

# RECORDS REST sort options
# =========================
RECORDS_REST_SORT_OPTIONS = dict(
    items=dict(  # ItemSearch.Meta.index
        bestmatch=dict(
            fields=['-_score'],
            title='Best match',
            default_order='asc',
            order=2
        ),
        mostrecent=dict(
            fields=['_updated'],
            title='Newest',
            default_order='asc',
            order=1
        )
    ),
    loans=dict(  # LoansSearch.Meta.index
        bestmatch=dict(
            fields=['-_score'],
            title='Best match',
            default_order='asc',
            order=2
        ),
        mostrecent=dict(
            fields=['_updated'],
            title='Newest',
            default_order='asc',
            order=1
        )
    ),
)

# RECORDS REST facets
# =========================
RECORDS_REST_FACETS = dict(
    items=dict(  # ItemSearch.Meta.index
        aggs=dict(
            status=dict(
                terms=dict(field="status"),
            ),
            medium=dict(
                terms=dict(field="medium"),
            ),
            # name=dict(
            #     terms=dict(field="internal_location.name"),
            # ),
            circulation_status=dict(
                terms=dict(field="circulation_status.state"),
            ),
        ),
        filters=dict(
            status=terms_filter('status'),
            medium=terms_filter('medium'),
            # name=terms_filter('internal_location.name'),
            circulation_status=terms_filter('circulation_status.state'),
        )
    ),
    loans=dict(  # LoansSearch.Meta.index
        aggs=dict(
            state=dict(
                terms=dict(field="state"),
            ),
        ),
        filters=dict(
            state=terms_filter('state'),
        )
    )
)

# PIDSTORE
# =========================
PIDSTORE_RECID_FIELD = Item.pid_field

# ILS
# ===
ILS_VIEWS_PERMISSIONS_FACTORY = views_permissions_factory
"""Permissions factory for ILS views to handle all ILS actions."""

ILS_INDEXER_TASK_DELAY = timedelta(seconds=5)
"""Time delay that indexers spawning their asynchronous celery tasks."""

# Records Editor
# ==============
RECORDS_EDITOR_URL_PREFIX = "/editor"
"""Default URL we want to serve our editor application, i.e /editor."""

RECORDS_EDITOR_UI_CONFIG = {
    "items": {
        "recordConfig": {
            "apiUrl": "api/items/",
            "schema": "items/item-v1.0.0.json",
        },
        "editorConfig": {
            "schemaOptions": {
                "alwaysShow": [
                    "legacy_id",
                    "shelf",
                    "description",
                    "circulation_restriction",
                    "medium",
                    "legacy_library_id",
                ],
                "properties": {
                    "$schema": {"hidden": True},
                    "item_pid": {"hidden": True},
                    "document": {"hidden": True},
                    "internal_location": {"hidden": True},
                    "circulation_status": {"hidden": True},
                },
            },
        },
    },
    "documents": {
        "recordConfig": {
            "apiUrl": "api/documents/",
            "schema": "documents/document-v1.0.0.json",
        },
        "editorConfig": {
            "schemaOptions": {
                "alwaysShow": ["title", "abstracts", "authors"],
                "properties": {
                    "$schema": {"hidden": True},
                    "document_pid": {"hidden": True},
                    "circulation": {"hidden": True},
                },
            },
        },
    },
    "locations": {
        "recordConfig": {
            "apiUrl": "api/locations/",
            "schema": "locations/location-v1.0.0.json",
        },
        "editorConfig": {
            "schemaOptions": {
                "alwaysShow": [
                    "name",
                    "address",
                    "email",
                    "phone",
                    "notes",
                ],
                "properties": {
                    "$schema": {"hidden": True},
                    "location_pid": {"hidden": True}
                },
            },
        },
    },
    "internal-locations": {
        "recordConfig": {
            "apiUrl": "api/internal-locations/",
            "schema": "internal_locations/internal_location-v1.0.0.json",
        },
        "editorConfig": {
            "schemaOptions": {
                "alwaysShow": [
                    "legacy_id",
                    "location_pid",
                    "name",
                    "physical_location",
                    "notes",
                ],
                "properties": {
                    "$schema": {"hidden": True},
                    "internal_location_pid": {"hidden": True},
                    "location": {"hidden": True},
                },
            },
        },
    },
}

# Accounts REST
# ==============
ACCOUNTS_REST_READ_USER_PROPERTIES_PERMISSION_FACTORY = backoffice_permission
"""Default read user properties permission factory: reject any request."""

ACCOUNTS_REST_UPDATE_USER_PROPERTIES_PERMISSION_FACTORY = backoffice_permission
"""Default modify user properties permission factory: reject any request."""

ACCOUNTS_REST_READ_USERS_LIST_PERMISSION_FACTORY = backoffice_permission
"""Default list users permission factory: reject any request."""

ACCOUNTS_JWT_CREATION_FACTORY = ils_jwt_create_token
"""ILS Jwt creation factory"""
