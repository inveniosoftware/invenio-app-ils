# -*- coding: utf-8 -*-
#
# Copyright (C) 2018-2019 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""Invenio App ILS loaders."""

import json

from flask import request
from invenio_records_rest.loaders import marshmallow_loader
from invenio_rest.errors import RESTValidationError
from marshmallow import ValidationError
from marshmallow import __version_info__ as marshmallow_version

from .schemas.json.document import DocumentSchemaV1
from .schemas.json.document_request import DocumentRequestSchemaV1
from .schemas.json.internal_location import InternalLocationSchemaV1
from .schemas.json.items import EItemSchemaV1, ItemSchemaV1
from .schemas.json.location import LocationSchemaV1
from .schemas.json.series import SeriesSchemaV1
from .schemas.json.tag import TagSchemaV1


def _flatten_marshmallow_errors(errors, parent_fields=[]):
    """Flatten marshmallow errors."""
    res = []
    for field, error in errors.items():
        if isinstance(error, list):
            res.append(
                dict(
                    # To prevent a breaking change we could add:
                    parents=parent_fields,
                    field=field,
                    message=' '.join([str(x) for x in error])
                )
            )
        elif isinstance(error, dict):
            res.extend(_flatten_marshmallow_errors(
                error,
                parent_fields=[*parent_fields, field]
            ))
    return res


class MarshmallowErrors(RESTValidationError):
    """Marshmallow validation errors.

    Responsible for formatting a JSON response to a user when a validation
    error happens.
    """

    def __init__(self, errors):
        """Store marshmallow errors."""
        self._it = None
        self.errors = _flatten_marshmallow_errors(errors)
        super(MarshmallowErrors, self).__init__()

    def __str__(self):
        """Print exception with errors."""
        return "{base}. Encountered errors: {errors}".format(
            base=super(RESTValidationError, self).__str__(),
            errors=self.errors)

    def __iter__(self):
        """Get iterator."""
        self._it = iter(self.errors)
        return self

    def next(self):
        """Python 2.7 compatibility."""
        return self.__next__()  # pragma: no cover

    def __next__(self):
        """Get next file item."""
        return next(self._it)

    def get_body(self, environ=None):
        """Get the request body."""
        body = dict(
            status=self.code,
            message=self.get_description(environ),
        )

        if self.errors:
            body['errors'] = self.errors

        return json.dumps(body)


def marshmallow_loader_updated(schema_class):
    """Marshmallow loader for JSON requests."""
    def json_loader():
        request_json = request.get_json()

        context = {}
        pid_data = request.view_args.get('pid_value')
        if pid_data:
            pid, record = pid_data.data
            context['pid'] = pid
            context['record'] = record
        if marshmallow_version[0] < 3:
            result = schema_class(context=context).load(request_json)
            if result.errors:
                raise MarshmallowErrors(result.errors)
        else:
            # From Marshmallow 3 the errors on .load() are being raised rather
            # than returned. To adjust this change to our flow we catch these
            # errors and reraise them instead.
            try:
                result = schema_class(context=context).load(request_json)
            except ValidationError as error:
                raise MarshmallowErrors(error.messages)

        return result.data
    return json_loader


def ils_marshmallow_loader(schema_class):
    """Marshmallow loader for JSON requests."""
    def json_loader():
        try:
            return original_loader()
        except MarshmallowErrors as me:
            for error in me.errors:
                parent_path = [str(x) for x in error['parents']]
                error['field'] = '.'.join([*parent_path, error['field']])
            raise me

    original_loader = marshmallow_loader_updated(schema_class)
    return json_loader


document_loader = ils_marshmallow_loader(DocumentSchemaV1)
document_request_loader = marshmallow_loader(DocumentRequestSchemaV1)
eitem_loader = marshmallow_loader(EItemSchemaV1)
internal_location_loader = marshmallow_loader(InternalLocationSchemaV1)
item_loader = ils_marshmallow_loader(ItemSchemaV1)
location_loader = marshmallow_loader(LocationSchemaV1)
series_loader = marshmallow_loader(SeriesSchemaV1)
tag_loader = marshmallow_loader(TagSchemaV1)
