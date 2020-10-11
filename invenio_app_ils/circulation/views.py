# -*- coding: utf-8 -*-
#
# Copyright (C) 2018 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""Invenio App ILS Circulation views."""

from flask import Blueprint
from invenio_circulation.links import loan_links_factory
from invenio_circulation.pidstore.pids import CIRCULATION_LOAN_PID_TYPE
from invenio_records_rest.utils import obj_or_import_string
from invenio_records_rest.views import pass_record
from invenio_rest import ContentNegotiatedMethodView

from invenio_app_ils.circulation.loaders import (loan_checkout_loader,
                                                 loan_request_loader,
                                                 loan_update_dates_loader)
from invenio_app_ils.circulation.utils import circulation_overdue_loan_days
from invenio_app_ils.errors import OverdueLoansMailError
from invenio_app_ils.permissions import need_permissions

from .api import checkout_loan, request_loan, update_dates_loan
from .mail.tasks import send_loan_overdue_reminder_mail


def create_circulation_blueprint(app):
    """Add circulation views to the blueprint."""
    blueprint = Blueprint(
        "invenio_app_ils_circulation",
        __name__,
        template_folder="templates",
        url_prefix="",
    )

    endpoints = app.config.get("RECORDS_REST_ENDPOINTS", [])
    options = endpoints.get("loanid", {})
    default_media_type = options.get("default_media_type", "")
    rec_serializers = options.get("record_serializers", {})
    serializers = {
        mime: obj_or_import_string(func)
        for mime, func in rec_serializers.items()
    }

    loan_request = LoanRequestResource.as_view(
        LoanRequestResource.view_name,
        serializers=serializers,
        default_media_type=default_media_type,
        ctx=dict(links_factory=loan_links_factory, loader=loan_request_loader),
    )

    blueprint.add_url_rule(
        "/circulation/loans/request", view_func=loan_request, methods=["POST"]
    )

    loan_checkout = LoanCheckoutResource.as_view(
        LoanCheckoutResource.view_name,
        serializers=serializers,
        default_media_type=default_media_type,
        ctx=dict(
            links_factory=loan_links_factory, loader=loan_checkout_loader
        ),
    )

    blueprint.add_url_rule(
        "/circulation/loans/checkout",
        view_func=loan_checkout,
        methods=["POST"],
    )

    loan_mail_overdue = LoanMailResource.as_view(
        LoanMailResource.view_name.format(CIRCULATION_LOAN_PID_TYPE),
        serializers=serializers,
        default_media_type=default_media_type,
        ctx=dict(links_factory=loan_links_factory),
    )

    blueprint.add_url_rule(
        "{0}/email-overdue".format(options["item_route"]),
        view_func=loan_mail_overdue,
        methods=["POST"],
    )

    loan_update = LoanUpdateDates.as_view(
        LoanUpdateDates.view_name.format(CIRCULATION_LOAN_PID_TYPE),
        serializers=serializers,
        default_media_type=default_media_type,
        ctx=dict(
            links_factory=loan_links_factory, loader=loan_update_dates_loader
        ),
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

        return self.make_response(
            pid, loan, 202, links_factory=self.links_factory
        )


class LoanCheckoutResource(IlsCirculationResource):
    """Loan checkout action resource."""

    view_name = "loan_checkout"

    @need_permissions("circulation-loan-checkout")
    def post(self, **kwargs):
        """Loan checkout post method."""
        data = self.loader()
        pid, loan = checkout_loan(**data)

        return self.make_response(
            pid, loan, 202, links_factory=self.links_factory
        )


class LoanMailResource(IlsCirculationResource):
    """Loan send email."""

    view_name = "{0}_email"

    @need_permissions("circulation-overdue-loan-email")
    @pass_record
    def post(self, pid, record, **kwargs):
        """Loan email post method."""
        days_ago = circulation_overdue_loan_days(record)
        is_overdue = days_ago > 0
        if not is_overdue:
            raise OverdueLoansMailError(description="This loan is not overdue")
        send_loan_overdue_reminder_mail(record, days_ago)
        return self.make_response(
            pid, record, 202, links_factory=self.links_factory
        )


class LoanUpdateDates(IlsCirculationResource):
    """Loan update date."""

    view_name = "{0}_update_dates"

    @need_permissions("circulation-loan-update-dates")
    @pass_record
    def post(self, pid, record, **kwargs):
        """Loan update dates post method."""
        data = self.loader()
        update_dates_loan(record, **data)

        return self.make_response(
            pid, record, 202, links_factory=self.links_factory
        )
