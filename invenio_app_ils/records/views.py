# -*- coding: utf-8 -*-
#
# Copyright (C) 2018 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""Invenio App ILS Records views."""

from __future__ import absolute_import, print_function

from flask import Blueprint, abort, current_app, request
from invenio_db import db
from invenio_records_rest.utils import obj_or_import_string
from invenio_records_rest.views import pass_record
from invenio_rest import ContentNegotiatedMethodView
from invenio_rest.errors import FieldError

from invenio_app_ils.circulation.views import need_permissions
from invenio_app_ils.errors import DocumentRequestError
from invenio_app_ils.pidstore.pids import DOCUMENT_PID_TYPE, \
    DOCUMENT_REQUEST_PID_TYPE
from invenio_app_ils.proxies import current_app_ils_extension
from invenio_app_ils.signals import record_viewed


def create_document_stats_blueprint(app):
    """Create document stats blueprint."""
    blueprint = Blueprint(
        "ils_document_stats", __name__, url_prefix=""
    )
    endpoints = app.config.get("RECORDS_REST_ENDPOINTS", [])
    options = endpoints.get(DOCUMENT_PID_TYPE, {})
    default_media_type = options.get("default_media_type", "")
    rec_serializers = options.get("record_serializers", {})
    serializers = {
        mime: obj_or_import_string(func)
        for mime, func in rec_serializers.items()
    }

    stats_view = DocumentStatsResource.as_view(
        DocumentStatsResource.view_name.format(DOCUMENT_PID_TYPE),
        serializers=serializers,
        default_media_type=default_media_type,
    )
    blueprint.add_url_rule(
        "{0}/stats".format(options['item_route']),
        view_func=stats_view,
        methods=["POST"],
    )
    return blueprint


class DocumentStatsResource(ContentNegotiatedMethodView):
    """Document stats resource."""

    view_name = "{}_stats"

    @pass_record
    def post(self, pid, record, **kwargs):
        """Send a signal to count record view for the record stats."""
        data = request.get_json()
        if data.get('event') == 'record-view':
            record_viewed.send(
                current_app._get_current_object(),
                pid=pid,
                record=record,
            )
            return self.make_response(pid, record, 202)
        return DocumentRequestError("Invalid record view request")


def create_document_request_action_blueprint(app):
    """Create document request action blueprint."""
    blueprint = Blueprint(
        "ils_document_request", __name__, url_prefix=""
    )

    endpoints = app.config.get("RECORDS_REST_ENDPOINTS", [])
    options = endpoints.get(DOCUMENT_REQUEST_PID_TYPE, {})
    default_media_type = options.get("default_media_type", "")
    rec_serializers = options.get("record_serializers", {})
    serializers = {
        mime: obj_or_import_string(func)
        for mime, func in rec_serializers.items()
    }

    accept_view = AcceptRequestResource.as_view(
        AcceptRequestResource.view_name.format(DOCUMENT_REQUEST_PID_TYPE),
        serializers=serializers,
        default_media_type=default_media_type,
    )
    blueprint.add_url_rule(
        "{0}/accept".format(options["item_route"]),
        view_func=accept_view,
        methods=["POST"],
    )

    reject_view = RejectRequestResource.as_view(
        RejectRequestResource.view_name.format(DOCUMENT_REQUEST_PID_TYPE),
        serializers=serializers,
        default_media_type=default_media_type,
    )
    blueprint.add_url_rule(
        "{0}/reject".format(options["item_route"]),
        view_func=reject_view,
        methods=["POST"],
    )

    return blueprint


class AcceptRequestResource(ContentNegotiatedMethodView):
    """Accept document request action resource."""

    view_name = "{}_accept_request"

    @need_permissions("document-request-accept")
    @pass_record
    def post(self, pid, record, **kwargs):
        """Accept request post method."""
        raise DocumentRequestError("Accept request is not implemented")


class RejectRequestResource(ContentNegotiatedMethodView):
    """Reject request resource."""

    view_name = "{}_reject_request"

    @need_permissions("document-request-reject")
    @pass_record
    def post(self, pid, record, **kwargs):
        """Reject request post method."""
        data = request.get_json()
        reason = data.get("reason", "")
        if not reason:
            raise DocumentRequestError(
                "Missing required field: reject reason",
                errors=[
                    FieldError(field="reason", message="Reason is required.")
                ]
            )
        record["state"] = "REJECTED"
        record["reject_reason"] = reason
        record.commit()
        db.session.commit()
        current_app_ils_extension.document_request_indexer.index(record)
        return self.make_response(
            pid, record, 202
        )
