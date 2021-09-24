# -*- coding: utf-8 -*-
#
# Copyright (C) 2020 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""Response serializers for circulation module."""
import json

from flask import current_app


def bulk_loan_extend_responsify(serializer,
                                mimetype):
    """Bulk loan extend serializer.

    :param schema_class: Serializer instance.
    :param mimetype: MIME type of response.
    """

    def view(extended_loans, not_extended_loans,
             code=200, headers=None, **kwargs):
        """Generate the response object."""
        response_data = {"extended_loans": [],
                         "not_extended_loans": []}
        for loan in extended_loans:
            response_data["extended_loans"]\
                .append(serializer.serialize(loan["pid"], loan))
        for loan in not_extended_loans:
            response_data["not_extended_loans"]\
                .append(serializer.serialize(loan["pid"], loan))

        response = current_app.response_class(
            json.dumps(response_data),
            mimetype=mimetype)
        response.status_code = code

        if headers is not None:
            response.headers.extend(headers)
        return response

    return view
