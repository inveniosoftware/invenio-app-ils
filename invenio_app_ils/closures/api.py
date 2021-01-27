# -*- coding: utf-8 -*-
#
# Copyright (C) 2020 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""ILS location closures API."""

from datetime import timedelta

import arrow

from invenio_app_ils.errors import IlsException
from invenio_app_ils.proxies import current_app_ils

_ONE_DAY_INCREMENT = timedelta(days=1)  # Atomic increment


def _is_in_interval(date, interval):
    """Checks if a date is included in an interval."""
    return (
        arrow.get(interval["start_date"]).date()
        <= date
        <= arrow.get(interval["end_date"]).date()
    )


def _is_normally_open(location, date):
    """Checks if the location is normally opened on a given date."""
    opening = location["opening_weekdays"]
    opening_weekday = opening[date.weekday()]
    return opening_weekday["is_open"]


def _is_exceptionally_open(location, date):
    """Checks if the location is exceptionally opened on a given date."""
    for exception in location.get("opening_exceptions", []):
        if _is_in_interval(date, exception):
            return exception["is_open"]
    return None  # Date is not included in any interval


def _is_open_on(location, date):
    """Checks if the location is open or closed on a given date."""
    exceptionally_open = _is_exceptionally_open(location, date)
    if exceptionally_open is not None:
        return exceptionally_open
    return _is_normally_open(location, date)


def find_next_open_date(location_pid, date):
    """Finds the next day where this location is open."""
    location = current_app_ils.location_record_cls.get_record_by_pid(
        location_pid
    )
    _infinite_loop_guard = date + timedelta(days=365)
    while date < _infinite_loop_guard:
        if _is_open_on(location, date):
            return date
        date += _ONE_DAY_INCREMENT

    # Termination is normally guaranteed if there is at least one weekday open
    raise IlsException(
        description="Cannot find any date for which the "
        "location %s is open after the given date %s."
        "Please check opening/closures dates."
        % (location_pid, date.isoformat())
    )
