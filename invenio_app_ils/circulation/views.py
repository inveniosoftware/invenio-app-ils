# -*- coding: utf-8 -*-
#
# Copyright (C) 2018 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""Invenio App ILS Circulation views."""

from __future__ import absolute_import, print_function

import datetime

from flask import Blueprint, request
from invenio_circulation.links import loan_links_factory
from invenio_circulation.pidstore.pids import CIRCULATION_LOAN_FETCHER, \
    CIRCULATION_LOAN_PID_TYPE
from invenio_pidstore import current_pidstore
from invenio_records_rest.utils import obj_or_import_string
from invenio_records_rest.views import pass_record
from invenio_rest import ContentNegotiatedMethodView

from invenio_app_ils.circulation.loaders import loan_checkout_loader, \
    loan_request_loader
from invenio_app_ils.circulation.utils import circulation_overdue_loan_days
from invenio_app_ils.errors import InvalidParameterError, OverdueLoansMailError
from invenio_app_ils.permissions import need_permissions

from .api import checkout_loan, request_loan
from .mail.tasks import send_loan_overdue_reminder_mail


def create_circulation_blueprint(app):
    """Add circulation views to the blueprint."""
    blueprint = Blueprint(
        "invenio_app_ils_circulation", __name__, url_prefix=""
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

    loan_in_date_range = LoanInDateRange.as_view(
        LoanInDateRange.view_name.format(CIRCULATION_LOAN_PID_TYPE),
        serializers=serializers,
        default_media_type=default_media_type,
        ctx=dict(links_factory=loan_links_factory),
    )

    blueprint.add_url_rule(
        "{0}/in-date-range".format(options["item_route"]),
        view_func=loan_in_date_range,
        methods=["GET"],
    )
    return blueprint


class IlsCirculationResource(ContentNegotiatedMethodView):
    """ILS resource."""

    def __init__(self, serializers, ctx, *args, **kwargs):
        """Constructor."""
        super(IlsCirculationResource, self).__init__(
            serializers, *args, **kwargs
        )
        for key, value in ctx.items():
            setattr(self, key, value)


class LoanInDateRange(IlsCirculationResource):
    view_name = "loan_in_date_range"

    def _validate_start_date_range(self):
        """Validate start date range parameters."""
        def validate_date(param, date):
            """Validate a date."""
            try:
                return datetime.strptime(date, "%Y-%m-%d")
            except ValueError:
                msg = "Parameter '{}' is invalid: {}".format(param, date)
                raise InvalidParameterError(description=msg)

        from_date = request.args.get("from_date", None)
        from_date_obj = None
        to_date = request.args.get("to_date", None)
        to_date_obj = None

        if from_date:
            from_date_obj = validate_date("from_date", from_date)
        if to_date:
            to_date_obj = validate_date("to_date", to_date)

        if from_date_obj and to_date_obj and to_date_obj < from_date_obj:
            msg = "Parameter 'to_date' cannot be before 'from_date'."
            raise InvalidParameterError(description=msg)

        return from_date, to_date

    @need_permissions("circulation-loan-search")
    def get(self, **kwargs):
        """Loan request post method."""

        from_date, to_date = self._validate_start_date_range()
        loans_in_date_range = loans_in_date_range(from_date, to_date)
        return self.make_response(
            pid_fetcher=current_pidstore.fetchers[CIRCULATION_LOAN_FETCHER],
            search_result=loans_in_date_range,
        )


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
        if not circulation_overdue_loan_days(record) > 0:
            raise OverdueLoansMailError(description="This loan is not overdue")
        send_loan_overdue_reminder_mail(record)
        return self.make_response(
            pid, record, 202, links_factory=self.links_factory
        )
