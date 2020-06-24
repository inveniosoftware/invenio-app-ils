# -*- coding: utf-8 -*-
#
# Copyright (C) 2019 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""Location indexer APIs."""

from datetime import datetime

from celery import shared_task
from flask import current_app
from invenio_indexer.api import RecordIndexer

from invenio_app_ils.indexer import ReferencedRecordsIndexer
from invenio_app_ils.internal_locations.api import INTERNAL_LOCATION_PID_TYPE
from invenio_app_ils.items.api import ITEM_PID_TYPE
from invenio_app_ils.locations.api import LOCATION_PID_TYPE
from invenio_app_ils.proxies import current_app_ils


def get_internal_locations(location_pid):
    """Get referenced internal location."""
    referenced = []
    intloc_search_cls = current_app_ils.internal_location_search_cls
    intloc_record_cls = current_app_ils.internal_location_record_cls
    for iloc in (
        intloc_search_cls()
        .search_by_location_pid(location_pid=location_pid)
        .scan()
    ):
        intloc = intloc_record_cls.get_record_by_pid(iloc["pid"])
        referenced.append(
            dict(pid_type=INTERNAL_LOCATION_PID_TYPE, record=intloc)
        )
    return referenced


def get_items(location_pid):
    """Get referenced items."""
    referenced = []
    item_search_cls = current_app_ils.item_search_cls
    item_record_cls = current_app_ils.item_record_cls
    for item in (
        item_search_cls()
        .search_by_location_pid(location_pid=location_pid)
        .scan()
    ):
        item = item_record_cls.get_record_by_pid(item["pid"])
        referenced.append(dict(pid_type=ITEM_PID_TYPE, record=item))
    return referenced


@shared_task(ignore_result=True)
def index_referenced_records(location):
    """Index referenced records."""
    indexer = ReferencedRecordsIndexer()

    location_pid = location["pid"]
    indexed = dict(pid_type=LOCATION_PID_TYPE, record=location)

    indexer.index(indexed, get_internal_locations(location_pid))
    indexer.index(indexed, get_items(location_pid))


class LocationIndexer(RecordIndexer):
    """Indexer class for Location record."""

    def index(self, location, arguments=None, **kwargs):
        """Index an Location."""
        super().index(location)
        eta = datetime.utcnow() + current_app.config["ILS_INDEXER_TASK_DELAY"]
        index_referenced_records.apply_async((location,), eta=eta)
