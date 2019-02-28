# -*- coding: utf-8 -*-
#
# This file is part of Invenio.
# Copyright (C) 2016-2018 CERN.
#
# Invenio is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""Serialization response factories.

Responsible for creating a HTTP response given the output of a serializer.
"""

from __future__ import absolute_import, print_function

from flask import current_app


def responsify(serializer, record_serializer, mimetype):
    """Create a Records-REST response serializer.

    :param serializer: Serializer instance.
    :param record_serializer: Nested records serializer.
    :param mimetype: MIME type of response.
    :returns: Function that generates a record HTTP response.
    """
    def view(loans, errors, code=200, headers=None, links_factory=None):
        """Create response view."""
        response = current_app.response_class(
            serializer.serialize(loans, errors, record_serializer,
                                 links_factory=links_factory),
            mimetype=mimetype)
        response.status_code = code
        if headers is not None:
            response.headers.extend(headers)
        return response

    return view
