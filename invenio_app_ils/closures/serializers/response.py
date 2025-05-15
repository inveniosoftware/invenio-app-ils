# -*- coding: utf-8 -*-
#
# This file is part of Invenio.
# Copyright (C) 2025-2025 CERN.
#
# Invenio is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""Invenio App ILS Closures response serializers."""

import json
from flask import current_app


def closure_periods_responsify(schema_class, mimetype):
    """Closure periods response serializer.

    :param schema_class: Schema instance.
    :param mimetype: MIME type of response.
    """

    def view(data, code=200, headers=None):
        """Generate the response object."""
        response_data = schema_class().dump(data)

        response = current_app.response_class(
            json.dumps(response_data), mimetype=mimetype
        )
        response.status_code = code

        if headers is not None:
            response.headers.extend(headers)
        return response

    return view
