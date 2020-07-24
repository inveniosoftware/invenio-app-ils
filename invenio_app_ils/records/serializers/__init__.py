# -*- coding: utf-8 -*-
#
# Copyright (C) 2018-2020 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""ILS serializers."""

from flask import current_app
from invenio_records_rest.serializers.csv import CSVSerializer
from invenio_records_rest.serializers.json import JSONSerializer
from invenio_records_rest.serializers.response import (add_link_header,
                                                       search_responsify)

from invenio_app_ils.records.schemas.json import ILSRecordSchemaJSONV1


def record_responsify_no_etag(serializer, mimetype):
    """Create a Records-REST response serializer, without ETag/Last-Modified.

    Since, in Invenio, the ETag is calculated by default simply on the record
    revision ID, it does not take into account the extra fields added
    when serializing.
    As result, the client will never fetch and get the changes of these extra
    fields until the record revision will change.

    Removing the ETag could lead to the "lost update problem", where a resource
    could be updated via a PUT request even if it was previously updated.
    However, it looks like that browsers are not sending the If-Match/ETag
    headers on PUT requests.
    """

    def view(pid, record, code=200, headers=None, links_factory=None):
        response = current_app.response_class(
            serializer.serialize(pid, record, links_factory=links_factory),
            mimetype=mimetype)
        response.status_code = code
        response.cache_control.no_cache = True
        # etag/last-modified headers removed

        if headers is not None:
            response.headers.extend(headers)

        if links_factory is not None:
            add_link_header(response, links_factory(pid))

        return response

    return view


csv_v1 = CSVSerializer(ILSRecordSchemaJSONV1, csv_excluded_fields=[])
csv_v1_response = record_responsify_no_etag(csv_v1, "text/csv")
csv_v1_search = search_responsify(csv_v1, "text/csv")

json_v1 = JSONSerializer(ILSRecordSchemaJSONV1, replace_refs=True)
json_v1_response = record_responsify_no_etag(json_v1, "application/json")
json_v1_search = search_responsify(json_v1, "application/json")
