# -*- coding: utf-8 -*-
#
# Copyright (C) 2020 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""Invenio App ILS Document Requests views."""

from __future__ import absolute_import, print_function

from flask import Blueprint
from invenio_db import db
from invenio_records_rest.utils import obj_or_import_string
from invenio_records_rest.views import pass_record
from invenio_rest import ContentNegotiatedMethodView
from invenio_rest.errors import FieldError

from invenio_app_ils.errors import DocumentRequestError
from invenio_app_ils.mail.tasks import send_document_request_status_mail
from invenio_app_ils.permissions import need_permissions
from invenio_app_ils.proxies import current_app_ils

from .api import DOCUMENT_REQUEST_PID_TYPE
from .loaders import document_request_accept_loader, \
    document_request_pending_loader, document_request_reject_loader


def create_document_request_action_blueprint(app):
    """Create document request action blueprint."""
    blueprint = Blueprint("ils_document_request", __name__, url_prefix="")

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
        ctx=dict(loader=document_request_accept_loader),
    )
    blueprint.add_url_rule(
        "{0}/accept".format(options["item_route"]),
        view_func=accept_view,
        methods=["POST"],
    )

    pending_view = PendingRequestResource.as_view(
        PendingRequestResource.view_name.format(DOCUMENT_REQUEST_PID_TYPE),
        serializers=serializers,
        default_media_type=default_media_type,
        ctx=dict(loader=document_request_pending_loader),
    )
    blueprint.add_url_rule(
        "{0}/pending".format(options["item_route"]),
        view_func=pending_view,
        methods=["POST"],
    )

    reject_view = RejectRequestResource.as_view(
        RejectRequestResource.view_name.format(DOCUMENT_REQUEST_PID_TYPE),
        serializers=serializers,
        default_media_type=default_media_type,
        ctx=dict(loader=document_request_reject_loader),
    )
    blueprint.add_url_rule(
        "{0}/reject".format(options["item_route"]),
        view_func=reject_view,
        methods=["POST"],
    )

    return blueprint


class DocumentRequestActionResource(ContentNegotiatedMethodView):
    """Document Request resource."""

    def __init__(self, serializers, ctx, *args, **kwargs):
        """Constructor."""
        super().__init__(serializers, *args, **kwargs)
        for key, value in ctx.items():
            setattr(self, key, value)


class PendingRequestResource(DocumentRequestActionResource):
    """Pending document request action resource."""

    view_name = "{}_pending_request"

    @pass_record
    @need_permissions("document-request-pending")
    def post(self, pid, record, **kwargs):
        """Pending request post method."""
        # expecting remove_fields list of fields to remove
        data = self.loader()
        remove_fields = data.get("remove_fields", [])

        for field in remove_fields:
            del record[field]

        record.commit()
        db.session.commit()
        current_app_ils.document_request_indexer.index(record)
        return self.make_response(pid, record, 202)


class AcceptRequestResource(DocumentRequestActionResource):
    """Accept document request action resource."""

    view_name = "{}_accept_request"

    @pass_record
    @need_permissions("document-request-accept")
    def post(self, pid, record, **kwargs):
        """Accept request post method."""
        data = self.loader()

        document_pid = data.get("document_pid")
        if document_pid:
            record["document_pid"] = document_pid

        physical_item_provider = data.get("physical_item_provider")
        if physical_item_provider:
            record["physical_item_provider"] = physical_item_provider

        state = data.get("state")
        if state:
            record["state"] = state

        record.commit()
        db.session.commit()
        current_app_ils.document_request_indexer.index(record)
        return self.make_response(pid, record, 202)


class RejectRequestResource(DocumentRequestActionResource):
    """Reject request resource."""

    view_name = "{}_reject_request"

    @pass_record
    @need_permissions("document-request-reject")
    def post(self, pid, record, **kwargs):
        """Reject request post method."""
        data = self.loader()
        reject_reason = data.get("reject_reason")
        document_pid = data.get("document_pid")

        if not reject_reason:
            raise DocumentRequestError(
                "Missing required field: reject reason",
                errors=[
                    FieldError(
                        field="reject_reason",
                        message="Reject reason is required.",
                    )
                ],
            )
        if reject_reason == "IN_CATALOG" and not document_pid:
            raise DocumentRequestError(
                "Document PID required for reject reason {}".format(
                    reject_reason
                ),
                errors=[
                    FieldError(
                        field="document_pid", message="DocumentPID is required."
                    )
                ],
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
