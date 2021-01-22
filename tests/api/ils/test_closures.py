# -*- coding: utf-8 -*-
#
# Copyright (C) 2020 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""Location closures tests."""

import json

import arrow
from flask import url_for

from invenio_app_ils.closures.api import find_next_open_date
from invenio_app_ils.proxies import current_app_ils
from tests.helpers import user_login

_HTTP_OK = [200, 201, 204]
_LOCATION_PID = "locid-1"
_LOCATION_NAME = "Location name"
_ITEM_ENDPOINT = "invenio_records_rest.locid_item"
_LIST_ENDPOINT = "invenio_records_rest.locid_list"
_WEEKDAYS = [
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "sunday",
]
_DEFAULT_TIMES = [
    {"start_time": "08:00", "end_time": "12:00"},
    {"start_time": "13:00", "end_time": "18:00"},
]


def _build_location_closures_data(closed_weekdays, exceptions):
    opening_weekdays = []
    for name in _WEEKDAYS:
        is_open = name not in closed_weekdays
        obj = {"weekday": name, "is_open": is_open}
        if is_open:
            obj["times"] = _DEFAULT_TIMES
        opening_weekdays.append(obj)

    opening_exceptions = []
    for start_date, end_date, is_open in exceptions:
        opening_exceptions.append(
            {
                "title": "%s - %s" % (start_date, end_date),
                "start_date": start_date,
                "end_date": end_date,
                "is_open": is_open,
            }
        )

    return {
        "opening_weekdays": opening_weekdays,
        "opening_exceptions": opening_exceptions,
    }


def _date_from_string(date_string):
    return arrow.get(date_string).date()


def test_location_permissions(client, testdata, json_headers, users):
    """Test location endpoints permissions."""
    dummy_location = dict(
        name=_LOCATION_NAME,
        opening_weekdays=[
            {"weekday": w, "is_open": True, "times": _DEFAULT_TIMES}
            for w in _WEEKDAYS
        ],
        opening_exceptions=[],
    )
    tests = [
        ("admin", _HTTP_OK, dummy_location),
        ("librarian", _HTTP_OK, dummy_location),
        ("patron1", [403], dummy_location),
        ("anonymous", [401], dummy_location),
    ]
    read_statuses = [200]

    def _test_list(expected_status):
        """Test get list."""
        url = url_for(_LIST_ENDPOINT)
        res = client.get(url, headers=json_headers)
        assert res.status_code in expected_status

    def _test_create(expected_status, data):
        """Test record creation."""
        url = url_for(_LIST_ENDPOINT)
        res = client.post(url, headers=json_headers, data=json.dumps(data))
        assert res.status_code in expected_status

        if res.status_code < 400:
            record = res.get_json()["metadata"]
            assert record["name"] == _LOCATION_NAME
            return record["pid"]

    def _test_update(expected_status, data, pid):
        """Test record update."""
        pid_value = pid or _LOCATION_PID
        url = url_for(_ITEM_ENDPOINT, pid_value=pid_value)
        res = client.put(url, headers=json_headers, data=json.dumps(data))
        assert res.status_code in expected_status
        if res.status_code < 400:
            record = res.get_json()["metadata"]
            assert record["name"] == _LOCATION_NAME

    def _test_read(expected_status, pid):
        """Test record read."""
        pid_value = pid or _LOCATION_PID
        url = url_for(_ITEM_ENDPOINT, pid_value=pid_value)
        res = client.get(url, headers=json_headers)
        assert res.status_code in expected_status

    def _test_delete(expected_status, pid):
        """Test record delete."""
        pid_value = pid or _LOCATION_PID
        url = url_for(_ITEM_ENDPOINT, pid_value=pid_value)
        res = client.delete(url, headers=json_headers)
        assert res.status_code in expected_status

    for username, expected_status, data in tests:
        user_login(client, username, users)
        _test_list(read_statuses)
        pid = _test_create(expected_status, data)
        _test_update(expected_status, data, pid)
        _test_read(read_statuses, pid)
        _test_delete(expected_status, pid)


def test_location_validation(client, json_headers, users, testdata):
    def _test_update_location_closures(data, expected_code):
        url = url_for(
            "invenio_records_rest.locid_item", pid_value=_LOCATION_PID
        )
        res = client.get(url, headers=json_headers)
        assert res.status_code == 200
        metadata = res.get_json()["metadata"]
        metadata.update(data)
        res = client.put(url, headers=json_headers, data=json.dumps(metadata))
        assert res.status_code == expected_code

    def _test_update_weekdays(weekdays, expected_code):
        data = [
            {
                "weekday": name,
                "is_open": is_open,
                **({"times": _DEFAULT_TIMES} if is_open else {}),
            }
            for name, is_open in weekdays
        ]
        _test_update_location_closures(
            {"opening_weekdays": data, "opening_exceptions": []}, expected_code
        )

    def _test_update_times(times, expected_code):
        ref = "monday"
        times_data = [
            {"start_time": start, "end_time": end} for start, end in times
        ]
        data = [
            {
                "weekday": w,
                "is_open": w == ref,
                **({"times": times_data} if w == ref else {}),
            }
            for w in _WEEKDAYS
        ]
        _test_update_location_closures(
            {"opening_weekdays": data, "opening_exceptions": []}, expected_code
        )

    def _test_update_exceptions(closed_weekdays, exceptions, expected_code):
        _test_update_location_closures(
            _build_location_closures_data(closed_weekdays, exceptions),
            expected_code,
        )

    user_login(client, "librarian", users)

    # Weekdays

    _test_update_weekdays([[w, True] for w in _WEEKDAYS], 200)
    _test_update_weekdays([[w, True] for w in _WEEKDAYS[::-1]], 200)
    _test_update_weekdays([[w, False] for w in _WEEKDAYS], 400)
    _test_update_weekdays([[w, True] for w in _WEEKDAYS[:6]], 400)
    _test_update_weekdays([[w, True] for w in _WEEKDAYS[:6] + ["monday"]], 400)
    _test_update_weekdays([["foobar", True]], 400)

    # Hours

    _test_update_times([["08:00", "12:00"], ["13:00", "18:00"]], 200)
    _test_update_times([["13:00", "18:00"], ["08:00", "12:00"]], 200)
    _test_update_times([["08:00", "18:00"]], 200)
    _test_update_times([], 400)
    _test_update_times(
        [["08:00", "10:00"], ["11:00", "12:00"], ["13:00", "18:00"]], 400
    )
    _test_update_times([["8:00", "12:00"], ["13:00", "18:00"]], 400)
    _test_update_times([["08:00", "12:0"], ["13:00", "18:00"]], 400)
    _test_update_times([["08:00", ""], ["13:00", "18:00"]], 400)
    _test_update_times([["08:00", "12:00"], ["12:00", "18:00"]], 400)
    _test_update_times([["08:00", "12:00"], ["09:00", "11:00"]], 400)

    # Exceptions

    _test_update_exceptions(
        ["saturday", "sunday"],
        [
            ["2000-01-01", "2000-01-05", False],
            ["2000-01-07", "2000-01-09", True],
            ["2000-01-10", "2000-01-15", True],
        ],
        200,
    )

    _test_update_exceptions(
        ["saturday", "sunday"],
        [
            ["2000-01-12", "2000-01-17", True],
            ["2000-01-07", "2000-01-11", False],
            ["2000-01-02", "2000-01-04", True],
        ],
        200,
    )

    _test_update_exceptions(
        [],
        [
            ["2000-01-01", "2000-01-05", False],
            ["2000-01-04", "2000-01-08", False],
        ],
        400,
    )

    _test_update_exceptions(
        [],
        [
            ["2000-01-01", "2000-01-05", False],
            ["2000-01-04", "2000-01-08", True],
        ],
        400,
    )

    _test_update_exceptions(
        [],
        [
            ["2000-01-01", "2000-01-01", False],
            ["2000-01-01", "2000-01-01", False],
        ],
        400,
    )

    _test_update_exceptions(
        [],
        [
            ["2000-01-02", "2000-01-01", True],
        ],
        400,
    )


def test_find_next_open_date(app, db, testdata):
    def _update_location_closures_data(closed_weekdays, exceptions):
        Location = current_app_ils.location_record_cls
        record = Location.get_record_by_pid(_LOCATION_PID)

        record.update(
            _build_location_closures_data(closed_weekdays, exceptions)
        )
        record.commit()
        db.session.commit()
        current_app_ils.location_indexer.index(record)

        return record

    def _test(start_date, expected_next_open_date):
        next_open = find_next_open_date(
            _LOCATION_PID, _date_from_string(start_date)
        )
        if expected_next_open_date:
            assert next_open == _date_from_string(expected_next_open_date)
        else:
            assert next_open is None

    """
    Mon. Tue. Wed. Thu. Fri. Sat. Sun.
     27   28   29   30   31  -01  -02
    x03  x04  x05   06   07  -08  -09
    x10  x11  x12  x13  x14  x15  x16
    x17  x18  x19  x20  x21  x22  -23
    x24   25   26  x27  x28  o29  o30
     31   01   02   03   04  -05  -06
    """

    closed_weekdays = ["saturday", "sunday"]
    exceptions = [
        ["2000-01-03", "2000-01-05", False],  # Mon. - Wed.
        ["2000-01-09", "2000-01-22", False],  # Sun. - Sat.
        ["2000-01-24", "2000-01-24", False],  # Mon.
        ["2000-01-27", "2000-01-28", False],  # Thu. - Fri.
        ["2000-01-29", "2000-01-30", True],  # Sat. - Sun.
    ]
    _update_location_closures_data(closed_weekdays, exceptions)

    _test("2000-01-01", "2000-01-06")
    _test("2000-01-04", "2000-01-06")
    _test("2000-01-06", "2000-01-06")
    _test("2000-01-07", "2000-01-07")

    _test("2000-01-09", "2000-01-25")
    _test("2000-01-13", "2000-01-25")

    _test("2000-01-26", "2000-01-26")
    _test("2000-01-27", "2000-01-29")
    _test("2000-01-30", "2000-01-30")

    _test("2000-02-05", "2000-02-07")
