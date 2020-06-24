# -*- coding: utf-8 -*-
#
# Copyright (C) 2020 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""Invenio App ILS Document Requests views."""

from flask import Blueprint, current_app
from invenio_db import db
from invenio_records_rest.utils import obj_or_import_string
from invenio_records_rest.views import need_record_permission, pass_record
from invenio_rest import ContentNegotiatedMethodView
from invenio_rest.errors import FieldError

from invenio_app_ils.errors import DocumentRequestError
from invenio_app_ils.permissions import need_permissions
from invenio_app_ils.proxies import current_app_ils

from .api import DOCUMENT_REQUEST_PID_TYPE
from .loaders import document_request_document_loader as dr_document_loader
from .loaders import document_request_provider_loader as dr_provider_loader
from .loaders import document_request_reject_loader as dr_reject_loader
from .mail.tasks import send_document_request_mail


def create_document_request_action_blueprint(app):
    """Create document request action blueprint."""

    def _add_view(bp, view_class, view_route, view_loader, methods=["POST"]):
        """Add view to blueprint."""
        endpoints = app.config.get("RECORDS_REST_ENDPOINTS", [])
        options = endpoints.get(DOCUMENT_REQUEST_PID_TYPE, {})
        default_media_type = options.get("default_media_type", "")
        rec_serializers = options.get("record_serializers", {})
        serializers = {
            mime: obj_or_import_string(func)
            for mime, func in rec_serializers.items()
        }

        blueprint.add_url_rule(
            "{0}/{1}".format(options["item_route"], view_route),
            view_func=view_class.as_view(
                view_class.view_name.format(DOCUMENT_REQUEST_PID_TYPE),
                serializers=serializers,
                default_media_type=default_media_type,
                ctx=dict(loader=view_loader),
            ),
            methods=methods,
        )

    blueprint = Blueprint(
        "invenio_app_ils_document_requests",
        __name__,
        template_folder="templates",
        url_prefix="",
    )

    _add_view(blueprint, DocumentRequestAcceptResource, "accept", None)
    _add_view(
        blueprint, DocumentRequestRejectResource, "reject", dr_reject_loader
    )
    _add_view(
        blueprint,
        DocumentRequestDocumentResource,
        "document",
        dr_document_loader,
        ["POST", "DELETE"],
    )
    _add_view(
        blueprint,
        DocumentRequestProviderResource,
        "provider",
        dr_provider_loader,
        ["POST", "DELETE"],
    )
    return blueprint


class DocumentRequestActionResource(ContentNegotiatedMethodView):
    """Document Request resource."""

    def __init__(self, serializers, ctx, *args, **kwargs):
        """Constructor."""
        super().__init__(serializers, *args, **kwargs)
        for key, value in ctx.items():
            setattr(self, key, value)


class DocumentRequestDocumentResource(DocumentRequestActionResource):
    """Endpoint to manage the Document of the Document Request."""

    view_name = "{}_document"

    @pass_record
    @need_permissions("document-request-actions")
    def post(self, pid, record, **kwargs):
        """Add or replace a Document in Document Request."""
        if record["state"] != "PENDING":
            raise DocumentRequestError(
                "You cannot add Document when the Document Request "
                "is in state: {}".format(record["state"])
            )

        data = self.loader()
        record["document_pid"] = data.get("document_pid")
        record.commit()
        db.session.commit()
        current_app_ils.document_request_indexer.index(record)
        return self.make_response(pid, record, 202)

    @pass_record
    @need_permissions("document-request-actions")
    def delete(self, pid, record, *kwargs):
        """Remove Document from Document Request."""
        self.loader()

        if record["state"] != "PENDING":
            raise DocumentRequestError(
                "You cannot remove the Document when the Document Request "
                "is in state: {}".format(record["state"])
            )

        if "document_pid" in record:
            del record["document_pid"]

        record.commit()
        db.session.commit()
        current_app_ils.document_request_indexer.index(record)
        return self.make_response(pid, record, 202)


class DocumentRequestProviderResource(DocumentRequestActionResource):
    """Endpoint to manage the Provider of the Document Request."""

    view_name = "{}_provider"

    @pass_record
    @need_permissions("document-request-actions")
    def post(self, pid, record, **kwargs):
        """Add or replace Provider in Document Request."""
        data = self.loader()

        if record["state"] != "PENDING":
            raise DocumentRequestError(
                "You cannot add Provider when the Document Request "
                "is in state: {}".format(record["state"])
            )

        physical_item_provider = data.get("physical_item_provider")
        if not physical_item_provider:
            raise DocumentRequestError("physical_item_provider is required")

        record["physical_item_provider"] = physical_item_provider
        record.commit()
        db.session.commit()
        current_app_ils.document_request_indexer.index(record)
        return self.make_response(pid, record, 202)

    @pass_record
    @need_permissions("document-request-actions")
    def delete(self, pid, record, **kwargs):
        """Remove Provider from Document Request."""
        if record["state"] != "PENDING":
            raise DocumentRequestError(
                "You cannot remove the Provider when the Document Request "
                "is in state: {}".format(record["state"])
            )

        if "physical_item_provider" in record:
            del record["physical_item_provider"]

        record.commit()
        db.session.commit()
        current_app_ils.document_request_indexer.index(record)
        return self.make_response(pid, record, 202)


class DocumentRequestAcceptResource(DocumentRequestActionResource):
    """Accept document request action resource."""

    view_name = "{}_accept"

    @pass_record
    @need_permissions("document-request-actions")
    def post(self, pid, record, **kwargs):
        """Accept request post method."""
        if record["state"] != "PENDING":
            raise DocumentRequestError(
                "You cannot change state to 'ACCEPTED' when the Document "
                "Request is in state: {}".format(record["state"])
            )

        if "document_pid" not in record:
            raise DocumentRequestError(
                "document_pid is required for the Document Request to be "
                "accepted."
            )

        if "physical_item_provider" not in record:
            raise DocumentRequestError(
                "physical_item_provider is required for the Document Request "
                "to be accepted."
            )

        record["state"] = "ACCEPTED"
        record.commit()
        db.session.commit()
        current_app_ils.document_request_indexer.index(record)
        send_document_request_mail(record, action="request_accepted")
        return self.make_response(pid, record, 202)


class DocumentRequestRejectResource(DocumentRequestActionResource):
    """Reject request resource."""

    view_name = "{}_reject"

    def reject_permission_factory(self, record):
        """Reject permission factory."""
        action = "document-request-decline"
        permissions = current_app.config["ILS_VIEWS_PERMISSIONS_FACTORY"]
        view_permission = permissions(action)
        return view_permission(record)

    @pass_record
    @need_record_permission("reject_permission_factory")
    def post(self, pid, record, **kwargs):
        """Reject request post method."""
        data = self.loader()
        reject_reason = data.get("reject_reason")
        document_pid = data.get("document_pid")

        if record["state"] != "PENDING":
            raise DocumentRequestError(
                "You cannot cancel a Document Request that "
                "is in state: {}".format(record["state"])
            )

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
                        field="document_pid",
                        message="DocumentPID is required.",
                    )
                ],
            )

        if reject_reason == "IN_CATALOG":
            record["document_pid"] = document_pid

        record["state"] = "REJECTED"
        record["reject_reason"] = reject_reason

        record.commit()
        db.session.commit()
        current_app_ils.document_request_indexer.index(record)
        send_document_request_mail(record, action="request_rejected")
        return self.make_response(pid, record, 202)
