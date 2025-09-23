# -*- coding: utf-8 -*-
#
# Copyright (C) 2019-2021 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""Configuration for Invenio ILS providers module."""

from invenio_records_rest.facets import terms_filter

from invenio_app_ils.config import RECORDS_REST_MAX_RESULT_WINDOW
from invenio_app_ils.permissions import (
    backoffice_permission,
    backoffice_read_permission,
)

from .api import PROVIDER_PID_FETCHER, PROVIDER_PID_MINTER, PROVIDER_PID_TYPE, Provider
from .indexer import ProviderIndexer
from .search import ProviderSearch

_PROVIDER_CONVERTER = (
    'pid(provid, record_class="invenio_app_ils.providers.api:Provider")'
)

RECORDS_REST_ENDPOINTS = dict(
    provid=dict(
        pid_type=PROVIDER_PID_TYPE,
        pid_minter=PROVIDER_PID_MINTER,
        pid_fetcher=PROVIDER_PID_FETCHER,
        search_class=ProviderSearch,
        indexer_class=ProviderIndexer,
        record_class=Provider,
        record_loaders={
            "application/json": "invenio_app_ils.providers.loaders:provider_loader"
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
        list_route="/providers/",
        item_route="/providers/<{0}:pid_value>".format(_PROVIDER_CONVERTER),
        default_media_type="application/json",
        max_result_window=RECORDS_REST_MAX_RESULT_WINDOW,
        error_handlers=dict(),
        read_permission_factory_imp=backoffice_read_permission,
        list_permission_factory_imp=backoffice_read_permission,
        create_permission_factory_imp=backoffice_permission,
        update_permission_factory_imp=backoffice_permission,
        delete_permission_factory_imp=backoffice_permission,
    ),
)

RECORDS_REST_SORT_OPTIONS = dict(
    providers=dict(  # ProvidersSearch.Meta.index
        name=dict(fields=["name.keyword"], title="Name", order=1),
        created=dict(
            fields=["_created"],
            title="Recently added",
            order=2,
        ),
        bestmatch=dict(
            fields=["-_score"],
            title="Best match",
            order=3,
        ),
    ),
)

FACET_TYPE_LIMIT = 5

RECORDS_REST_FACETS = dict(
    providers=dict(  # ProvidersSearch.Meta.index
        aggs=dict(
            type=dict(terms=dict(field="type", size=FACET_TYPE_LIMIT)),
        ),
        post_filters=dict(
            type=terms_filter("type"),
        ),
    )
)
