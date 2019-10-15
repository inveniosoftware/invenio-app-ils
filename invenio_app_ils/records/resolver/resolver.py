# -*- coding: utf-8 -*-
#
# Copyright (C) 2018-2019 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""Resolvers common."""

from invenio_app_ils.errors import PatronNotFoundError
from invenio_app_ils.proxies import current_app_ils_extension


def get_field_value_for_record(record_cls, record_pid, field_name):
    """Return the given field value for a given record PID."""
    record = record_cls.get_record_by_pid(record_pid)

    if not record or field_name not in record:
        message = "{0} not found in record {1}".format(field_name, record_pid)
        raise KeyError(message)

    return record[field_name]


def get_patron(patron_pid):
    """Resolve a Patron for a given field."""
    if not patron_pid:
        return {}

    try:
        return current_app_ils_extension.patron_cls.get_patron(
            patron_pid
        ).dumps_loader()
    except PatronNotFoundError:
        return {}
