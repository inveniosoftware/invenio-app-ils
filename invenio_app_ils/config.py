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

from collections import namedtuple
from datetime import timedelta

from flask import request
from invenio_app.config import APP_DEFAULT_SECURE_HEADERS
from invenio_pidrelations.config import RelationType
from invenio_records_rest.facets import terms_filter
from invenio_records_rest.utils import deny_all
from invenio_stats.aggregations import StatAggregator
from invenio_stats.processors import EventsIndexer
from invenio_stats.queries import ESTermsQuery

from .acquisition.api import Order, Vendor
from .acquisition.search.api import OrderSearch, VendorSearch
from .circulation.search import IlsLoansSearch
from .facets import keyed_range_filter
from .records.resolver.loan import document_resolver, item_resolver, \
    loan_patron_resolver

from .acquisition.pidstore.pids import (  # isort:skip
    ORDER_PID_FETCHER,
    ORDER_PID_MINTER,
    ORDER_PID_TYPE,
    VENDOR_PID_FETCHER,
    VENDOR_PID_MINTER,
    VENDOR_PID_TYPE
)

from .api import (  # isort:skip
    can_item_circulate,
    document_exists,
    get_document_pid_by_item_pid,
    get_item_pids_by_document_pid,
    get_location_pid_by_item_pid,
    item_exists,
    patron_exists,
)

from invenio_circulation.config import _LOANID_CONVERTER  # isort:skip

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
    ToCancelled,
)

from .circulation.utils import (  # isort:skip
    circulation_default_extension_duration,
    circulation_default_extension_max_count,
    circulation_default_loan_duration,
    circulation_is_loan_duration_valid,
    circulation_build_item_ref,
    circulation_build_patron_ref,
    circulation_can_be_requested,
    circulation_build_document_ref)
from .indexer import (  # isort:skip
    DocumentIndexer,
    DocumentRequestIndexer,
    EItemIndexer,
    InternalLocationIndexer,
    ItemIndexer,
    LoanIndexer,
    LocationIndexer,
    SeriesIndexer,
    TagIndexer,
    VocabularyIndexer,
)
from .permissions import (  # isort:skip
    authenticated_user_permission,
    backoffice_permission,
    DocumentRequestOwnerPermission,
    LoanOwnerPermission,
    views_permissions_factory,
)
from .pidstore.pids import (  # isort:skip
    DOCUMENT_PID_FETCHER,
    DOCUMENT_PID_MINTER,
    DOCUMENT_PID_TYPE,
    DOCUMENT_REQUEST_PID_FETCHER,
    DOCUMENT_REQUEST_PID_MINTER,
    DOCUMENT_REQUEST_PID_TYPE,
    EITEM_PID_FETCHER,
    EITEM_PID_MINTER,
    EITEM_PID_TYPE,
    INTERNAL_LOCATION_PID_FETCHER,
    INTERNAL_LOCATION_PID_MINTER,
    INTERNAL_LOCATION_PID_TYPE,
    ITEM_PID_FETCHER,
    ITEM_PID_MINTER,
    ITEM_PID_TYPE,
    LOCATION_PID_FETCHER,
    LOCATION_PID_MINTER,
    LOCATION_PID_TYPE,
    PATRON_PID_FETCHER,
    PATRON_PID_MINTER,
    PATRON_PID_TYPE,
    SERIES_PID_FETCHER,
    SERIES_PID_MINTER,
    SERIES_PID_TYPE,
    TAG_PID_FETCHER,
    TAG_PID_MINTER,
    TAG_PID_TYPE,
    VOCABULARY_PID_FETCHER,
    VOCABULARY_PID_MINTER,
    VOCABULARY_PID_TYPE,
)

from .records.api import (  # isort:skip
    Document,
    DocumentRequest,
    EItem,
    InternalLocation,
    Item,
    Location,
    Patron,
    Series,
    Tag,
    Vocabulary,
)
from .records.permissions import (  # isort:skip
    record_read_permission_factory,
)
from .search.api import (  # isort:skip
    DocumentRequestSearch,
    DocumentSearch,
    EItemSearch,
    InternalLocationSearch,
    ItemSearch,
    LocationSearch,
    PatronsSearch,
    SeriesSearch,
    TagSearch,
    VocabularySearch,
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
THEME_FRONTPAGE = False

# Email configuration
# ===================
#: Email address for support.
SUPPORT_EMAIL = "info@inveniosoftware.org"
#: Disable email sending by default.
MAIL_SUPPRESS_SEND = True
#: Email address for email notification sender.
MAIL_NOTIFY_SENDER = "noreply@inveniosoftware.org"
#: Email CC address(es) for email notifications.
MAIL_NOTIFY_CC = []
#: Email BCC address(es) for email notification.
MAIL_NOTIFY_BCC = []
# Enable sending mail to test recipients.
ILS_MAIL_ENABLE_TEST_RECIPIENTS = True
#: When ILS_MAIL_ENABLE_TEST_RECIPIENTS=True, all emails are sent here
ILS_MAIL_NOTIFY_TEST_RECIPIENTS = ["onlyme@inveniosoftware.org"]
#: Loan status email templates
ILS_MAIL_LOAN_TEMPLATES = {}
#: Loan message loader
ILS_MAIL_LOAN_MSG_LOADER = (
    "invenio_app_ils.circulation.mail.loader:loan_message_loader"
)
#: Notification email for overdue loan sent automatically every X days
ILS_MAIL_LOAN_OVERDUE_REMINDER_INTERVAL = 3

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
    "overdue_loans": {
        "task": "invenio_app_ils.circulation.mail.tasks.send_overdue_loans_mail_reminder",
        "schedule": timedelta(days=1),
    },
    "stats-process-events": {
        'task': 'invenio_stats.tasks.process_events',
        'schedule': timedelta(minutes=30),
        'args': [('record-view',)],
    },
    "stats-aggregate-events": {
        'task': 'invenio_stats.tasks.aggregate_events',
        'schedule': timedelta(hours=3),
        'args': [('record-view-agg',)],
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
_TAGID_CONVERTER = 'pid(tagid, record_class="invenio_app_ils.records.api:Tag")'
_DREQID_CONVERTER = (
    'pid(dreqid, record_class="invenio_app_ils.records.api:DocumentRequest")'
)
_SERID_CONVERTER = (
    'pid(serid, record_class="invenio_app_ils.records.api:Series")'
)
_VENDOR_CONVERTER = (
    'pid(venid, record_class="invenio_app_ils.acquisition.api:Vendor")'
)
_order_CONVERTER = (
    'pid(venid, record_class="invenio_app_ils.acquisition.api:Order")'
)

# RECORDS REST
# ============
_RECORDS_REST_MAX_RESULT_WINDOW = 10000
PIDSTORE_RECID_FIELD = "pid"
# name of the URL arg to choose response serializer
REST_MIMETYPE_QUERY_ARG_NAME = "format"

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
            )
        },
        search_serializers={
            "application/json": (
                "invenio_app_ils.records.serializers:json_v1_search"
            ),
            "text/csv": ("invenio_app_ils.records.serializers:csv_v1_search"),
        },
        search_serializers_aliases={
            "csv": "text/csv",
            "json": "application/json",
        },
        list_route="/documents/",
        item_route="/documents/<{0}:pid_value>".format(_DOCID_CONVERTER),
        default_media_type="application/json",
        max_result_window=_RECORDS_REST_MAX_RESULT_WINDOW,
        error_handlers=dict(),
        read_permission_factory_imp=record_read_permission_factory,
        create_permission_factory_imp=backoffice_permission,
        update_permission_factory_imp=backoffice_permission,
        delete_permission_factory_imp=backoffice_permission,
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
            )
        },
        search_serializers={
            "application/json": (
                "invenio_app_ils.records.serializers:item_v1_search"
            ),
            "text/csv": ("invenio_app_ils.records.serializers:csv_v1_search"),
        },
        search_serializers_aliases={
            "csv": "text/csv",
            "json": "application/json",
        },
        list_route="/items/",
        item_route="/items/<{0}:pid_value>".format(_PITMID_CONVERTER),
        default_media_type="application/json",
        max_result_window=_RECORDS_REST_MAX_RESULT_WINDOW,
        error_handlers=dict(),
        read_permission_factory_imp=record_read_permission_factory,
        create_permission_factory_imp=backoffice_permission,
        update_permission_factory_imp=backoffice_permission,
        delete_permission_factory_imp=backoffice_permission,
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
        },
        record_serializers={
            "application/json": (
                "invenio_app_ils.records.serializers:json_v1_response"
            )
        },
        search_serializers={
            "application/json": (
                "invenio_records_rest.serializers:json_v1_search"
            ),
            "text/csv": ("invenio_app_ils.records.serializers:csv_v1_search"),
        },
        search_serializers_aliases={
            "csv": "text/csv",
            "json": "application/json",
        },
        list_route="/eitems/",
        item_route="/eitems/<{0}:pid_value>".format(_EITMID_CONVERTER),
        default_media_type="application/json",
        max_result_window=_RECORDS_REST_MAX_RESULT_WINDOW,
        error_handlers=dict(),
        read_permission_factory_imp=record_read_permission_factory,
        create_permission_factory_imp=backoffice_permission,
        update_permission_factory_imp=backoffice_permission,
        delete_permission_factory_imp=backoffice_permission,
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
        },
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
        search_serializers_aliases={
            "csv": "text/csv",
            "json": "application/json",
        },
        list_route="/locations/",
        item_route="/locations/<{0}:pid_value>".format(_LOCID_CONVERTER),
        default_media_type="application/json",
        max_result_window=_RECORDS_REST_MAX_RESULT_WINDOW,
        error_handlers=dict(),
        read_permission_factory_imp=record_read_permission_factory,
        create_permission_factory_imp=backoffice_permission,
        update_permission_factory_imp=backoffice_permission,
        delete_permission_factory_imp=backoffice_permission,
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
        },
        record_serializers={
            "application/json": (
                "invenio_app_ils.records.serializers:json_v1_response"
            )
        },
        search_serializers={
            "application/json": (
                "invenio_records_rest.serializers:json_v1_search"
            ),
            "text/csv": ("invenio_app_ils.records.serializers:csv_v1_search"),
        },
        search_serializers_aliases={
            "csv": "text/csv",
            "json": "application/json",
        },
        list_route="/series/",
        item_route="/series/<{0}:pid_value>".format(_SERID_CONVERTER),
        default_media_type="application/json",
        max_result_window=_RECORDS_REST_MAX_RESULT_WINDOW,
        error_handlers=dict(),
        read_permission_factory_imp=record_read_permission_factory,
        create_permission_factory_imp=backoffice_permission,
        update_permission_factory_imp=backoffice_permission,
        delete_permission_factory_imp=backoffice_permission,
    ),
    ilocid=dict(
        pid_type=INTERNAL_LOCATION_PID_TYPE,
        pid_minter=INTERNAL_LOCATION_PID_MINTER,
        pid_fetcher=INTERNAL_LOCATION_PID_FETCHER,
        search_class=InternalLocationSearch,
        record_class=InternalLocation,
        indexer_class=InternalLocationIndexer,
        record_loaders={
            "application/json": (
                "invenio_app_ils.records.loaders:internal_location_loader"
            ),
        },
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
        search_serializers_aliases={
            "csv": "text/csv",
            "json": "application/json",
        },
        list_route="/internal-locations/",
        item_route="/internal-locations/<{0}:pid_value>".format(
            _ILOCID_CONVERTER
        ),
        default_media_type="application/json",
        max_result_window=_RECORDS_REST_MAX_RESULT_WINDOW,
        error_handlers=dict(),
        read_permission_factory_imp=record_read_permission_factory,
        create_permission_factory_imp=backoffice_permission,
        update_permission_factory_imp=backoffice_permission,
        delete_permission_factory_imp=backoffice_permission,
    ),
    patid=dict(
        pid_type=PATRON_PID_TYPE,
        pid_minter=PATRON_PID_MINTER,
        pid_fetcher=PATRON_PID_FETCHER,
        search_class=PatronsSearch,
        record_class=Patron,
        record_serializers={
            "application/json": (
                "invenio_records_rest.serializers" ":json_v1_response"
            )
        },
        search_serializers={
            "application/json": (
                "invenio_records_rest.serializers:json_v1_search"
            ),
            "text/csv": ("invenio_app_ils.records.serializers:csv_v1_search"),
        },
        search_serializers_aliases={
            "csv": "text/csv",
            "json": "application/json",
        },
        item_route="/patrons/<pid({}):pid_value>".format(PATRON_PID_TYPE),
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
    tagid=dict(
        pid_type=TAG_PID_TYPE,
        pid_minter=TAG_PID_MINTER,
        pid_fetcher=TAG_PID_FETCHER,
        search_class=TagSearch,
        record_class=Tag,
        indexer_class=TagIndexer,
        record_serializers={
            "application/json": (
                "invenio_records_rest.serializers" ":json_v1_response"
            )
        },
        search_serializers={
            "application/json": (
                "invenio_records_rest.serializers:json_v1_search"
            )
        },
        search_serializers_aliases={
            "csv": "text/csv",
            "json": "application/json",
        },
        item_route="/tags/<{0}:pid_value>".format(_TAGID_CONVERTER),
        list_route="/tags/",
        default_media_type="application/json",
        max_result_window=_RECORDS_REST_MAX_RESULT_WINDOW,
        error_handlers=dict(),
        list_permission_factory_imp=backoffice_permission,
        read_permission_factory_imp=record_read_permission_factory,
        create_permission_factory_imp=backoffice_permission,
        update_permission_factory_imp=backoffice_permission,
        delete_permission_factory_imp=backoffice_permission,
    ),
    dreqid=dict(
        pid_type=DOCUMENT_REQUEST_PID_TYPE,
        pid_minter=DOCUMENT_REQUEST_PID_MINTER,
        pid_fetcher=DOCUMENT_REQUEST_PID_FETCHER,
        search_class=DocumentRequestSearch,
        record_class=DocumentRequest,
        indexer_class=DocumentRequestIndexer,
        search_factory_imp="invenio_app_ils.search.api"
                           ":filter_by_patron_search_factory",
        record_loaders={
            "application/json": (
                "invenio_app_ils.records.loaders:document_request_loader"
            ),
        },
        record_serializers={
            "application/json": (
                "invenio_app_ils.records.serializers:json_v1_response"
            )
        },
        search_serializers={
            "application/json": (
                "invenio_app_ils.records.serializers:json_v1_search"
            ),
            "text/csv": ("invenio_app_ils.records.serializers:csv_v1_search"),
        },
        search_serializers_aliases={
            "csv": "text/csv",
            "json": "application/json",
        },
        list_route="/document-requests/",
        item_route="/document-requests/<{0}:pid_value>".format(
            _DREQID_CONVERTER
        ),
        default_media_type="application/json",
        max_result_window=_RECORDS_REST_MAX_RESULT_WINDOW,
        error_handlers=dict(),
        read_permission_factory_imp=DocumentRequestOwnerPermission,
        list_permission_factory_imp=authenticated_user_permission,
        create_permission_factory_imp=authenticated_user_permission,
        update_permission_factory_imp=backoffice_permission,
        delete_permission_factory_imp=backoffice_permission,
    ),
    vocid=dict(
        pid_type=VOCABULARY_PID_TYPE,
        pid_minter=VOCABULARY_PID_MINTER,
        pid_fetcher=VOCABULARY_PID_FETCHER,
        search_class=VocabularySearch,
        indexer_class=VocabularyIndexer,
        record_class=Vocabulary,
        record_serializers={
            "application/json": (
                "invenio_app_ils.records.serializers:json_v1_response"
            )
        },
        search_serializers={
            "application/json": (
                "invenio_app_ils.records.serializers:json_v1_search"
            ),
            "text/csv": ("invenio_app_ils.records.serializers:csv_v1_search"),
        },
        search_serializers_aliases={
            "csv": "text/csv",
            "json": "application/json",
        },
        item_route="/vocabularies/<pid({}):pid_value>".format(
            VOCABULARY_PID_TYPE),
        list_route="/vocabularies/",
        default_media_type="application/json",
        max_result_window=_RECORDS_REST_MAX_RESULT_WINDOW,
        error_handlers=dict(),
        list_permission_factory_imp=backoffice_permission,
        read_permission_factory_imp=deny_all,
        create_permission_factory_imp=deny_all,
        update_permission_factory_imp=deny_all,
        delete_permission_factory_imp=deny_all,
    ),
    acqvid=dict(
        pid_type=VENDOR_PID_TYPE,
        pid_minter=VENDOR_PID_MINTER,
        pid_fetcher=VENDOR_PID_FETCHER,
        search_class=VendorSearch,
        record_class=Vendor,
        record_serializers={
            'application/json': ('invenio_records_rest.serializers'
                                 ':json_v1_response'),
        },
        search_serializers={
            'application/json': ('invenio_records_rest.serializers'
                                 ':json_v1_search'),
        },
        list_route='/acquisition/vendors/',
        item_route='/acquisition/vendors/<{0}:pid_value>'.format(
            _VENDOR_CONVERTER),
        default_media_type='application/json',
        max_result_window=10000,
        error_handlers=dict(),
        read_permission_factory_imp=record_read_permission_factory,
        create_permission_factory_imp=backoffice_permission,
        update_permission_factory_imp=backoffice_permission,
        delete_permission_factory_imp=backoffice_permission,
    ),
    acqoid=dict(
        pid_type=ORDER_PID_TYPE,
        pid_minter=ORDER_PID_MINTER,
        pid_fetcher=ORDER_PID_FETCHER,
        search_class=OrderSearch,
        record_class=Order,
        record_serializers={
            'application/json': ('invenio_records_rest.serializers'
                                 ':json_v1_response'),
        },
        search_serializers={
            'application/json': ('invenio_records_rest.serializers'
                                 ':json_v1_search'),
        },
        list_route='/acquisition/orders/',
        item_route='/acquisition/orders/<{0}:pid_value>'.format(
            _VENDOR_CONVERTER),
        default_media_type='application/json',
        max_result_window=10000,
        error_handlers=dict(),
        read_permission_factory_imp=record_read_permission_factory,
        create_permission_factory_imp=backoffice_permission,
        update_permission_factory_imp=backoffice_permission,
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

CIRCULATION_LOAN_REQUEST_DURATION_DAYS = 60

CIRCULATION_DELIVERY_METHODS = {
    "PICKUP": "Pick it up at the library desk",
    "DELIVERY": "Have it delivered to my office",
}

CIRCULATION_POLICIES = dict(
    checkout=dict(
        duration_default=circulation_default_loan_duration,
        duration_validate=circulation_is_loan_duration_valid,
        item_can_circulate=can_item_circulate,
    ),
    extension=dict(
        from_end_date=True,
        duration_default=circulation_default_extension_duration,
        max_count=circulation_default_extension_max_count,
    ),
    request=dict(can_be_requested=circulation_can_be_requested),
)

CIRCULATION_ITEM_REF_BUILDER = circulation_build_item_ref

CIRCULATION_ITEM_RESOLVING_PATH = (
    "/api/resolver/circulation/loans/<loan_pid>/item"
)

CIRCULATION_ITEM_RESOLVER_ENDPOINT = item_resolver

CIRCULATION_DOCUMENT_REF_BUILDER = circulation_build_document_ref

CIRCULATION_DOCUMENT_RESOLVING_PATH = (
    "/api/resolver/circulation/loans/<loan_pid>/document"
)

CIRCULATION_DOCUMENT_RESOLVER_ENDPOINT = document_resolver

CIRCULATION_PATRON_REF_BUILDER = circulation_build_patron_ref

CIRCULATION_PATRON_RESOLVING_PATH = (
    "/api/resolver/circulation/loans/<loan_pid>/patron"
)

CIRCULATION_PATRON_RESOLVER_ENDPOINT = loan_patron_resolver

CIRCULATION_LOAN_TRANSITIONS = {
    "CREATED": [
        dict(
            dest="PENDING",
            trigger="request",
            transition=CreatedToPending,
            permission_factory=authenticated_user_permission,
            assign_item=False,
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
            transition=ToCancelled,
            permission_factory=backoffice_permission,
        ),
    ],
    "ITEM_ON_LOAN": [
        dict(
            dest="ITEM_RETURNED",
            trigger="checkin",
            transition=ItemOnLoanToItemReturned,
            permission_factory=backoffice_permission,
            assign_item=False,
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
            transition=ToCancelled,
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
        search_factory_imp="invenio_app_ils.search.api"
                           ":filter_by_patron_search_factory",
        record_class="invenio_circulation.api:Loan",
        indexer_class=LoanIndexer,
        record_loaders={
            "application/json": (
                "invenio_circulation.records.loaders:loan_loader"
            )
        },
        record_serializers={
            "application/json": (
                "invenio_app_ils.records.serializers:loan_v1_response"
            )
        },
        search_serializers={
            "application/json": (
                "invenio_app_ils.records.serializers:loan_v1_search"
            ),
            "text/csv": ("invenio_app_ils.records.serializers:csv_v1_search"),
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
        create_permission_factory_imp=deny_all,
        update_permission_factory_imp=backoffice_permission,
        delete_permission_factory_imp=backoffice_permission,
        list_permission_factory_imp=authenticated_user_permission,
    )
)

# RECORDS REST sort options
# =========================
RECORDS_REST_SORT_OPTIONS = dict(
    document_requests=dict(  # DocumentRequestSearch.Meta.index
        mostrecent=dict(
            fields=["_updated"],
            title="Newest",
            default_order="asc",
            order=1,
        ),
        bestmatch=dict(
            fields=["-_score"],
            title="Best match",
            default_order="asc",
            order=2,
        ),
    ),
    documents=dict(  # DocumentSearch.Meta.index
        mostrecent=dict(
            fields=["_updated"],
            title="Newest",
            default_order="asc",
            order=1,
        ),
        bestmatch=dict(
            fields=["-_score"],
            title="Best match",
            default_order="asc",
            order=2,
        ),
        available_items=dict(
            fields=["-circulation.has_items_for_loan"],
            title="Available Items",
            default_order="asc",
            order=3,
        ),
        mostloaned=dict(
            fields=["circulation.past_loans_count"],
            title="Most loaned",
            default_order="desc",
            order=4,
        ),
        published_date=dict(
            fields=["imprints.date"],
            title="Published date",
            default_order="desc",
            order=4,
        ),
    ),
    eitems=dict(  # ItemSearch.Meta.index
        mostrecent=dict(
            fields=["_updated"],
            title="Newest",
            default_order="asc",
            order=1,
        ),
        bestmatch=dict(
            fields=["-_score"],
            title="Best match",
            default_order="asc",
            order=2,
        ),
    ),
    items=dict(  # ItemSearch.Meta.index
        mostrecent=dict(
            fields=["_updated"],
            title="Newest",
            default_order="asc",
            order=1,
        ),
        bestmatch=dict(
            fields=["-_score"],
            title="Best match",
            default_order="asc",
            order=2,
        ),
    ),
    loans=dict(  # IlsLoansSearch.Meta.index
        mostrecent=dict(
            fields=["_updated"],
            title="Newest",
            default_order="asc",
            order=1,
        ),
        bestmatch=dict(
            fields=["-_score"],
            title="Best match",
            default_order="asc",
            order=2,
        ),
    ),
    patrons=dict(  # PatronsSearch.Meta.index
        bestmatch=dict(
            fields=["-_score"],
            title="Best match",
            default_order="asc",
            order=1,
        ),
    ),
    series=dict(  # SeriesSearch.Meta.index
        mostrecent=dict(
            fields=["_updated"],
            title="Newest",
            default_order="asc",
            order=1,
        ),
        bestmatch=dict(
            fields=["-_score"],
            title="Best match",
            default_order="asc",
            order=2,
        ),
    ),
)

# RECORDS REST facets
# =========================
#: Number of records to fetch by default
RECORDS_REST_DEFAULT_RESULTS_SIZE = 15

#: Number of tags to display in the DocumentsSearch facet
FACET_TAG_LIMIT = 5

RECORDS_REST_FACETS = dict(
    documents=dict(  # DocumentSearch.Meta.index
        aggs=dict(
            tag=dict(terms=dict(field="tags.name", size=FACET_TAG_LIMIT)),
            language=dict(terms=dict(field="languages")),
            doctype=dict(terms=dict(field="document_type")),
            relation=dict(
                terms=dict(field="relation_types")
            ),
            availability=dict(
                range=dict(
                    field="circulation.has_items_for_loan",
                    ranges=[{"key": "available for loan", "from": 1}],
                )
            ),
            medium=dict(terms=dict(field="stock.mediums")),
        ),
        post_filters=dict(
            doctype=terms_filter("document_type"),
            language=terms_filter("languages"),
            tag=terms_filter("tags.name"),
            availability=keyed_range_filter(
                "circulation.has_items_for_loan",
                {"available for loan": {"gt": 0}},
            ),
            relation=terms_filter("relation_types"),
            medium=terms_filter("stock.mediums"),
        ),
    ),
    document_requests=dict(  # DocumentRequestSearch.Meta.index
        aggs=dict(state=dict(terms=dict(field="state"))),
        post_filters=dict(state=terms_filter("state")),
    ),
    items=dict(  # ItemSearch.Meta.index
        aggs=dict(
            status=dict(terms=dict(field="status")),
            medium=dict(terms=dict(field="medium")),
            circulation=dict(
                terms=dict(field="circulation.state", missing="N/A")
            ),
        ),
        post_filters=dict(
            status=terms_filter("status"),
            medium=terms_filter("medium"),
            circulation=terms_filter("circulation.state"),
        ),
    ),
    loans=dict(  # IlsLoansSearch.Meta.index
        aggs=dict(state=dict(terms=dict(field="state"))),
        post_filters=dict(state=terms_filter("state")),
    ),
    series=dict(  # SeriesSearch.Meta.index
        aggs=dict(moi=dict(terms=dict(field="mode_of_issuance"))),
        post_filters=dict(moi=terms_filter("mode_of_issuance")),
    ),
)

# ILS
# ===
ILS_VIEWS_PERMISSIONS_FACTORY = views_permissions_factory
"""Permissions factory for ILS views to handle all ILS actions."""

ILS_INDEXER_TASK_DELAY = timedelta(seconds=5)
"""Time delay that indexers spawning their asynchronous celery tasks."""

# Accounts REST
# ==============
ACCOUNTS_REST_READ_USER_PROPERTIES_PERMISSION_FACTORY = backoffice_permission
"""Default read user properties permission factory: reject any request."""

ACCOUNTS_REST_UPDATE_USER_PROPERTIES_PERMISSION_FACTORY = backoffice_permission
"""Default modify user properties permission factory: reject any request."""

ACCOUNTS_REST_READ_USERS_LIST_PERMISSION_FACTORY = backoffice_permission
"""Default list users permission factory: reject any request."""

# PID Relations
# ==============

ILS_RELATION_TYPE = namedtuple(
    "IlsRelationType", RelationType._fields + ("relation_class",)
)

LANGUAGE_RELATION = ILS_RELATION_TYPE(
    0,
    "language",
    "Language",
    "invenio_app_ils.records.relations.nodes:PIDNodeRelated",
    "invenio_pidrelations.serializers.schemas.RelationSchema",
    "invenio_app_ils.records.relations.api.SiblingsRelation",
)
EDITION_RELATION = ILS_RELATION_TYPE(
    1,
    "edition",
    "Edition",
    "invenio_app_ils.records.relations.nodes:PIDNodeRelated",
    "invenio_pidrelations.serializers.schemas.RelationSchema",
    "invenio_app_ils.records.relations.api.SiblingsRelation",
)
OTHER_RELATION = ILS_RELATION_TYPE(
    2,
    "other",
    "Other",
    "invenio_app_ils.records.relations.nodes:PIDNodeRelated",
    "invenio_pidrelations.serializers.schemas.RelationSchema",
    "invenio_app_ils.records.relations.api.SiblingsRelation",
)
MULTIPART_MONOGRAPH_RELATION = ILS_RELATION_TYPE(
    3,
    "multipart_monograph",
    "Multipart Monograph",
    "invenio_app_ils.records.relations.nodes:PIDNodeRelated",
    "invenio_pidrelations.serializers.schemas.RelationSchema",
    "invenio_app_ils.records.relations.api.ParentChildRelation",
)
SERIAL_RELATION = ILS_RELATION_TYPE(
    4,
    "serial",
    "Serial",
    "invenio_app_ils.records.relations.nodes:PIDNodeRelated",
    "invenio_pidrelations.serializers.schemas.RelationSchema",
    "invenio_app_ils.records.relations.api.ParentChildRelation",
)

PARENT_CHILD_RELATION_TYPES = [MULTIPART_MONOGRAPH_RELATION, SERIAL_RELATION]

SIBLINGS_RELATION_TYPES = [LANGUAGE_RELATION, EDITION_RELATION, OTHER_RELATION]

ILS_PIDRELATIONS_TYPES = PARENT_CHILD_RELATION_TYPES + SIBLINGS_RELATION_TYPES

# The HTML tags allowed with invenio_records_rest.schemas.fields.sanitizedhtml
ALLOWED_HTML_TAGS = []

# Stats
# =====
STATS_EVENTS = {
    'record-view': {
        'signal': 'invenio_app_ils.signals.record_viewed',
        'templates': 'invenio_stats.contrib.record_view',
        'event_builders': [
            'invenio_stats.contrib.event_builders.record_view_event_builder',
        ],
        'cls': EventsIndexer,
        'params': {
            'preprocessors': [
                'invenio_stats.processors:flag_robots',
                # Don't index robot events
                lambda doc: doc if not doc['is_robot'] else None,
                'invenio_stats.processors:flag_machines',
                'invenio_stats.processors:anonymize_user',
                'invenio_stats.contrib.event_builders:build_record_unique_id',
            ],
            'double_click_window': 30,
            'suffix': '%Y-%m',
        },
    },
}

STATS_AGGREGATIONS = {
    'record-view-agg': dict(
        templates='invenio_stats.contrib.aggregations.aggr_record_view',
        cls=StatAggregator,
        params=dict(
            event='record-view',
            field='pid_value',
            interval='day',
            index_interval='month',
            copy_fields=dict(
                pid_type='pid_type',
                pid_value='pid_value',
            ),
            metric_fields=dict(
                unique_count=('cardinality', 'unique_session_id',
                              {'precision_threshold': 1000}),
            ),
        )
    ),
}

STATS_QUERIES = {
    'record-view': dict(
        cls=ESTermsQuery,
        permission_factory=None,
        params=dict(
            index='stats-record-view',
            copy_fields=dict(
                pid_type='pid_type',
                pid_value='pid_value',
            ),
            required_filters=dict(
                pid_value='pid_value',
            ),
            metric_fields=dict(
                count=('sum', 'count', {}),
                unique_count=('sum', 'unique_count', {}),
            )
        )
    ),
}

# List of available vocabularies
ILS_VOCABULARIES = [
    "affiliation_identifier_scheme",
    "alternative_identifier_scheme",
    "alternative_title_type",
    "author_identifier_scheme",
    "author_role",
    "author_type",
    "conference_identifier_scheme",
    "country",
    "document_type",
    "identifier_scheme",
    "language",
    "tag",
]

ILS_VOCABULARY_SOURCES = {
    "json": "invenio_app_ils.vocabularies.sources:json_source",
}
