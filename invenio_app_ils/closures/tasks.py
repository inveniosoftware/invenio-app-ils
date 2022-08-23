# -*- coding: utf-8 -*-
#
# Copyright (C) 2020 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""Location closures tasks."""

import json
from datetime import date, datetime, timedelta

import arrow
from celery import shared_task
from celery.app.control import Inspect
from flask import current_app
from invenio_circulation.proxies import current_circulation
from invenio_db import db

from invenio_app_ils.circulation.notifications.tasks import (
    celery_logger,
    send_loan_end_date_updated_notification,
)
from invenio_app_ils.circulation.search import get_active_loans
from invenio_app_ils.closures.api import find_next_open_date
from invenio_app_ils.ill.api import circulation_item_location_retriever
from invenio_app_ils.proxies import current_app_ils


def _log(action, data):
    """Structured logging."""
    log_msg = dict(
        name="ils_closures",
        action=action,
        data=data,
    )
    celery_logger.info(json.dumps(log_msg, sort_keys=True))


@shared_task
def clean_locations_past_closures_exceptions():
    """Deletes all past exceptions."""
    modified_count = 0
    today = date.today()
    search_cls = current_app_ils.location_search_cls()
    location = current_app_ils.location_record_cls
    for hit in search_cls.scan():
        location_pid = hit.pid
        record = location.get_record_by_pid(location_pid)
        cleaned_exceptions = []
        modified = False
        for item in record.get("opening_exceptions", []):
            end_date = arrow.get(item["end_date"]).date()
            if end_date >= today:
                cleaned_exceptions.append(item)
            else:
                modified = True
        if modified:
            modified_count += 1
            _log("clean_exceptions_before", record)
            record["opening_exceptions"] = cleaned_exceptions
            record.commit()
            db.session.commit()
            current_app_ils.location_indexer.index(record)
            _log("clean_exceptions_after", record)
    _log("clean_exceptions_end", dict(modified_count=modified_count))


def notify_location_updated(location_pid):
    """Schedules the deletion of past exceptions."""

    def is_already_running():
        inspect = Inspect(app=current_app.extensions["invenio-celery"].celery)
        filtered_results = filter(None, [inspect.scheduled(), inspect.active()])
        for results in filtered_results:
            for result in results.values():
                for task in result:
                    request = task["request"]
                    matches_name = (
                        request["name"] == extend_active_loans_location_closure.name
                    )
                    matches_location = request["args"][0] == location_pid
                    if matches_name and matches_location:
                        return True
        return False

    if not is_already_running():
        now = datetime.now()
        eta = datetime.combine(
            now.date(), current_app.config["EXTEND_LOANS_SCHEDULE_TIME"]
        )
        if eta <= now:
            eta += timedelta(days=1)

        extend_active_loans_location_closure.apply_async(args=[location_pid], eta=eta)


@shared_task
def extend_active_loans_location_closure(location_pid):
    """Extends all ongoing loans that would end on a closure."""
    modified_count = 0
    for hit in get_active_loans().scan():
        if circulation_item_location_retriever(hit.item_pid) == location_pid:
            current_end_date = arrow.get(hit.end_date).date()
            new_end_date = find_next_open_date(location_pid, current_end_date)
            if new_end_date != current_end_date:  # Update loan
                modified_count += 1
                loan = current_circulation.loan_record_cls.get_record_by_pid(hit.pid)
                _log("extend_loan_closure_before", loan)
                loan.update(end_date=new_end_date.isoformat())
                loan.commit()
                current_circulation.loan_indexer().index(loan)
                _log("extend_loan_closure_after", loan)
                send_loan_end_date_updated_notification.apply_async((loan,))
    db.session.commit()
    _log("extend_loan_closure_end", dict(modified_count=modified_count))
