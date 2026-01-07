# -*- coding: utf-8 -*-
#
# Copyright (C) 2025 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""Invenio App ILS histogram stats views."""

from invenio_app_ils.stats.histogram.serializers import histogram_stats_response


def create_histogram_view(blueprint, app, pid_type, resource_cls, url_prefix):
    """Add url rule for histogram view."""

    assert url_prefix.startswith("/"), "url_prefix must start with /"
    assert not url_prefix.endswith("/"), "url_prefix must not end with /"

    endpoints = app.config.get("RECORDS_REST_ENDPOINTS")
    record_endpoint = endpoints.get(pid_type)
    default_media_type = record_endpoint.get("default_media_type")
    histogram_serializers = {"application/json": histogram_stats_response}

    histogram_stats_view_func = resource_cls.as_view(
        resource_cls.view_name,
        serializers=histogram_serializers,
        default_media_type=default_media_type,
        ctx={},
    )
    blueprint.add_url_rule(
        f"{url_prefix}/stats",
        view_func=histogram_stats_view_func,
        methods=["GET"],
    )
