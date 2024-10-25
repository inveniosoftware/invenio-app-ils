# -*- coding: utf-8 -*-
#
# Copyright (C) 2018 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""Invenio App ILS Circulation views."""

from flask import Blueprint, abort, request
from flask_login import current_user
from invenio_circulation.links import loan_links_factory
from invenio_circulation.pidstore.pids import CIRCULATION_LOAN_PID_TYPE
from invenio_records_rest.utils import obj_or_import_string
from invenio_records_rest.views import pass_record
from invenio_rest import ContentNegotiatedMethodView

from invenio_app_ils.circulation.loaders import (
    loan_checkout_loader,
    loan_request_loader,
    loan_self_checkout_loader,
    loan_update_dates_loader,
    loans_bulk_update_loader,
)
from invenio_app_ils.circulation.utils import circulation_overdue_loan_days
from invenio_app_ils.errors import (
    DocumentOverbookedError,
    ItemCannotCirculateError,
    ItemHasActiveLoanError,
    ItemNotFoundError,
    LoanSelfCheckoutDocumentOverbooked,
    LoanSelfCheckoutItemActiveLoan,
    LoanSelfCheckoutItemInvalidStatus,
    LoanSelfCheckoutItemNotFound,
    MissingRequiredParameterError,
    OverdueLoansNotificationError,
)
from invenio_app_ils.items.api import ITEM_PID_TYPE
from invenio_app_ils.permissions import need_permissions

from ..patrons.api import patron_exists
from .api import (
    bulk_extend_loans,
    checkout_loan,
    request_loan,
    self_checkout,
    self_checkout_get_item_by_barcode,
    update_dates_loan,
)
from .notifications.api import (
    send_bulk_extend_notification,
    send_loan_overdue_reminder_notification,
)
from .serializers import bulk_extend_v1_response


def create_circulation_blueprint(app):
    """Add circulation views to the blueprint."""
    blueprint = Blueprint(
        "invenio_app_ils_circulation",
        __name__,
        template_folder="templates",
        url_prefix="",
    )

    options = app.config["RECORDS_REST_ENDPOINTS"][CIRCULATION_LOAN_PID_TYPE]
    default_media_type = options.get("default_media_type", "")
    rec_serializers = options.get("record_serializers", {})
    serializers = {
        mime: obj_or_import_string(func) for mime, func in rec_serializers.items()
    }

    # /request
    loan_request = LoanRequestResource.as_view(
        LoanRequestResource.view_name,
        serializers=serializers,
        default_media_type=default_media_type,
        ctx=dict(links_factory=loan_links_factory, loader=loan_request_loader),
    )
    blueprint.add_url_rule(
        "/circulation/loans/request", view_func=loan_request, methods=["POST"]
    )

    # /checkout
    loan_checkout = LoanCheckoutResource.as_view(
        LoanCheckoutResource.view_name,
        serializers=serializers,
        default_media_type=default_media_type,
        ctx=dict(links_factory=loan_links_factory, loader=loan_checkout_loader),
    )
    blueprint.add_url_rule(
        "/circulation/loans/checkout",
        view_func=loan_checkout,
        methods=["POST"],
    )

    # /self-checkout
    item_rec_serializers = app.config["RECORDS_REST_ENDPOINTS"][ITEM_PID_TYPE].get(
        "record_serializers", {}
    )
    item_serializers = {
        mime: obj_or_import_string(func) for mime, func in item_rec_serializers.items()
    }
    loan_self_checkout_item = LoanSelfCheckoutResource.as_view(
        LoanSelfCheckoutResource.view_name,
        serializers={},  # required, even if `method_serializers` will override it
        method_serializers={
            "GET": item_serializers,
            "POST": serializers,  # default loan serializers
        },
        default_media_type=default_media_type,
        ctx=dict(
            loan_links_factory=loan_links_factory, loader=loan_self_checkout_loader
        ),
    )
    blueprint.add_url_rule(
        "/circulation/loans/self-checkout",
        view_func=loan_self_checkout_item,
        methods=["GET", "POST"],
    )

    # /notification-overdue
    loan_notification_overdue = LoanNotificationResource.as_view(
        LoanNotificationResource.view_name.format(CIRCULATION_LOAN_PID_TYPE),
        serializers=serializers,
        default_media_type=default_media_type,
        ctx=dict(links_factory=loan_links_factory),
    )
    blueprint.add_url_rule(
        "{0}/notification-overdue".format(options["item_route"]),
        view_func=loan_notification_overdue,
        methods=["POST"],
    )

    # /bulk-extend
    bulk_loan_extension_serializers = {"application/json": bulk_extend_v1_response}

    bulk_loan_extension = BulkLoanExtensionResource.as_view(
        BulkLoanExtensionResource.view_name,
        serializers=bulk_loan_extension_serializers,
        default_media_type=default_media_type,
        ctx=dict(loader=loans_bulk_update_loader),
    )
    blueprint.add_url_rule(
        "/circulation/bulk-extend",
        view_func=bulk_loan_extension,
        methods=["POST"],
    )

    # /update-dates
    loan_update = LoanUpdateDatesResource.as_view(
        LoanUpdateDatesResource.view_name.format(CIRCULATION_LOAN_PID_TYPE),
        serializers=serializers,
        default_media_type=default_media_type,
        ctx=dict(links_factory=loan_links_factory, loader=loan_update_dates_loader),
    )
    blueprint.add_url_rule(
        "{0}/update-dates".format(options["item_route"]),
        view_func=loan_update,
        methods=["POST"],
    )

    return blueprint


class IlsCirculationResource(ContentNegotiatedMethodView):
    """ILS resource."""

    def __init__(self, serializers, ctx, *args, **kwargs):
        """Constructor."""
        super().__init__(serializers, *args, **kwargs)
        for key, value in ctx.items():
            setattr(self, key, value)


class LoanRequestResource(IlsCirculationResource):
    """Loan request action resource."""

    view_name = "loan_request"

    @need_permissions("circulation-loan-request")
    def post(self, **kwargs):
        """Loan request post method."""
        data = self.loader()
        pid, loan = request_loan(**data)

        return self.make_response(pid, loan, 202, links_factory=self.links_factory)


class LoanCheckoutResource(IlsCirculationResource):
    """Loan checkout action resource."""

    view_name = "loan_checkout"

    @need_permissions("circulation-loan-checkout")
    def post(self, **kwargs):
        """Loan checkout post method."""
        data = self.loader()
        pid, loan = checkout_loan(**data)

        return self.make_response(pid, loan, 202, links_factory=self.links_factory)


class LoanSelfCheckoutResource(IlsCirculationResource):
    """Loan self-checkout action resource."""

    view_name = "loan_self_checkout"

    @need_permissions("circulation-loan-self-checkout")
    def get(self, **kwargs):
        """Loan self-checkout GET method to retrieve items."""
        try:
            barcode = request.args["barcode"].upper()
            assert barcode
        except (KeyError, AssertionError):
            msg = "Parameter `barcode` is missing"
            raise MissingRequiredParameterError(description=msg)

        try:
            pid, item = self_checkout_get_item_by_barcode(barcode)
        except ItemCannotCirculateError:
            raise LoanSelfCheckoutItemInvalidStatus()
        except ItemHasActiveLoanError:
            raise LoanSelfCheckoutItemActiveLoan()
        except DocumentOverbookedError:
            raise LoanSelfCheckoutDocumentOverbooked()
        except ItemNotFoundError:
            raise LoanSelfCheckoutItemNotFound()

        return self.make_response(pid, item, 200)

    @need_permissions("circulation-loan-self-checkout")
    def post(self, **kwargs):
        """Loan self-checkout POST method to perform the checkout."""
        data = self.loader()
        try:
            pid, loan = self_checkout(**data)
        except ItemCannotCirculateError:
            raise LoanSelfCheckoutItemInvalidStatus()
        except ItemHasActiveLoanError:
            raise LoanSelfCheckoutItemActiveLoan()
        except DocumentOverbookedError:
            raise LoanSelfCheckoutDocumentOverbooked()

        return self.make_response(pid, loan, 202, links_factory=self.loan_links_factory)


class BulkLoanExtensionResource(IlsCirculationResource):
    """Bulk loan extension resource."""

    view_name = "bulk_loan_extension"

    @need_permissions("bulk-loan-extension")
    def post(self, **kwargs):
        """Loan checkout post method."""
        data = self.loader()
        if "patron_pid" not in data:
            data["patron_pid"] = str(current_user.id)
        if not patron_exists(data["patron_pid"]):
            abort(400)
        extended_loans, not_extended_loans = bulk_extend_loans(**data)
        if extended_loans:
            send_bulk_extend_notification(
                extended_loans, not_extended_loans, patron_pid=data["patron_pid"]
            )
        return self.make_response(extended_loans, not_extended_loans, 202)


class LoanNotificationResource(IlsCirculationResource):
    """Loan send notification."""

    view_name = "{0}_notification"

    @need_permissions("circulation-overdue-loan-notification")
    @pass_record
    def post(self, pid, record, **kwargs):
        """Loan notification post method."""
        days_ago = circulation_overdue_loan_days(record)
        is_overdue = days_ago > 0
        if not is_overdue:
            raise OverdueLoansNotificationError(description="This loan is not overdue")
        send_loan_overdue_reminder_notification(
            record, days_ago, is_manually_triggered=True
        )

        return self.make_response(pid, record, 202, links_factory=self.links_factory)


class LoanUpdateDatesResource(IlsCirculationResource):
    """Loan update date."""

    view_name = "{0}_update_dates"

    @need_permissions("circulation-loan-update-dates")
    @pass_record
    def post(self, pid, record, **kwargs):
        """Loan update dates post method."""
        data = self.loader()
        update_dates_loan(record, **data)

        return self.make_response(pid, record, 202, links_factory=self.links_factory)
