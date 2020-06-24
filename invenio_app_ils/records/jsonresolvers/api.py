# -*- coding: utf-8 -*-
#
# Copyright (C) 2019 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""Invenio App ILS jsonresolver module."""

from invenio_pidstore.errors import PersistentIdentifierError


def get_field_value_for_record(record_cls, record_pid, field_name):
    """Return the given field value for a given record PID."""
    record = record_cls.get_record_by_pid(record_pid)

    if not record or field_name not in record:
        message = "{0} not found in record {1}".format(field_name, record_pid)
        raise KeyError(message)

    return record[field_name]


def get_pid_or_default(default_value):
    """Catch not existing pid exception and return `default_value`."""
    def decorator(f):
        def _inner(*args, **kwargs):
            try:
                return f(*args, **kwargs)
            except PersistentIdentifierError:
                return default_value
        return _inner
    return decorator


def pick(obj, *keys):
    """Pick and return only the specified keys."""
    return {k: obj.get(k) for k in obj.keys() if k in keys}
