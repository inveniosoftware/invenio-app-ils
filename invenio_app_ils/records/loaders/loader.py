# -*- coding: utf-8 -*-
#
# Copyright (C) 2018 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""Marshmallow loaders."""

from __future__ import absolute_import

import json

from flask import request
from invenio_rest.errors import RESTValidationError


def marshmallow_loader(schema_class, partial=False):
    """Marshmallow loader."""
    def schema_loader():
        request_json = request.get_json()
        result = schema_class(partial=partial).load(request_json)
        if result.errors:
            raise MarshmallowErrors(result.errors)
        return result.data

    return schema_loader


class MarshmallowErrors(RESTValidationError):
    """Marshmallow validation errors."""

    def __init__(self, errors):
        """Store marshmallow errors."""
        self.errors = errors
        super(MarshmallowErrors, self).__init__()

    def __str__(self):
        """Print exception with errors."""
        return "{base}. Encountered errors: {errors}".format(
            base=super(RESTValidationError, self).__str__(), errors=self.errors
        )

    def iter_errors(self, errors, prefix=""):
        """Iterator over marshmallow errors."""
        res = []
        for field, error in errors.items():
            if isinstance(error, list):
                res.append(
                    dict(
                        field="{0}{1}".format(prefix, field),
                        message=" ".join([str(x) for x in error]),
                    )
                )
            elif isinstance(error, dict):
                res.extend(
                    self.iter_errors(
                        error, prefix="{0}{1}.".format(prefix, field)
                    )
                )
        return res

    def get_body(self, environ=None):
        """Get the request body."""
        body = dict(status=self.code, message=self.get_description(environ))

        if self.errors:
            body["errors"] = self.iter_errors(self.errors)

        return json.dumps(body)
