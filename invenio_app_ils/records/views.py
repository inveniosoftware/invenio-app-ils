# -*- coding: utf-8 -*-
#
# Copyright (C) 2018 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""Invenio App ILS Records views."""

from __future__ import absolute_import, print_function

from flask import Blueprint, current_app, jsonify
from invenio_accounts.views.rest import UserInfoView, default_user_payload
from invenio_db import db
from invenio_files_rest.models import ObjectVersion
from invenio_files_rest.signals import file_downloaded
from invenio_records_rest.utils import obj_or_import_string
from invenio_records_rest.views import pass_record
from invenio_rest import ContentNegotiatedMethodView
from invenio_rest.errors import FieldError

from invenio_app_ils.documents.api import DOCUMENT_PID_TYPE
from invenio_app_ils.errors import DocumentRequestError, StatsError
from invenio_app_ils.mail.tasks import send_document_request_status_mail
from invenio_app_ils.permissions import need_permissions
from invenio_app_ils.pidstore.pids import DOCUMENT_REQUEST_PID_TYPE, \
    EITEM_PID_TYPE
from invenio_app_ils.proxies import current_app_ils
from invenio_app_ils.signals import record_viewed


def create_document_stats_blueprint(app):
    """Create document stats blueprint."""
    blueprint = Blueprint("ils_document_stats", __name__, url_prefix="")
    endpoints = app.config.get("RECORDS_REST_ENDPOINTS", [])

    def register_view(pid_type):
        options = endpoints.get(pid_type, {})
        default_media_type = options.get("default_media_type", "")
        rec_serializers = options.get("record_serializers", {})
        serializers = {
            mime: obj_or_import_string(func)
            for mime, func in rec_serializers.items()
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
    register_view(EITEM_PID_TYPE)
    return blueprint


class DocumentStatsResource(ContentNegotiatedMethodView):
    """Document stats resource."""

    view_name = "{}_stats"

    @pass_record
    def post(self, pid, record, **kwargs):
        """Send a signal to count record view for the record stats."""
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
                current_app._get_current_object(),
                obj=obj, record=record)
            return self.make_response(pid, record, 202)
        return StatsError(
            description="Invalid stats event request: {}".format(event_name)
        )


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


class UserInfoResource(UserInfoView):
    """Retrieve current user's information."""

    def response(self, user):
        """Return response with current user's information."""
        user_payload = default_user_payload(user)
        user_payload["roles"] = [role.name for role in user.roles]
        user_payload.update(
            dict(
                locationPid=current_app.config["ILS_DEFAULT_LOCATION_PID"],
                username=user.email
            ))
        return jsonify(user_payload), 200


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
        reject_reason = data.get("reject_reason")
        document_pid = data.get("document_pid")

        if not reject_reason:
            raise DocumentRequestError(
                "Missing required field: reject reason",
                errors=[
                    FieldError(
                        field="reject_reason",
                        message="Reject reason is required."
                    )
                ]
            )
        if reject_reason == "IN_CATALOG" and not document_pid:
            raise DocumentRequestError(
                "Document PID required for reject reason {}".format(
                    reject_reason
                ),
                errors=[
                    FieldError(
                        field="document_pid",
                        message="DocumentPID is required."
                    )
                ]
            )
        record["state"] = "REJECTED"
        record["reject_reason"] = reject_reason
        if reject_reason == "IN_CATALOG":
            record["document_pid"] = document_pid

        record.commit()
        db.session.commit()
        current_app_ils.document_request_indexer.index(record)
        send_document_request_status_mail(record)

        return self.make_response(pid, record, 202)
