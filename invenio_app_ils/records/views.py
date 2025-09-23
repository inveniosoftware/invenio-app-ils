# -*- coding: utf-8 -*-
#
# Copyright (C) 2018-2020 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""Invenio App ILS Records views."""

from flask import Blueprint, abort, current_app, request
from flask_login import current_user
from invenio_files_rest.models import ObjectVersion
from invenio_records_rest.utils import obj_or_import_string
from invenio_records_rest.views import pass_record
from invenio_rest import ContentNegotiatedMethodView

from invenio_app_ils.documents.api import DOCUMENT_PID_TYPE
from invenio_app_ils.eitems.api import EITEM_PID_TYPE
from invenio_app_ils.errors import StatsError
from invenio_app_ils.permissions import backoffice_read_permission
from invenio_app_ils.records.permissions import RecordPermission
from invenio_app_ils.series.api import SERIES_PID_TYPE
from invenio_app_ils.signals import file_downloaded, record_viewed


def create_document_stats_blueprint(app):
    """Create document stats blueprint."""
    blueprint = Blueprint("ils_document_stats", __name__, url_prefix="")
    endpoints = app.config.get("RECORDS_REST_ENDPOINTS", [])

    def register_view(pid_type):
        options = endpoints.get(pid_type, {})
        default_media_type = options.get("default_media_type", "")
        rec_serializers = options.get("record_serializers", {})
        serializers = {
            mime: obj_or_import_string(func) for mime, func in rec_serializers.items()
        }

        stats_view = DocumentStatsResource.as_view(
            DocumentStatsResource.view_name.format(pid_type),
            serializers=serializers,
            default_media_type=default_media_type,
        )
        blueprint.add_url_rule(
            "{0}/stats".format(options["item_route"]),
            view_func=stats_view,
            methods=["POST"],
        )

    register_view(DOCUMENT_PID_TYPE)
    register_view(SERIES_PID_TYPE)
    register_view(EITEM_PID_TYPE)
    return blueprint


class DocumentStatsResource(ContentNegotiatedMethodView):
    """Document stats resource."""

    view_name = "{}_stats"

    @pass_record
    def post(self, pid, record, **kwargs):
        """Send a signal to count record view for the record stats."""
        factory = RecordPermission(record, "read")
        if not factory.is_public() and not backoffice_read_permission().can():
            if not current_user.is_authenticated:
                abort(401)
            abort(403)
        data = request.get_json()
        event_name = data.get("event")
        if event_name == "record-view":
            record_viewed.send(
                current_app._get_current_object(),
                pid=pid,
                record=record,
            )
            return self.make_response(pid, record, 202)
        elif event_name == "file-download":
            if "key" not in data:
                abort(406, "File key is required")
            if "bucket_id" not in record:
                abort(406, "Record has no bucket")
            obj = ObjectVersion.get(record["bucket_id"], data["key"])
            file_downloaded.send(
                current_app._get_current_object(), obj=obj, record=record
            )
            return self.make_response(pid, record, 202)
        return StatsError(
            description="Invalid stats event request: {}".format(event_name)
        )
