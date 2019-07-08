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
from invenio_pidrelations.config import RelationType
from invenio_records_rest.facets import terms_filter
from invenio_records_rest.utils import deny_all

from .api import can_item_circulate, document_exists, \
    get_document_pid_by_item_pid, get_item_pids_by_document_pid, \
    get_location_pid_by_item_pid, item_exists, patron_exists
from .circulation.search import IlsLoansSearch
from .facets import keyed_range_filter
from .jwt import ils_jwt_create_token
from .records.resolver.loan import item_resolver

from .indexer import (  # isort:skip
    DocumentIndexer,
    ItemIndexer,
    EItemIndexer,
    KeywordIndexer,
    LoanIndexer,
    LocationIndexer,
    SeriesIndexer,
)
from .records.api import (  # isort:skip
    Document,
    Item,
    EItem,
    Keyword,
    Location,
    InternalLocation,
    Series,
)
from .records.permissions import (  # isort:skip
    record_create_permission_factory,
    record_delete_permission_factory,
    record_read_permission_factory,
    record_update_permission_factory,
)

from .search.api import (  # isort:skip
    DocumentSearch,
    ItemSearch,
    EItemSearch,
    KeywordSearch,
    LocationSearch,
    InternalLocationSearch,
    SeriesSearch,
    PatronsSearch
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
    circulation_is_loan_duration_valid,
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
    EITEM_PID_FETCHER,
    EITEM_PID_MINTER,
    EITEM_PID_TYPE,
    KEYWORD_PID_TYPE,
    KEYWORD_PID_MINTER,
    KEYWORD_PID_FETCHER,
    LOCATION_PID_FETCHER,
    LOCATION_PID_MINTER,
    LOCATION_PID_TYPE,
    SERIES_PID_FETCHER,
    SERIES_PID_MINTER,
    SERIES_PID_TYPE,
    PATRON_PID_FETCHER,
    PATRON_PID_MINTER,
    PATRON_PID_TYPE,
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
_PITMID_CONVERTER = (
    'pid(pitmid, record_class="invenio_app_ils.records.api:Item")'
)
_EITMID_CONVERTER = (
    'pid(eitmid, record_class="invenio_app_ils.records.api:EItem")'
)
_LOCID_CONVERTER = (
    'pid(locid, record_class="invenio_app_ils.records.api:Location")'
)
_ILOCID_CONVERTER = (
    'pid(ilocid, record_class="invenio_app_ils.records.api:InternalLocation")'
)
_KEYID_CONVERTER = (
    'pid(keyid, record_class="invenio_app_ils.records.api:Keyword")'
)
_SERID_CONVERTER = (
    'pid(serid, record_class="invenio_app_ils.records.api:Series")'
)

# RECORDS REST
# ============
_RECORDS_REST_MAX_RESULT_WINDOW = 10000

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
        max_result_window=_RECORDS_REST_MAX_RESULT_WINDOW,
        error_handlers=dict(),
        read_permission_factory_imp=record_read_permission_factory,
        create_permission_factory_imp=record_create_permission_factory,
        update_permission_factory_imp=record_update_permission_factory,
        delete_permission_factory_imp=record_delete_permission_factory,
    ),
    pitmid=dict(
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
                "invenio_app_ils.records.serializers:item_v1_response"
            ),
        },
        search_serializers={
            "application/json": (
                "invenio_app_ils.records.serializers:item_v1_search"
            )
        },
        list_route="/items/",
        item_route="/items/<{0}:pid_value>".format(_PITMID_CONVERTER),
        default_media_type="application/json",
        max_result_window=_RECORDS_REST_MAX_RESULT_WINDOW,
        error_handlers=dict(),
        read_permission_factory_imp=record_read_permission_factory,
        create_permission_factory_imp=record_create_permission_factory,
        update_permission_factory_imp=record_update_permission_factory,
        delete_permission_factory_imp=record_delete_permission_factory,
    ),
    eitmid=dict(
        pid_type=EITEM_PID_TYPE,
        pid_minter=EITEM_PID_MINTER,
        pid_fetcher=EITEM_PID_FETCHER,
        search_class=EItemSearch,
        record_class=EItem,
        indexer_class=EItemIndexer,
        record_loaders={
            "application/json": (
                "invenio_app_ils.records.loaders:eitem_loader"
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
        list_route="/eitems/",
        item_route="/eitems/<{0}:pid_value>".format(_EITMID_CONVERTER),
        default_media_type="application/json",
        max_result_window=_RECORDS_REST_MAX_RESULT_WINDOW,
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
        indexer_class=LocationIndexer,
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
        max_result_window=_RECORDS_REST_MAX_RESULT_WINDOW,
        error_handlers=dict(),
        read_permission_factory_imp=record_read_permission_factory,
        create_permission_factory_imp=record_create_permission_factory,
        update_permission_factory_imp=record_update_permission_factory,
        delete_permission_factory_imp=record_delete_permission_factory,
    ),
    serid=dict(
        pid_type=SERIES_PID_TYPE,
        pid_minter=SERIES_PID_MINTER,
        pid_fetcher=SERIES_PID_FETCHER,
        search_class=SeriesSearch,
        record_class=Series,
        indexer_class=SeriesIndexer,
        record_loaders={
            "application/json": (
                "invenio_app_ils.records.loaders:series_loader"
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
        list_route="/series/",
        item_route="/series/<{0}:pid_value>".format(
            _SERID_CONVERTER
        ),
        default_media_type="application/json",
        max_result_window=_RECORDS_REST_MAX_RESULT_WINDOW,
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
        max_result_window=_RECORDS_REST_MAX_RESULT_WINDOW,
        error_handlers=dict(),
        read_permission_factory_imp=record_read_permission_factory,
        create_permission_factory_imp=record_create_permission_factory,
        update_permission_factory_imp=record_update_permission_factory,
        delete_permission_factory_imp=record_delete_permission_factory,
    ),
    patid=dict(
        pid_type=PATRON_PID_TYPE,
        pid_minter=PATRON_PID_MINTER,
        pid_fetcher=PATRON_PID_FETCHER,
        search_class=PatronsSearch,
        record_serializers={
            'application/json': ('invenio_records_rest.serializers'
                                 ':json_v1_response'),
        },
        search_serializers={
            "application/json": (
                "invenio_records_rest.serializers:json_v1_search"
            )
        },
        item_route='/patrons/<pid({}):pid_value>'.format(PATRON_PID_TYPE),
        list_route="/patrons/",
        default_media_type="application/json",
        max_result_window=_RECORDS_REST_MAX_RESULT_WINDOW,
        error_handlers=dict(),
        list_permission_factory_imp=backoffice_permission,
        read_permission_factory_imp=deny_all,
        create_permission_factory_imp=deny_all,
        update_permission_factory_imp=deny_all,
        delete_permission_factory_imp=deny_all,
    ),
    keyid=dict(
        pid_type=KEYWORD_PID_TYPE,
        pid_minter=KEYWORD_PID_MINTER,
        pid_fetcher=KEYWORD_PID_FETCHER,
        search_class=KeywordSearch,
        record_class=Keyword,
        indexer_class=KeywordIndexer,
        record_serializers={
            'application/json': ('invenio_records_rest.serializers'
                                 ':json_v1_response'),
        },
        search_serializers={
            "application/json": (
                "invenio_records_rest.serializers:json_v1_search"
            )
        },
        item_route="/keywords/<{0}:pid_value>".format(
            _KEYID_CONVERTER
        ),
        list_route="/keywords/",
        default_media_type="application/json",
        max_result_window=_RECORDS_REST_MAX_RESULT_WINDOW,
        error_handlers=dict(),
        list_permission_factory_imp=backoffice_permission,
        read_permission_factory_imp=record_read_permission_factory,
        create_permission_factory_imp=record_create_permission_factory,
        update_permission_factory_imp=record_update_permission_factory,
        delete_permission_factory_imp=backoffice_permission,
    ),
)

# CIRCULATION
# ===========
CIRCULATION_ITEMS_RETRIEVER_FROM_DOCUMENT = get_item_pids_by_document_pid

CIRCULATION_DOCUMENT_RETRIEVER_FROM_ITEM = get_document_pid_by_item_pid

CIRCULATION_PATRON_EXISTS = patron_exists

CIRCULATION_ITEM_EXISTS = item_exists

CIRCULATION_DOCUMENT_EXISTS = document_exists

CIRCULATION_ITEM_LOCATION_RETRIEVER = get_location_pid_by_item_pid

CIRCULATION_POLICIES = dict(
    checkout=dict(
        duration_default=circulation_default_loan_duration,
        duration_validate=circulation_is_loan_duration_valid,
        item_can_circulate=can_item_circulate,
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
        search_class=IlsLoansSearch,
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
        max_result_window=_RECORDS_REST_MAX_RESULT_WINDOW,
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
    documents=dict(  # DocumentSearch.Meta.index
        mostrecent=dict(
            fields=['_updated'],
            title='Newest',
            default_order='asc',
            order=1
        ),
        bestmatch=dict(
            fields=['-_score'],
            title='Best match',
            default_order='asc',
            order=2
        ),
        available_items=dict(
            fields=['circulation.has_items_for_loan'],
            title='Available Items',
            default_order='desc',
            order=3
        ),
        mostloaned=dict(
            fields=['circulation.number_of_past_loans'],
            title='Most loaned',
            default_order='desc',
            order=4
        )
    ),
    eitems=dict(  # ItemSearch.Meta.index
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
    loans=dict(  # IlsLoansSearch.Meta.index
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
    series=dict(  # SeriesSearch.Meta.index
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
#: Number of keywords to display in the DocumentsSearch facet
FACET_KEYWORD_LIMIT = 5

RECORDS_REST_FACETS = dict(
    documents=dict(  # DocumentSearch.Meta.index
        aggs=dict(
            keywords=dict(
                terms=dict(field="keywords.name", size=FACET_KEYWORD_LIMIT),
            ),
            languages=dict(
                terms=dict(field="languages")
            ),
            document_types=dict(
                terms=dict(field="document_types")
            ),
            moi=dict(
                terms=dict(field="series.mode_of_issuance")
            ),
            has_items=dict(
                range=dict(
                    field="circulation.has_items",
                    ranges=[
                        {"key": "printed versions", "from": 1},
                    ]
                ),
            ),
            has_eitems=dict(
                range=dict(
                    field="circulation.has_eitems",
                    ranges=[
                        {"key": "electronic versions", "from": 1},
                    ]
                )
            ),
            has_items_for_loan=dict(
                range=dict(
                    field="circulation.has_items_for_loan",
                    ranges=[
                        {"key": "printed versions available", "from": 1},
                    ],
                )
            ),
        ),
        filters=dict(
            document_types=terms_filter("document_types"),
            languages=terms_filter("languages"),
            keywords=terms_filter("keywords.name"),
            has_items=keyed_range_filter(
                "circulation.has_items",
                {
                    "printed versions": {"gt": 0},
                },
            ),
            has_eitems=keyed_range_filter(
                "circulation.has_eitems",
                {
                    "electronic versions": {"gt": 0},
                },
            ),
            has_items_for_loan=keyed_range_filter(
                "circulation.has_items_for_loan",
                {
                    "printed versions available": {"gt": 0},
                },
            ),
        ),
        post_filters=dict(
            moi=terms_filter("series.mode_of_issuance"),
        ),
    ),
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
                terms=dict(field="circulation_status.state",
                           missing="N/A",
                           ),
            ),
        ),
        filters=dict(
            status=terms_filter('status'),
            medium=terms_filter('medium'),
            # name=terms_filter('internal_location.name'),
            circulation_status=terms_filter('circulation_status.state'),
        )
    ),
    loans=dict(  # IlsLoansSearch.Meta.index
        aggs=dict(
            state=dict(
                terms=dict(field="state"),
            ),
        ),
        filters=dict(
            state=terms_filter('state'),
        )
    ),
    series=dict(  # SeriesSearch.Meta.index
        aggs=dict(
            moi=dict(
                terms=dict(field="mode_of_issuance")
            ),
            keywords=dict(
                terms=dict(field="keywords.name", size=FACET_KEYWORD_LIMIT),
            ),
            languages=dict(
                terms=dict(field='languages')
            ),
        ),
        filters=dict(
            languages=terms_filter('languages'),
            keywords=terms_filter("keywords.name"),
        ),
        post_filters=dict(
            moi=terms_filter("mode_of_issuance"),
        ),
    ),
)

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
                "alwaysShow": ["title", "abstracts", "authors", "series_objs"],
                "properties": {
                    "$schema": {"hidden": True},
                    "document_pid": {"hidden": True},
                    "circulation": {"hidden": True},
                    "keywords": {"hidden": True},
                    "series": {"hidden": True},
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
    "series": {
        "recordConfig": {
            "apiUrl": "api/series/",
            "schema": "series/series-v1.0.0.json",
        },
        "editorConfig": {
            "schemaOptions": {
                "alwaysShow": [
                    "mode_of_issuance",
                    "title",
                    "abstracts",
                    "authors"
                ],
                "properties": {
                    "$schema": {"hidden": True},
                    "series_pid": {"hidden": True},
                    "keywords": {"hidden": True},
                },
            },
        },
    },
    "eitems": {
        "recordConfig": {
            "apiUrl": "api/eitems/",
            "schema": "eitems/eitem-v1.0.0.json",
        },
        "editorConfig": {
            "schemaOptions": {
                "alwaysShow": [
                    "description",
                    "document_pid",
                    "internal_notes",
                    "open_access",
                    "urls",
                ],
                "properties": {
                    "$schema": {"hidden": True},
                    "eitem_pid": {"hidden": True},
                    "document": {"hidden": True},
                },
            },
        },
    },
    "keywords": {
        "recordConfig": {
            "apiUrl": "api/keywords/",
            "schema": "keywords/keyword-v1.0.0.json",
        },
        "editorConfig": {
            "schemaOptions": {
                "alwaysShow": [
                    "name",
                    "provenance"
                ],
                "properties": {
                    "$schema": {"hidden": True},
                    "keyword_pid": {"hidden": True},
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

# PID Relations
# ==============
LANGUAGE_RELATION = RelationType(
    0, "language", "Language",
    "invenio_app_ils.records.related.nodes:PIDNodeRelated",
    "invenio_pidrelations.serializers.schemas.RelationSchema"
)
EDITION_RELATION = RelationType(
    1, "edition", "Edition",
    "invenio_app_ils.records.related.nodes:PIDNodeRelated",
    "invenio_pidrelations.serializers.schemas.RelationSchema"
)
OTHER_RELATION = RelationType(
    2, "other", "Other",
    "invenio_app_ils.records.related.nodes:PIDNodeRelated",
    "invenio_pidrelations.serializers.schemas.RelationSchema"
)

PIDRELATIONS_RELATION_TYPES = [
    LANGUAGE_RELATION,
    EDITION_RELATION,
    OTHER_RELATION,
]
