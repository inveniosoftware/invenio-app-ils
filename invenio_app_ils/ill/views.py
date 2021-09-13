# -*- coding: utf-8 -*-
#
# Copyright (C) 2020 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""Invenio App ILS ILL views."""

from flask import Blueprint, current_app
from invenio_db import db
from invenio_records_rest.utils import obj_or_import_string
from invenio_records_rest.views import need_record_permission, pass_record
from invenio_rest import ContentNegotiatedMethodView

from invenio_app_ils.permissions import need_permissions

from .api import BORROWING_REQUEST_PID_TYPE
from .errors import ILLError
from .loaders import (
    patron_loan_create_action_loader,
    patron_loan_extension_accept_loader,
    patron_loan_extension_decline_loader,
    patron_loan_extension_request_loader,
)
from .notifications.api import send_ill_notification
from .proxies import current_ils_ill


def create_ill_blueprint(app):
    """Create ILL blueprint."""
    blueprint = Blueprint(
        "invenio_app_ils_ill",
        __name__,
        template_folder="templates",
        url_prefix="",
    )

    endpoints = app.config.get("RECORDS_REST_ENDPOINTS", [])
    options = endpoints.get(BORROWING_REQUEST_PID_TYPE, {})
    default_media_type = options.get("default_media_type", "")
    rec_serializers = options.get("record_serializers", {})
    serializers = {
        mime: obj_or_import_string(func)
        for mime, func in rec_serializers.items()
    }

    def create_view(view_cls, path, loader):
        """Create view for an action."""
        view = view_cls.as_view(
            view_cls.view_name.format(BORROWING_REQUEST_PID_TYPE),
            serializers=serializers,
            default_media_type=default_media_type,
            ctx=dict(loader=loader),
        )
        blueprint.add_url_rule(
            "{0}/{1}".format(options["item_route"], path),
            view_func=view,
            methods=["POST"],
        )

    create_view(
        PatronLoanCreateActionResource,
        "patron-loan/create",
        patron_loan_create_action_loader,
    )
    create_view(
        RequestPatronLoanExtensionResource,
        "patron-loan/extension/request",
        patron_loan_extension_request_loader,
    )
    create_view(
        AcceptPatronLoanExtensionResource,
        "patron-loan/extension/accept",
        patron_loan_extension_accept_loader,
    )
    create_view(
        DeclinePatronLoanExtensionResource,
        "patron-loan/extension/decline",
        patron_loan_extension_decline_loader,
    )

    return blueprint


class ILLActionResource(ContentNegotiatedMethodView):
    """ILL action resource."""

    def __init__(self, serializers, ctx, *args, **kwargs):
        """Constructor."""
        super().__init__(serializers, *args, **kwargs)
        for key, value in ctx.items():
            setattr(self, key, value)


class PatronLoanCreateActionResource(ILLActionResource):
    """Create loan action resource."""

    view_name = "{}_create_loan"

    @pass_record
    @need_permissions("ill-brwreq-patron-loan-create")
    def post(self, pid, record, **kwargs):
        """Create loan action implementation."""
        data = self.loader()

        record.patron_loan.create(
            start_date=data["loan_start_date"],
            end_date=data["loan_end_date"],
            transaction_location_pid=data["transaction_location_pid"],
        )

        record.commit()
        db.session.commit()
        current_ils_ill.borrowing_request_indexer_cls().index(record)
        return self.make_response(pid, record, 200)


class ILLPatronLoanExtensionActionResource(ILLActionResource):
    """ILL extension action resource."""

    def validate_loan(self, record):
        """Validate that the extension action can be performed."""
        loan = record.patron_loan.get()
        is_loan_active = (
            loan["state"]
            in current_app.config["CIRCULATION_STATES_LOAN_ACTIVE"]
        )
        if not is_loan_active:
            raise ILLError("This interlibrary loan is not active.")

        return loan


class RequestPatronLoanExtensionResource(ILLPatronLoanExtensionActionResource):
    """Request extensions endpoint."""

    view_name = "{}_request_extension"

    def request_extension_permission_factory(self, record):
        """Request extension permission factory."""
        action = "ill-brwreq-patron-loan-extension-request"
        permissions = current_app.config["ILS_VIEWS_PERMISSIONS_FACTORY"]
        view_permission = permissions(action)
        return view_permission(record)

    @pass_record
    @need_record_permission("request_extension_permission_factory")
    def post(self, pid, record, **kwargs):
        """Request extension action implementation."""
        self.loader()
        self.validate_loan(record)

        record.patron_loan.extension.request()

        record.commit()
        db.session.commit()
        current_ils_ill.borrowing_request_indexer_cls().index(record)
        send_ill_notification(record, action="extension_requested")
        return self.make_response(pid, record, 200)


class AcceptPatronLoanExtensionResource(ILLPatronLoanExtensionActionResource):
    """Accept extensions endpoint."""

    view_name = "{}_accept_extension"

    @pass_record
    @need_permissions("ill-brwreq-patron-loan-extension-accept")
    def post(self, pid, record, **kwargs):
        """Accept extension action implementation."""
        data = self.loader()
        loan = self.validate_loan(record)

        record.patron_loan.extension.accept(
            data["loan_end_date"],
            transaction_location_pid=data["transaction_location_pid"],
            loan=loan,
        )

        record.commit()
        db.session.commit()
        current_ils_ill.borrowing_request_indexer_cls().index(record)
        send_ill_notification(record, action="extension_accepted")
        return self.make_response(pid, record, 200)


class DeclinePatronLoanExtensionResource(ILLPatronLoanExtensionActionResource):
    """Decline extensions endpoint."""

    view_name = "{}_decline_extension"

    @pass_record
    @need_permissions("ill-brwreq-patron-loan-extension-decline")
    def post(self, pid, record, **kwargs):
        """Decline extension action implementation."""
        self.loader()
        self.validate_loan(record)

        record.patron_loan.extension.decline()

        record.commit()
        db.session.commit()
        current_ils_ill.borrowing_request_indexer_cls().index(record)
        send_ill_notification(record, action="extension_declined")
        return self.make_response(pid, record, 200)
