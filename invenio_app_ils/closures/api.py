# -*- coding: utf-8 -*-
#
# Copyright (C) 2020-2025 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""ILS location closures API."""

from datetime import date, timedelta
from calendar import day_name

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
    location = current_app_ils.location_record_cls.get_record_by_pid(location_pid)
    _infinite_loop_guard = date + timedelta(days=365)
    while date < _infinite_loop_guard:
        if _is_open_on(location, date):
            return date
        date += _ONE_DAY_INCREMENT

    # Termination is normally guaranteed if there is at least one weekday open
    raise IlsException(
        description="Cannot find any date for which the "
        "location %s is open after the given date %s."
        "Please check opening/closures dates." % (location_pid, date.isoformat())
    )


def get_closure_periods(location, start, end):
    """
    Return date ranges within a specified period when the location is closed.
    """
    if (
        not location
        or not isinstance(start, date)
        or not isinstance(end, date)
        or start > end
    ):
        raise ValueError("Invalid input parameters")

    one_day_delta = timedelta(days=1)

    weekday_name_to_index = {name.lower(): i for i, name in enumerate(day_name)}
    closed_weekdays = set()
    for weekday_rule in location.get("opening_weekdays", []):
        if weekday_rule.get("is_open") is False:
            weekday_str = weekday_rule.get("weekday", "").lower()
            closed_weekdays.add(weekday_name_to_index[weekday_str])

    exception_overrides = {}
    for exception in location.get("opening_exceptions", []):
        is_closed_override = not exception.get("is_open")

        ex_start = date.fromisoformat(exception["start_date"])
        ex_end = date.fromisoformat(exception["end_date"])

        current_ex_date = ex_start
        while current_ex_date <= ex_end:
            exception_overrides[current_ex_date] = is_closed_override
            current_ex_date += one_day_delta

    closure_periods = []
    closure_streak_start = None
    current_date = start

    while current_date <= end:
        is_date_closed = False

        override_status = exception_overrides.get(current_date)

        if override_status is not None:
            is_date_closed = override_status
        else:
            if current_date.weekday() in closed_weekdays:
                is_date_closed = True

        if is_date_closed:
            if closure_streak_start is None:
                closure_streak_start = current_date
        else:
            if closure_streak_start is not None:
                closure_periods.append(
                    {"start": closure_streak_start, "end": current_date - one_day_delta}
                )
                closure_streak_start = None

        current_date += one_day_delta

    # Handle trailing closed period
    if closure_streak_start is not None:
        closure_periods.append({"start": closure_streak_start, "end": end})

    return closure_periods
