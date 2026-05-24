# SPDX-FileCopyrightText: 2025-2025 CERN.
# SPDX-License-Identifier: MIT

"""Invenio App ILS histogram stats response serializers."""

import json

from flask import current_app


def histogram_stats_responsify(schema_class, mimetype):
    """Histogram stats response serializer.

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
