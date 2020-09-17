# -*- coding: utf-8 -*-
#
# Copyright (C) 2020 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""Location closures tasks."""

from copy import deepcopy
from datetime import date

import arrow
from celery import shared_task
from invenio_db import db

from invenio_app_ils.proxies import current_app_ils


@shared_task
def clean_locations_past_closures_exceptions():
    """Deletes all past exceptions."""
    today = date.today()
    search_cls = current_app_ils.location_search_cls()
    location = current_app_ils.location_record_cls
    for hit in search_cls.scan():
        location_pid = hit.pid
        record = location.get_record_by_pid(location_pid)
        cleaned_exceptions = []
        modified = False
        for item in record["opening_exceptions"]:
            end_date = arrow.get(item["end_date"]).date()
            if end_date >= today:
                cleaned_exceptions.append(item)
            else:
                modified = True
        if modified:
            record["opening_exceptions"] = cleaned_exceptions
            record.commit()
            db.session.commit()
            current_app_ils.location_indexer.index(record)
