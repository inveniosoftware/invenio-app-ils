# -*- coding: utf-8 -*-
#
# Copyright (C) 2018-2020 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""Ils Records API."""

from flask import current_app
from invenio_jsonschemas import current_jsonschemas
from invenio_pidstore.models import PersistentIdentifier
from invenio_pidstore.resolver import Resolver
from invenio_records.api import Record
from invenio_rest.errors import FieldError
from jsonschema.exceptions import ValidationError
from werkzeug.utils import cached_property

from invenio_app_ils.errors import IlsValidationError


class RecordValidator(object):
    """ILS record validator."""

    def validate(self, record, **kwargs):
        """Validate record before create and commit.

        :param record: Record to be validated.
        :param kwargs: Keyword arguments passed from RecordBase:validate.
        """
        pass


class IlsRecord(Record):
    """Ils record class."""

    CURATOR_TYPES = ["user_id", "script",  "import"]

    _validator = RecordValidator()

    @cached_property
    def pid(self):
        """Get the PersistentIdentifier for this record."""
        return PersistentIdentifier.get(
            pid_type=self._pid_type, pid_value=self["pid"]
        )

    @staticmethod
    def pid_type_to_record_class(pid_type):
        """Get the record class from the pid_type."""
        endpoints_cfg = current_app.config["RECORDS_REST_ENDPOINTS"]
        return endpoints_cfg[pid_type]["record_class"]

    @classmethod
    def get_record_by_pid(cls, pid_value, with_deleted=False, pid_type=None):
        """Get ils record by pid value."""
        if pid_type is None:
            pid_type = cls._pid_type
        else:
            new_cls = cls.pid_type_to_record_class(pid_type)
            return new_cls.get_record_by_pid(
                pid_value, with_deleted=with_deleted
            )

        resolver = Resolver(
            pid_type=pid_type, object_type="rec", getter=cls.get_record
        )
        _, record = resolver.resolve(str(pid_value))
        return record

    @classmethod
    def create(cls, data, id_=None, **kwargs):
        """Create IlsRecord record."""
        data["$schema"] = current_jsonschemas.path_to_url(cls._schema)
        return super().create(data, id_=id_, **kwargs)

    def clear(self):
        """Clear IlsRecord data."""
        super().clear()
        self["$schema"] = current_jsonschemas.path_to_url(self._schema)

    def validate(self, **kwargs):
        """Validate ILS record."""
        # JSON schema validation
        try:
            super().validate(**kwargs)
        except ValidationError as jve:
            path = ".".join(str(x) for x in jve.path)
            errors = [FieldError(path, jve.message)]
            raise IlsValidationError(
                description="Record validation error",
                errors=errors,
                original_exception=jve,
            )

        # Custom record validation
        if self._validator:
            self._validator.validate(self, **kwargs)
