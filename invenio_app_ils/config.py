# -*- coding: utf-8 -*-
#
# Copyright (C) 2018-2020 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""Default configuration for invenio-app-ils.

You overwrite and set instance-specific configuration by either:

- Configuration file: ``<virtualenv prefix>/var/instance/invenio.cfg``
- Environment variables: ``APP_<variable name>``
"""

import datetime
from datetime import timedelta

from celery.schedules import crontab
from invenio_accounts.config import (
    ACCOUNTS_REST_AUTH_VIEWS as _ACCOUNTS_REST_AUTH_VIEWS,
)
from invenio_records_rest.facets import terms_filter
from invenio_records_rest.utils import allow_all, deny_all
from invenio_stats.aggregations import StatAggregator
from invenio_stats.processors import EventsIndexer
from invenio_stats.queries import ESTermsQuery

from invenio_app_ils.document_requests.indexer import DocumentRequestIndexer
from invenio_app_ils.documents.indexer import DocumentIndexer
from invenio_app_ils.eitems.indexer import EItemIndexer
from invenio_app_ils.internal_locations.indexer import InternalLocationIndexer
from invenio_app_ils.items.indexer import ItemIndexer
from invenio_app_ils.literature.api import (
    LITERATURE_PID_FETCHER,
    LITERATURE_PID_MINTER,
    LITERATURE_PID_TYPE,
)
from invenio_app_ils.literature.covers_builder import build_ils_demo_cover_urls
from invenio_app_ils.literature.search import LiteratureSearch
from invenio_app_ils.locations.indexer import LocationIndexer
from invenio_app_ils.patrons.indexer import PatronIndexer
from invenio_app_ils.series.indexer import SeriesIndexer
from invenio_app_ils.vocabularies.indexer import VocabularyIndexer

from .document_requests.api import (
    DOCUMENT_REQUEST_PID_FETCHER,
    DOCUMENT_REQUEST_PID_MINTER,
    DOCUMENT_REQUEST_PID_TYPE,
    DocumentRequest,
)
from .document_requests.notifications.api import document_request_notification_filter
from .document_requests.search import DocumentRequestSearch
from .documents.api import (
    DOCUMENT_PID_FETCHER,
    DOCUMENT_PID_MINTER,
    DOCUMENT_PID_TYPE,
    Document,
)
from .documents.search import DocumentSearch
from .eitems.api import EITEM_PID_FETCHER, EITEM_PID_MINTER, EITEM_PID_TYPE, EItem
from .eitems.search import EItemSearch
from .facets import (
    default_value_when_missing_filter,
    exists_value_filter,
    keyed_range_filter,
)
from .internal_locations.api import (
    INTERNAL_LOCATION_PID_FETCHER,
    INTERNAL_LOCATION_PID_MINTER,
    INTERNAL_LOCATION_PID_TYPE,
    InternalLocation,
)
from .internal_locations.search import InternalLocationSearch
from .items.api import ITEM_PID_FETCHER, ITEM_PID_MINTER, ITEM_PID_TYPE, Item
from .items.search import ItemSearch
from .locations.api import (
    LOCATION_PID_FETCHER,
    LOCATION_PID_MINTER,
    LOCATION_PID_TYPE,
    Location,
)
from .locations.search import LocationSearch
from .patrons.api import (
    PATRON_PID_FETCHER,
    PATRON_PID_MINTER,
    PATRON_PID_TYPE,
    AnonymousPatron,
    Patron,
    SystemAgent,
)
from .patrons.search import PatronsSearch
from .permissions import (
    PatronOwnerPermission,
    authenticated_user_permission,
    backoffice_permission,
    views_permissions_factory,
)
from .records.permissions import record_read_permission_factory
from .series.api import SERIES_PID_FETCHER, SERIES_PID_MINTER, SERIES_PID_TYPE, Series
from .series.search import SeriesSearch
from .views import UserInfoResource
from .vocabularies.api import (
    VOCABULARY_PID_FETCHER,
    VOCABULARY_PID_MINTER,
    VOCABULARY_PID_TYPE,
    Vocabulary,
)
from .vocabularies.search import VocabularySearch


def _(x):
    """Identity function used to trigger string extraction."""
    return x


###############################################################################
# Debug
###############################################################################
DEBUG = True
DEBUG_TB_ENABLED = True
DEBUG_TB_INTERCEPT_REDIRECTS = False

###############################################################################
# Rate limiting
###############################################################################
#: Storage for rate limiter.
RATELIMIT_STORAGE_URI = "redis://localhost:6379/3"
#: Rate limit for logged in users.
RATELIMIT_AUTHENTICATED_USER = "5000 per hour;150 per minute"
#: Rate limit for non logged in users.
RATELIMIT_GUEST_USER = "1000 per hour;100 per minute"

###############################################################################
# I18N
###############################################################################
#: Default language
BABEL_DEFAULT_LANGUAGE = "en"
#: Default time zone
BABEL_DEFAULT_TIMEZONE = "Europe/Zurich"

###############################################################################
# Notifications configuration
###############################################################################
# The backends to use when sending notifications.
ILS_NOTIFICATIONS_BACKENDS_BUILDER = (
    "invenio_app_ils.notifications.backends:notifications_backend_builder"  # noqa
)
# Notification message creator
ILS_NOTIFICATIONS_MSG_BUILDER = (
    "invenio_app_ils.notifications.messages:notification_msg_builder"  # noqa
)
# Override default global common templates
ILS_NOTIFICATIONS_TEMPLATES = {"footer": "footer.html"}
# DOCUMENT REQUESTS
# Notification message creator for document requests notifications
ILS_NOTIFICATIONS_MSG_BUILDER_DOCUMENT_REQUEST = "invenio_app_ils.document_requests.notifications.messages:notification_document_request_msg_builder"  # noqa
# Override default document requests templates
ILS_NOTIFICATIONS_TEMPLATES_DOCUMENT_REQUEST = {}
# Function to select and filter which notifications should be sent
ILS_NOTIFICATIONS_FILTER_DOCUMENT_REQUEST = document_request_notification_filter
###############################################################################
# Email configuration
###############################################################################
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
ILS_MAIL_ENABLE_TEST_RECIPIENTS = False
#: When ILS_MAIL_ENABLE_TEST_RECIPIENTS=True, all emails are sent here
ILS_MAIL_NOTIFY_TEST_RECIPIENTS = ["onlyme@inveniosoftware.org"]

###############################################################################
# Assets
###############################################################################
#: Static files collection method (defaults to copying files).
COLLECT_STORAGE = "flask_collect.storage.file"

###############################################################################
# Accounts
###############################################################################
#: Email address used as sender of account registration emails.
SECURITY_EMAIL_SENDER = SUPPORT_EMAIL
#: Email subject for account registration emails.
SECURITY_EMAIL_SUBJECT_REGISTER = _("Welcome to invenio-app-ils!")
#: Redis session storage URL.
ACCOUNTS_SESSION_REDIS_URL = "redis://localhost:6379/1"

_ACCOUNTS_REST_AUTH_VIEWS.update(user_info=UserInfoResource)
ACCOUNTS_REST_AUTH_VIEWS = _ACCOUNTS_REST_AUTH_VIEWS

ACCOUNTS_REST_CONFIRM_EMAIL_ENDPOINT = "/accounts/confirm-email"

###############################################################################
# Celery configuration
###############################################################################
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
    "send_expiring_loans_loans": {
        "task": "invenio_app_ils.circulation.notifications.tasks.send_expiring_loans_notification_reminder",  # noqa
        "schedule": crontab(minute=0, hour=0),  # every day, midnight
    },
    "cancel_expired_loan": {
        "task": (
            "invenio_app_ils.circulation.tasks.cancel_expired_loan_requests"
        ),  # noqa
        "schedule": crontab(minute=0, hour=1),  # every day, 1am
    },
    "send_overdue_loan_reminders": {
        "task": "invenio_app_ils.circulation.notifications.tasks.send_overdue_loans_notification_reminder",  # noqa
        "schedule": crontab(minute=0, hour=2),  # every day, 2am
    },
    "stats-process-events": {
        "task": "invenio_stats.tasks.process_events",
        "schedule": timedelta(minutes=30),
        "args": [("record-view", "file-download")],
    },
    "stats-aggregate-events": {
        "task": "invenio_stats.tasks.aggregate_events",
        "schedule": timedelta(hours=3),
        "args": [("record-view-agg", "file-download-agg")],
    },
    "clean_locations_past_closures_exceptions": {
        "task": (
            "invenio_app_ils.closures.tasks.clean_locations_past_closures_exceptions"
        ),  # noqa
        "schedule": crontab(
            0, 0, day_of_month=31, month_of_year=1
        ),  # January 31st of every year
    },
}

#: When the closures of a location are updated,
# start a task to update the active loans.
EXTEND_LOANS_LOCATION_UPDATED = True

#: Time at which the task should be run.
EXTEND_LOANS_SCHEDULE_TIME = datetime.time(2)

###############################################################################
# Database
###############################################################################
#: Database URI including user and password
SQLALCHEMY_DATABASE_URI = "postgresql+psycopg2://test:psw@localhost/ils"

###############################################################################
# JSONSchemas
###############################################################################
#: Hostname used in URLs for local JSONSchemas.
JSONSCHEMAS_HOST = "127.0.0.1:5000"

###############################################################################
# CSRF
###############################################################################
REST_CSRF_ENABLED = True

###############################################################################
# CORS
###############################################################################
REST_ENABLE_CORS = True
CORS_SEND_WILDCARD = False
CORS_SUPPORTS_CREDENTIALS = True

###############################################################################
# Flask configuration
###############################################################################
# See details on
# http://flask.pocoo.org/docs/0.12/config/#builtin-configuration-values

#: Secret key - each installation (dev, production, ...) needs a separate key.
#: It should be changed before deploying.
SECRET_KEY = "CHANGE_ME"
#: Max upload size for form data via application/mulitpart-formdata.
MAX_CONTENT_LENGTH = 100 * 1024 * 1024  # 100 MiB
#: Sets cookie with the secure flag by default
SESSION_COOKIE_SECURE = True
SESSION_COOKIE_SAMESITE = "Lax"
#: Since HAProxy and Nginx route all requests no matter the host header
#: provided, the allowed hosts variable is set to localhost. In production it
#: should be set to the correct host and it is strongly recommended to only
#: route correct hosts to the application.
TRUSTED_HOSTS = ["localhost", "127.0.0.1"]

#: Single Page Application host and routes, useful in templates/emails
SPA_HOST = "https://127.0.0.1:3000"
SPA_PATHS = dict(
    literature="/literature/%(pid)s",
    loan="/backoffice/loans",
    patron="/backoffice/patrons",
    profile="/profile",
    search="/search?q=%(querystring)s",
)

###############################################################################
# OAI-PMH
###############################################################################
OAISERVER_ID_PREFIX = "oai:invenio-app-ils:"

###############################################################################
# RECORDS REST
###############################################################################
_DOCID_CONVERTER = 'pid(docid, record_class="invenio_app_ils.documents.api:Document")'
_PITMID_CONVERTER = 'pid(pitmid, record_class="invenio_app_ils.items.api:Item")'
_EITMID_CONVERTER = 'pid(eitmid, record_class="invenio_app_ils.eitems.api:EItem")'
_LOCID_CONVERTER = 'pid(locid, record_class="invenio_app_ils.locations.api:Location")'
_ILOCID_CONVERTER = 'pid(ilocid, record_class="invenio_app_ils.internal_locations.api:InternalLocation")'  # noqa
_DREQID_CONVERTER = 'pid(dreqid, record_class="invenio_app_ils.document_requests.api:DocumentRequest")'  # noqa
_SERID_CONVERTER = 'pid(serid, record_class="invenio_app_ils.series.api:Series")'

RECORDS_REST_MAX_RESULT_WINDOW = 10000
RECORDS_REST_VOCAB_MAX_RESULT_WINDOW = 500
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
        search_factory_imp="invenio_app_ils.search_permissions:ils_search_factory",  # noqa
        record_loaders={
            "application/json": "invenio_app_ils.documents.loaders:document_loader"
        },
        record_serializers={
            "application/json": (
                "invenio_app_ils.literature.serializers:json_v1_response"
            )
        },
        search_serializers={
            "application/json": "invenio_app_ils.literature.serializers:json_v1_search",
            "text/csv": "invenio_app_ils.literature.serializers:csv_v1_search",
        },
        search_serializers_aliases={
            "csv": "text/csv",
            "json": "application/json",
        },
        list_route="/documents/",
        item_route="/documents/<{0}:pid_value>".format(_DOCID_CONVERTER),
        default_media_type="application/json",
        max_result_window=RECORDS_REST_MAX_RESULT_WINDOW,
        error_handlers=dict(),
        read_permission_factory_imp=record_read_permission_factory,
        list_permission_factory_imp=allow_all,  # auth via search filter
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
            "application/json": "invenio_app_ils.items.loaders:item_loader"
        },
        record_serializers={
            "application/json": "invenio_app_ils.items.serializers:json_v1_response"
        },
        search_serializers={
            "application/json": "invenio_app_ils.items.serializers:json_v1_search",
            "text/csv": "invenio_app_ils.items.serializers:csv_v1_search",
        },
        search_serializers_aliases={
            "csv": "text/csv",
            "json": "application/json",
        },
        list_route="/items/",
        item_route="/items/<{0}:pid_value>".format(_PITMID_CONVERTER),
        default_media_type="application/json",
        max_result_window=RECORDS_REST_MAX_RESULT_WINDOW,
        error_handlers=dict(),
        read_permission_factory_imp=backoffice_permission,
        list_permission_factory_imp=backoffice_permission,
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
            "application/json": "invenio_app_ils.eitems.loaders:eitem_loader"
        },
        record_serializers={
            "application/json": "invenio_app_ils.records.serializers:json_v1_response"
        },
        search_serializers={
            "application/json": "invenio_app_ils.records.serializers:json_v1_search",
            "text/csv": "invenio_app_ils.records.serializers:csv_v1_search",
        },
        search_serializers_aliases={
            "csv": "text/csv",
            "json": "application/json",
        },
        list_route="/eitems/",
        item_route="/eitems/<{0}:pid_value>".format(_EITMID_CONVERTER),
        default_media_type="application/json",
        max_result_window=RECORDS_REST_MAX_RESULT_WINDOW,
        error_handlers=dict(),
        read_permission_factory_imp=backoffice_permission,
        list_permission_factory_imp=backoffice_permission,
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
            "application/json": "invenio_app_ils.locations.loaders:location_loader"
        },
        record_serializers={
            "application/json": "invenio_app_ils.records.serializers:json_v1_response"
        },
        search_serializers={
            "application/json": "invenio_app_ils.records.serializers:json_v1_search"
        },
        search_serializers_aliases={
            "json": "application/json",
        },
        list_route="/locations/",
        item_route="/locations/<{0}:pid_value>".format(_LOCID_CONVERTER),
        default_media_type="application/json",
        max_result_window=RECORDS_REST_MAX_RESULT_WINDOW,
        error_handlers=dict(),
        read_permission_factory_imp=record_read_permission_factory,
        list_permission_factory_imp=allow_all,
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
        search_factory_imp="invenio_app_ils.search_permissions:ils_search_factory",  # noqa
        record_loaders={
            "application/json": "invenio_app_ils.series.loaders:series_loader"
        },
        record_serializers={
            "application/json": (
                "invenio_app_ils.literature.serializers:json_v1_response"
            )
        },
        search_serializers={
            "application/json": "invenio_app_ils.literature.serializers:json_v1_search",
            "text/csv": "invenio_app_ils.literature.serializers:csv_v1_search",
        },
        search_serializers_aliases={
            "csv": "text/csv",
            "json": "application/json",
        },
        list_route="/series/",
        item_route="/series/<{0}:pid_value>".format(_SERID_CONVERTER),
        default_media_type="application/json",
        max_result_window=RECORDS_REST_MAX_RESULT_WINDOW,
        error_handlers=dict(),
        read_permission_factory_imp=record_read_permission_factory,
        list_permission_factory_imp=allow_all,
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
            "application/json": "invenio_app_ils.internal_locations.loaders:internal_location_loader"  # noqa
        },
        record_serializers={
            "application/json": "invenio_app_ils.records.serializers:json_v1_response"
        },
        search_serializers={
            "application/json": "invenio_records_rest.serializers:json_v1_search"
        },
        search_serializers_aliases={
            "json": "application/json",
        },
        list_route="/internal-locations/",
        item_route="/internal-locations/<{0}:pid_value>".format(_ILOCID_CONVERTER),
        default_media_type="application/json",
        max_result_window=RECORDS_REST_MAX_RESULT_WINDOW,
        error_handlers=dict(),
        read_permission_factory_imp=backoffice_permission,
        list_permission_factory_imp=backoffice_permission,
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
        indexer_class=PatronIndexer,
        record_serializers={
            "application/json": "invenio_records_rest.serializers:json_v1_response"
        },
        search_serializers={
            "application/json": "invenio_app_ils.records.serializers:json_v1_search",
            "text/csv": "invenio_app_ils.records.serializers:csv_v1_search",
        },
        search_serializers_aliases={
            "csv": "text/csv",
            "json": "application/json",
        },
        item_route="/patrons/<pid({}):pid_value>".format(PATRON_PID_TYPE),
        list_route="/patrons/",
        default_media_type="application/json",
        max_result_window=RECORDS_REST_MAX_RESULT_WINDOW,
        error_handlers=dict(),
        read_permission_factory_imp=deny_all,
        list_permission_factory_imp=backoffice_permission,
        create_permission_factory_imp=deny_all,
        update_permission_factory_imp=deny_all,
        delete_permission_factory_imp=deny_all,
    ),
    dreqid=dict(
        pid_type=DOCUMENT_REQUEST_PID_TYPE,
        pid_minter=DOCUMENT_REQUEST_PID_MINTER,
        pid_fetcher=DOCUMENT_REQUEST_PID_FETCHER,
        search_class=DocumentRequestSearch,
        record_class=DocumentRequest,
        indexer_class=DocumentRequestIndexer,
        search_factory_imp="invenio_app_ils.search_permissions:search_factory_filter_by_patron",  # noqa
        record_loaders={
            "application/json": "invenio_app_ils.document_requests.loaders:document_request_loader"  # noqa
        },
        record_serializers={
            "application/json": "invenio_app_ils.records.serializers:json_v1_response"
        },
        search_serializers={
            "application/json": "invenio_app_ils.records.serializers:json_v1_search",
            "text/csv": "invenio_app_ils.records.serializers:csv_v1_search",
        },
        search_serializers_aliases={
            "csv": "text/csv",
            "json": "application/json",
        },
        list_route="/document-requests/",
        item_route="/document-requests/<{0}:pid_value>".format(_DREQID_CONVERTER),
        default_media_type="application/json",
        max_result_window=RECORDS_REST_MAX_RESULT_WINDOW,
        error_handlers=dict(),
        read_permission_factory_imp=PatronOwnerPermission,
        # auth via search_factory
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
            "application/json": "invenio_app_ils.records.serializers:json_v1_response"
        },
        search_serializers={
            "application/json": "invenio_app_ils.records.serializers:json_v1_search",
            "text/csv": "invenio_app_ils.records.serializers:csv_v1_search",
        },
        search_serializers_aliases={
            "csv": "text/csv",
            "json": "application/json",
        },
        item_route="/vocabularies/<pid({}):pid_value>".format(VOCABULARY_PID_TYPE),
        list_route="/vocabularies/",
        default_media_type="application/json",
        max_result_window=RECORDS_REST_VOCAB_MAX_RESULT_WINDOW,
        error_handlers=dict(),
        read_permission_factory_imp=deny_all,
        list_permission_factory_imp=allow_all,
        create_permission_factory_imp=deny_all,
        update_permission_factory_imp=deny_all,
        delete_permission_factory_imp=deny_all,
    ),
    litid=dict(
        # Literature is a search endpoint that allows the user to search in
        # both the documents and series index.
        pid_type=LITERATURE_PID_TYPE,
        pid_minter=LITERATURE_PID_MINTER,
        pid_fetcher=LITERATURE_PID_FETCHER,
        search_class=LiteratureSearch,
        search_factory_imp="invenio_app_ils.literature.search:search_factory_literature",  # noqa
        record_serializers={
            "application/json": (
                "invenio_app_ils.literature.serializers:json_v1_response"
            )
        },
        search_serializers={
            "application/json": "invenio_app_ils.literature.serializers:json_v1_search",
            "text/csv": "invenio_app_ils.literature.serializers:csv_v1_search",
        },
        search_serializers_aliases={
            "csv": "text/csv",
            "json": "application/json",
        },
        item_route="/literature/<pid({}):pid_value>".format(LITERATURE_PID_TYPE),
        list_route="/literature/",
        default_media_type="application/json",
        max_result_window=RECORDS_REST_MAX_RESULT_WINDOW,
        error_handlers=dict(),
        read_permission_factory_imp=deny_all,
        list_permission_factory_imp=allow_all,  # auth via search filter
        create_permission_factory_imp=deny_all,
        update_permission_factory_imp=deny_all,
        delete_permission_factory_imp=deny_all,
    ),
)

# RECORDS REST sort options
# =========================
RECORDS_REST_SORT_OPTIONS = dict(
    document_requests=dict(  # DocumentRequestSearch.Meta.index
        created=dict(fields=["_created"], title="Recently added", order=1),
        bestmatch=dict(
            fields=["-_score"],
            title="Best match",
            order=2,
        ),
    ),
    documents=dict(  # DocumentSearch.Meta.index
        created=dict(fields=["_created"], title="Recently added", order=1),
        bestmatch=dict(
            fields=["-_score"],
            title="Best match",
            order=2,
        ),
        available_copies=dict(
            fields=["circulation.available_items_for_loan_count"],
            title="Available copies",
            order=3,
        ),
        mostloaned=dict(
            fields=["circulation.past_loans_count"],
            title="Most loaned",
            order=4,
        ),
        publication_year=dict(
            fields=["publication_year"],
            title="Publication year",
            order=5,
        ),
        title=dict(
            fields=["title.keyword"],
            title="Title",
            order=6,
        ),
        loan_requests=dict(
            fields=["circulation.pending_loans_count"],
            title="Loan requests",
            order=7,
        ),
    ),
    eitems=dict(  # ItemSearch.Meta.index
        created=dict(fields=["_created"], title="Recently added", order=1),
        bestmatch=dict(
            fields=["-_score"],
            title="Best match",
            order=2,
        ),
        title=dict(
            fields=["document.title.keyword"],
            title="Title",
            order=3,
        ),
    ),
    items=dict(  # ItemSearch.Meta.index
        created=dict(fields=["_created"], title="Recently added", order=1),
        bestmatch=dict(
            fields=["-_score"],
            title="Best match",
            order=2,
        ),
        title=dict(
            fields=["document.title.keyword"],
            title="Title",
            order=3,
        ),
    ),
    patrons=dict(  # PatronsSearch.Meta.index
        bestmatch=dict(
            fields=["-_score"],
            title="Best match",
            order=1,
        ),
    ),
    series=dict(  # SeriesSearch.Meta.index
        created=dict(fields=["_created"], title="Recently added", order=1),
        bestmatch=dict(
            fields=["-_score"],
            title="Best match",
            order=2,
        ),
        title=dict(
            fields=["title.keyword"],
            title="Title",
            order=3,
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
            access=dict(terms=dict(field="restricted")),
            tag=dict(terms=dict(field="tags", size=FACET_TAG_LIMIT)),
            language=dict(terms=dict(field="languages")),
            doctype=dict(terms=dict(field="document_type")),
            relation=dict(terms=dict(field="relation_types")),
            availability=dict(
                range=dict(
                    field="circulation.available_items_for_loan_count",
                    ranges=[{"key": "on shelf", "from": 1}],
                ),
                aggs={
                    "zero_doc_count_filter": {
                        "bucket_selector": {
                            "buckets_path": {"count": "_count"},
                            "script": "params.count > 0",
                        }
                    }
                },
            ),
            medium=dict(terms=dict(field="stock.mediums")),
        ),
        post_filters=dict(
            access=terms_filter("restricted"),
            doctype=terms_filter("document_type"),
            language=terms_filter("languages"),
            tag=terms_filter("tags"),
            availability=keyed_range_filter(
                "circulation.available_items_for_loan_count",
                {"on shelf": {"gt": 0}},
            ),
            relation=terms_filter("relation_types"),
            medium=terms_filter("stock.mediums"),
        ),
    ),
    document_requests=dict(  # DocumentRequestSearch.Meta.index
        aggs=dict(
            state=dict(terms=dict(field="state")),
            decline_reason=dict(terms=dict(field="decline_reason")),
        ),
        post_filters=dict(
            state=terms_filter("state"),
            decline_reason=terms_filter("decline_reason"),
        ),
    ),
    items=dict(  # ItemSearch.Meta.index
        aggs=dict(
            status=dict(terms=dict(field="status")),
            medium=dict(terms=dict(field="medium")),
            circulation=dict(
                terms=dict(field="circulation.state", missing="NOT_ON_LOAN")
            ),
            restrictions=dict(terms=dict(field="circulation_restriction")),
            location=dict(terms=dict(field="internal_location.location.name")),
            internal_location=dict(terms=dict(field="internal_location.name")),
            document_type=dict(terms=dict(field="document.document_type")),
        ),
        filters=dict(),
        post_filters=dict(
            circulation=default_value_when_missing_filter(
                "circulation.state", "NOT_ON_LOAN"
            ),
            status=terms_filter("status"),
            medium=terms_filter("medium"),
            restrictions=terms_filter("circulation_restriction"),
            location=terms_filter("internal_location.location.name"),
            internal_location=terms_filter("internal_location.name"),
            document_type=terms_filter("document.document_type"),
        ),
    ),
    eitems=dict(
        aggs=dict(
            access=dict(terms=dict(field="open_access")),
            eitem_type=dict(terms=dict(field="eitem_type")),
            has_files=dict(
                filters=dict(
                    filters=dict(
                        has_files=dict(exists=dict(field="files.file_id")),
                        no_files=dict(
                            bool=dict(must_not=dict(exists=dict(field="files.file_id")))
                        ),
                    )
                )
            ),
        ),
        post_filters=dict(
            eitem_type=terms_filter("eitem_type"),
            access=terms_filter("open_access"),
            has_files=exists_value_filter("files.file_id", filter_value="has_files"),
        ),
    ),
    series=dict(  # SeriesSearch.Meta.index
        aggs=dict(
            moi=dict(terms=dict(field="mode_of_issuance")),
            language=dict(terms=dict(field="languages")),
            relation=dict(terms=dict(field="relation_types")),
            sertype=dict(terms=dict(field="series_type")),
        ),
        post_filters=dict(
            moi=terms_filter("mode_of_issuance"),
            language=terms_filter("languages"),
            relation=terms_filter("relation_types"),
            sertype=terms_filter("series_type"),
        ),
    ),
)

# ILS
# ===

ILS_VIEWS_PERMISSIONS_FACTORY = views_permissions_factory
"""Permissions factory for ILS views to handle all ILS actions."""

ILS_INDEXER_TASK_DELAY = timedelta(seconds=2)
"""Trigger delay for celery tasks to index referenced records."""

INDEXER_DEFAULT_DOC_TYPE = None
"""Set deprecated doc type to none."""

# The HTML tags allowed with invenio_records_rest.schemas.fields.sanitizedhtml
ALLOWED_HTML_TAGS = []

# Stats
# =====
STATS_EVENTS = {
    "file-download": {
        "signal": "invenio_app_ils.signals.file_downloaded",
        "templates": "invenio_app_ils.stats.file_download",
        "event_builders": [
            "invenio_app_ils.eitems.api:eitem_event_builder",
            "invenio_stats.contrib.event_builders.file_download_event_builder",
        ],
        "cls": EventsIndexer,
        "params": {
            "preprocessors": [
                "invenio_stats.processors:flag_robots",
                lambda doc: doc if not doc["is_robot"] else None,
                "invenio_stats.processors:flag_machines",
                "invenio_stats.processors:anonymize_user",
                "invenio_stats.contrib.event_builders:build_file_unique_id",
            ],
            "double_click_window": 30,
            "suffix": "%Y-%m",
        },
    },
    "record-view": {
        "signal": "invenio_app_ils.signals.record_viewed",
        "templates": "invenio_stats.contrib.record_view",
        "event_builders": [
            "invenio_stats.contrib.event_builders.record_view_event_builder"
        ],
        "cls": EventsIndexer,
        "params": {
            "preprocessors": [
                "invenio_stats.processors:flag_robots",
                lambda doc: doc if not doc["is_robot"] else None,
                "invenio_stats.processors:flag_machines",
                "invenio_stats.processors:anonymize_user",
                "invenio_stats.contrib.event_builders:build_record_unique_id",
            ],
            "double_click_window": 30,
            "suffix": "%Y-%m",
        },
    },
}

STATS_AGGREGATIONS = {
    "file-download-agg": dict(
        templates="invenio_app_ils.stats.aggregations.aggr_file_download",
        cls=StatAggregator,
        params=dict(
            event="file-download",
            field="file_id",
            interval="day",
            index_interval="month",
            copy_fields=dict(
                bucket_id="bucket_id",
                file_id="file_id",
                file_key="file_key",
                size="size",
                eitem_pid="eitem_pid",
                document_pid="document_pid",
            ),
            metric_fields=dict(
                unique_count=(
                    "cardinality",
                    "unique_session_id",
                    {"precision_threshold": 1000},
                )
            ),
        ),
    ),
    "record-view-agg": dict(
        templates="invenio_stats.contrib.aggregations.aggr_record_view",
        cls=StatAggregator,
        params=dict(
            event="record-view",
            field="pid_value",
            interval="day",
            index_interval="month",
            copy_fields=dict(pid_type="pid_type", pid_value="pid_value"),
            metric_fields=dict(
                unique_count=(
                    "cardinality",
                    "unique_session_id",
                    {"precision_threshold": 1000},
                )
            ),
        ),
    ),
}

STATS_QUERIES = {
    "file-download-by-document": dict(
        cls=ESTermsQuery,
        permission_factory=None,
        params=dict(
            index="stats-file-download",
            copy_fields=dict(
                bucket_id="bucket_id",
                file_id="file_id",
                file_key="file_key",
                size="size",
                eitem_pid="eitem_pid",
                document_pid="document_pid",
            ),
            required_filters=dict(document_pid="document_pid"),
            metric_fields=dict(
                count=("sum", "count", {}),
                unique_count=("sum", "unique_count", {}),
            ),
        ),
    ),
    "record-view": dict(
        cls=ESTermsQuery,
        permission_factory=None,
        params=dict(
            index="stats-record-view",
            copy_fields=dict(pid_type="pid_type", pid_value="pid_value"),
            required_filters=dict(pid_value="pid_value"),
            metric_fields=dict(
                count=("sum", "count", {}),
                unique_count=("sum", "unique_count", {}),
            ),
        ),
    ),
}

# List of available vocabularies
ILS_VOCABULARIES = [
    "acq_medium",
    "acq_order_line_payment_mode",
    "acq_order_line_purchase_type",
    "acq_payment_mode",
    "acq_recipient",
    "affiliation_identifier_scheme",
    "alternative_identifier_scheme",
    "alternative_title_type",
    "author_identifier_scheme",
    "author_role",
    "author_type",
    "conference_identifier_scheme",
    "country",
    "currencies",
    "doc_req_type",
    "doc_req_payment_method",
    "doc_identifiers_materials",
    "doc_req_medium",
    "doc_subjects",
    "eitem_sources",
    "identifier_scheme",
    "ill_item_type",
    "ill_payment_mode",
    "item_medium",
    "language",
    "license",
    "provider_type",
    "series_identifier_scheme",
    "series_url_access_restriction",
    "tag",
]

ILS_VOCABULARY_SOURCES = {
    "json": "invenio_app_ils.vocabularies.sources:json_source",
    "opendefinition": (
        "invenio_app_ils.vocabularies.sources:opendefinition_source"
    ),  # noqa
}

OPENDEFINITION_JSONRESOLVER_HOST = "inveniosoftware.org"

FILES_REST_PERMISSION_FACTORY = "invenio_app_ils.permissions:files_permission"

ILS_RECORDS_EXPLICIT_PERMISSIONS_ENABLED = False
"""Enable records restrictions by `_access` field.

When enabled, it allows to define explicit permissions for each record to
provide read access to specific users or roles.
When disabled, it will avoid checking for user ids and roles on each search
query and record fetch.
"""

ILS_LITERATURE_COVER_URLS_BUILDER = build_ils_demo_cover_urls
"""Default implementation for building cover urls in document serializer."""

# Namespaces for fields added to the metadata schema
ILS_RECORDS_METADATA_NAMESPACES = {}

# Fields added to the metadata schema
ILS_RECORDS_METADATA_EXTENSIONS = {}

# Define the class for the Anonymous and SystemAgent patrons
ILS_PATRON_ANONYMOUS_CLASS = AnonymousPatron
ILS_PATRON_SYSTEM_AGENT_CLASS = SystemAgent

DB_VERSIONING_USER_MODEL = None

# Feature Toggles
ILS_SELF_CHECKOUT_ENABLED = False

# Use default frontpage
THEME_FRONTPAGE = False

# Default template to render.
PAGES_DEFAULT_TEMPLATE = "invenio_pages/default.html"
# default app theme
APP_THEME = ["semantic-ui"]
